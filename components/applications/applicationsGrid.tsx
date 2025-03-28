"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { type Application } from "@/lib/schemas/application";
import { StatusBadge } from "./status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useApplicationsStore } from "@/lib/stores/use-applications-store";

const contractTypes = {
  cdi: "CDI",
  cdd: "CDD",
  stage: "STAGE",
  alternance: "ALTERNANCE",
} as const;

interface ApplicationsGridProps {
  applications: Application[];
  isLoading: boolean;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export const ApplicationsGrid = ({
  applications,
  isLoading,
  onEdit,
  onDelete,
}: ApplicationsGridProps) => {
  const { currentPage, pageSize, totalItems, setPage, setPageSize } = useApplicationsStore();

  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return applications.slice(start, end);
  }, [applications, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedApplications.map((application) => (
            <Card key={application.id} className="relative group hover:shadow-md transition-shadow">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(application)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => application.id && onDelete(application.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  {application.companyLogo ? (
                    <div className="relative w-12 h-12 border rounded-md overflow-hidden">
                      <img
                        src={application.companyLogo}
                        alt={`Logo ${application.company}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.src = "";
                            e.currentTarget.onerror = null;
                            e.currentTarget.parentElement.innerHTML = `<div class="w-12 h-12 bg-muted rounded-md border flex items-center justify-center"><span class="text-sm font-medium">${application.company.charAt(0).toUpperCase()}</span></div>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-md border flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {application.company.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="space-y-1">
                    <CardTitle className="text-lg leading-none">{application.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{application.company}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date de candidature</span>
                  <span className="font-medium">
                    {new Date(application.applicationDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Statut</span>
                  <StatusBadge status={application.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type de contrat</span>
                  <span className="font-medium">{contractTypes[application.contractType]}</span>
                </div>
                {application.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {application.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}; 