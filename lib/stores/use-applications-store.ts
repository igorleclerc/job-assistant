import { create } from "zustand";
import { type Application } from "@/lib/schemas/application";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";

type ViewMode = "table" | "grid";

interface ApplicationsState {
  applications: Application[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  viewMode: ViewMode;
  fetchApplications: () => Promise<void>;
  addApplication: (data: Application) => Promise<void>;
  editApplication: (data: Application) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setViewMode: (mode: ViewMode) => void;
}

const STORAGE_KEY = "applications_view_mode";

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applications: [],
  isLoading: false,
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  viewMode: (typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) as ViewMode : "table") || "table",

  fetchApplications: async () => {
    try {
      set({ isLoading: true });
      const auth = getAuth();
      const applicationsRef = collection(db, "applications");
      const q = query(
        applicationsRef,
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const applicationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Application[];
      set({ 
        applications: applicationsData,
        totalItems: applicationsData.length
      });
    } catch (error) {
      toast.error("Erreur lors de la récupération des candidatures");
    } finally {
      set({ isLoading: false });
    }
  },

  addApplication: async (data: Application) => {
    try {
      set({ isLoading: true });
      const auth = getAuth();
      const applicationsRef = collection(db, "applications");
      await addDoc(applicationsRef, {
        ...data,
        userId: auth.currentUser?.uid,
        createdAt: new Date().toISOString(),
      });
      await get().fetchApplications();
      toast.success("Candidature ajoutée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la candidature");
    } finally {
      set({ isLoading: false });
    }
  },

  editApplication: async (data: Application) => {
    try {
      set({ isLoading: true });
      if (!data.id) return;
      const applicationRef = doc(db, "applications", data.id);
      await updateDoc(applicationRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await get().fetchApplications();
      toast.success("Candidature modifiée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la modification de la candidature");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteApplication: async (id: string) => {
    try {
      set({ isLoading: true });
      const applicationRef = doc(db, "applications", id);
      await deleteDoc(applicationRef);
      await get().fetchApplications();
      toast.success("Candidature supprimée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la candidature");
    } finally {
      set({ isLoading: false });
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  setPageSize: (pageSize: number) => {
    set({ pageSize, currentPage: 1 });
  },

  setViewMode: (mode: ViewMode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, mode);
    }
    set({ viewMode: mode });
  },
})); 