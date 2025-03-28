"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApplicationsTable } from "@/components/applications/applicationsTable";
import { ApplicationsGrid } from "@/components/applications/applicationsGrid";
import { ApplicationForm } from "@/components/applications/applicationForm";
import { useApplicationsStore } from "@/lib/stores/use-applications-store";
import { type Application } from "@/lib/schemas/application";
import { LayoutGrid, Table } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ApplicationsPage() {
  const {
    applications,
    isLoading,
    viewMode,
    fetchApplications,
    addApplication,
    editApplication,
    deleteApplication,
    setViewMode,
  } = useApplicationsStore();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingApplication, setEditingApplication] = React.useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAddApplication = async (data: Application) => {
    await addApplication(data);
    setIsDialogOpen(false);
  };

  const handleEditApplication = async (data: Application) => {
    await editApplication(data);
    setIsDialogOpen(false);
    setEditingApplication(null);
  };

  const handleDeleteApplication = async (id: string) => {
    await deleteApplication(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes candidatures</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
            className={viewMode === "grid" ? "bg-muted" : ""}
          >
            {viewMode === "table" ? (
              <LayoutGrid className="h-4 w-4" />
            ) : (
              <Table className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>Nouvelle candidature</Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <ApplicationsTable
          applications={applications}
          isLoading={isLoading}
          onEdit={(application) => {
            setEditingApplication(application);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteApplication}
        />
      ) : (
        <ApplicationsGrid
          applications={applications}
          isLoading={isLoading}
          onEdit={(application) => {
            setEditingApplication(application);
            setIsDialogOpen(true);
          }}
          onDelete={handleDeleteApplication}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingApplication ? "Modifier la candidature" : "Nouvelle candidature"}
            </DialogTitle>
          </DialogHeader>
          <ApplicationForm
            onSubmit={editingApplication ? handleEditApplication : handleAddApplication}
            initialData={editingApplication}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
