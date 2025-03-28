"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type Application } from "@/lib/schemas/application";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CompanySearch } from "./company-search";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";

interface ApplicationFormProps {
  onSubmit: (data: Application) => Promise<void>;
  initialData?: Application | null;
  isLoading?: boolean;
}

const contractTypes = {
  cdi: "CDI",
  cdd: "CDD",
  stage: "STAGE",
  alternance: "ALTERNANCE",
} as const;

export function ApplicationForm({
  onSubmit,
  initialData,
  isLoading,
}: ApplicationFormProps) {
  const form = useForm<Application>({
    resolver: zodResolver(applicationSchema),
    defaultValues: initialData || {
      title: "",
      company: "",
      companyLogo: "",
      applicationDate: new Date().toISOString().split("T")[0],
      status: "pending",
      description: "",
      contractType: "cdi",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du poste</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Développeur Frontend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de candidature</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entreprise</FormLabel>
                <FormControl>
                  <CompanySearch
                    value={field.value}
                    logoUrl={form.getValues("companyLogo")}
                    onChange={({ name, logo }) => {
                      field.onChange(name);
                      form.setValue("companyLogo", logo || "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut">
                          {field.value && <StatusBadge status={field.value} />}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">
                        <StatusBadge status="pending" />
                      </SelectItem>
                      <SelectItem value="interview">
                        <StatusBadge status="interview" />
                      </SelectItem>
                      <SelectItem value="rejected">
                        <StatusBadge status="rejected" />
                      </SelectItem>
                      <SelectItem value="accepted">
                        <StatusBadge status="accepted" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de contrat">
                          {field.value && contractTypes[field.value]}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(contractTypes).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notes, détails sur le poste..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : initialData ? (
              "Modifier la candidature"
            ) : (
              "Ajouter la candidature"
            )}
          </Button>
        </Card>
      </form>
    </Form>
  );
} 