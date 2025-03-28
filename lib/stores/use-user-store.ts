import { create } from "zustand";
import { getAuth, User, updateProfile, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { app } from "@/firebase";
import { toast } from "sonner";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateProfile: (data: { displayName: string; email: string }) => Promise<void>;
  updatePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,

  setUser: (user: User | null) => {
    set({ user });
  },

  updateProfile: async (data) => {
    try {
      set({ isLoading: true });
      const user = get().user;
      if (!user) return;

      if (data.displayName !== user.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }

      if (data.email !== user.email) {
        await updateEmail(user, data.email);
      }

      toast.success("Profil mis à jour", {
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      toast.error("Erreur", { description: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (data) => {
    try {
      set({ isLoading: true });
      const user = get().user;
      if (!user) return;

      const credential = EmailAuthProvider.credential(
        user.email!,
        data.currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);

      toast.success("Mot de passe mis à jour", {
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
    } catch (error: any) {
      toast.error("Erreur", { description: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAccount: async () => {
    try {
      set({ isLoading: true });
      const user = get().user;
      if (!user) return;

      await deleteUser(user);
      set({ user: null });
      toast.success("Compte supprimé", {
        description: "Votre compte a été supprimé avec succès.",
      });
    } catch (error: any) {
      toast.error("Erreur", { description: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      const auth = getAuth(app);
      await auth.signOut();
      set({ user: null });
      toast.success("Déconnexion", {
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error: any) {
      toast.error("Erreur", { description: error.message });
    }
  },
})); 