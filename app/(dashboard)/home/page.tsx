"use client";
import React, { useEffect } from "react";
import { Stats } from "@/components/dashboard/stats";
import { Charts } from "@/components/dashboard/charts";
import { useApplicationsStore } from "@/lib/stores/use-applications-store";

export default function HomePage() {
  const { fetchApplications } = useApplicationsStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <Stats />
      <Charts />
    </div>
  );
}