import { create } from 'zustand';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, getFirestore, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { app } from '../firebase';

interface Application {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  applicationDate: string;
  status: string;
  description: string;
  contractType: string;
}

interface ApplicationStats {
  totalApplications: number;
  statusDistribution: { name: string; value: number; }[];
  contractTypeDistribution: { name: string; value: number; }[];
  upcomingInterviews: { title: string; company: string; date: string; }[];
  successRate: number;
  averageResponseTime: number;
}

interface ApplicationStore {
  applications: Application[];
  stats: ApplicationStats;
  isLoading: boolean;
  error: string | null;
  fetchApplications: () => void;
  addApplication: (application: Omit<Application, 'id'>) => Promise<void>;
  updateApplication: (id: string, application: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  calculateStats: (applications: Application[]) => void;
}

const initialStats: ApplicationStats = {
  totalApplications: 0,
  statusDistribution: [],
  contractTypeDistribution: [],
  upcomingInterviews: [],
  successRate: 0,
  averageResponseTime: 0
};

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  stats: initialStats,
  isLoading: false,
  error: null,

  fetchApplications: () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      set({ error: 'Utilisateur non connecté', isLoading: false });
      return;
    }

    set({ isLoading: true });

    const db = getFirestore(app);
    const q = query(
      collection(db, 'applications'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const applicationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[];
        
        set({ applications: applicationsData, isLoading: false });
        get().calculateStats(applicationsData);
      },
      (error) => {
        console.error('Erreur lors du chargement des données:', error);
        set({ error: error.message, isLoading: false });
      }
    );

    return unsubscribe;
  },

  addApplication: async (application) => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const db = getFirestore(app);
      await addDoc(collection(db, 'applications'), {
        ...application,
        userId,
        createdAt: new Date(),
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
      throw error;
    }
  },

  updateApplication: async (id, application) => {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, 'applications', id), application);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
      throw error;
    }
  },

  deleteApplication: async (id) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, 'applications', id));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
      throw error;
    }
  },

  calculateStats: (applications) => {
    const today = new Date();
    
    // Calculate total applications
    const totalApplications = applications.length;

    // Calculate success rate
    const successfulApplications = applications.filter(app => 
      app.status === 'Accepté' || app.status === 'En négociation'
    ).length;
    const successRate = totalApplications > 0 ? (successfulApplications / totalApplications) * 100 : 0;

    // Calculate average response time
    const responseTimes = applications
      .filter(app => app.status !== 'En attente')
      .map(app => {
        const applicationDate = new Date(app.applicationDate);
        return Math.floor((today.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
      });
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((acc, curr) => acc + curr, 0) / responseTimes.length 
      : 0;

    // Calculate status distribution
    const statusCount: { [key: string]: number } = {};
    applications.forEach(app => {
      const status = app.status || 'En attente';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    const statusDistribution = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
    
    // Calculate contract type distribution
    const contractCount: { [key: string]: number } = {};
    applications.forEach(app => {
      const contractType = app.contractType || 'Non spécifié';
      contractCount[contractType] = (contractCount[contractType] || 0) + 1;
    });
    
    const contractTypeDistribution = Object.entries(contractCount).map(([name, value]) => ({
      name,
      value
    }));
    
    // Get upcoming interviews
    const upcomingInterviews = applications
      .filter(app => app.status === 'Entretien planifié')
      .map(app => ({
        title: app.title,
        company: app.company,
        date: app.applicationDate
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    set({
      stats: {
        totalApplications,
        statusDistribution,
        contractTypeDistribution,
        upcomingInterviews,
        successRate,
        averageResponseTime
      }
    });
  }
}));