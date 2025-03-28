import { z } from "zod";

export const applicationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  company: z.string().min(1, "Le nom de l'entreprise est requis"),
  companyLogo: z.union([z.string().url("L'URL du logo n'est pas valide"), z.string().length(0)]).optional(),
  applicationDate: z.string().min(1, "La date de candidature est requise"),
  status: z.enum(["pending", "interview", "rejected", "accepted"], {
    required_error: "Le statut est requis",
  }),
  description: z.string().optional(),
  contractType: z.enum(["cdi", "cdd", "stage", "alternance"], {
    required_error: "Le type de contrat est requis",
  }),
});

export type Application = z.infer<typeof applicationSchema>; 