"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { type Application } from "@/lib/schemas/application";
import { LinearLoader } from "@/components/ui/linear-loader";
import { StatusBadge } from "./status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useApplicationsStore } from "@/lib/stores/use-applications-store";

const contractTypes = {
  cdi: "CDI",
  cdd: "CDD",
  stage: "Stage",
  alternance: "Alternance",
} as const;

type SortConfig = {
  key: keyof Application;
  direction: "asc" | "desc";
} | null;

interface ApplicationsTableProps {
  applications: Application[];
  isLoading: boolean;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

export const ApplicationsTable = ({
  applications,
  isLoading,
  onEdit,
  onDelete,
}: ApplicationsTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const { currentPage, pageSize, totalItems, setPage, setPageSize } = useApplicationsStore();

  const totalPages = Math.ceil(totalItems / pageSize);

  const sortedApplications = useMemo(() => {
    if (!sortConfig) return applications;

    return [...applications].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (aValue === bValue) return 0;
      
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      
      if (sortConfig.key === "applicationDate") {
        return (new Date(aValue as string).getTime() - new Date(bValue as string).getTime()) * direction;
      }

      return aValue < bValue ? -1 * direction : 1 * direction;
    });
  }, [applications, sortConfig]);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedApplications.slice(start, end);
  }, [sortedApplications, currentPage, pageSize]);

  const handleSort = (key: keyof Application) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: keyof Application) => {
    if (sortConfig?.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 bg-muted/50">
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead className="w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("company")}
                  className="hover:bg-transparent -ml-4 h-8 font-semibold"
                >
                  Entreprise {getSortIcon("company")}
                </Button>
              </TableHead>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="hover:bg-transparent -ml-4 h-8 font-semibold"
                >
                  Titre du poste {getSortIcon("title")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("contractType")}
                  className="hover:bg-transparent -ml-4 h-8 font-semibold"
                >
                  Type {getSortIcon("contractType")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="hover:bg-transparent -ml-4 h-8 font-semibold"
                >
                  Statut {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("applicationDate")}
                  className="hover:bg-transparent -ml-4 h-8 font-semibold"
                >
                  Date {getSortIcon("applicationDate")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {isLoading && (
              <tr>
                <td colSpan={7} className="p-0">
                  <LinearLoader />
                </td>
              </tr>
            )}
            {paginatedApplications.map((application) => (
              <TableRow key={application.id} className="group">
                <TableCell>
                  {application.companyLogo ? (
                    <div className="relative w-10 h-10 border rounded-md overflow-hidden">
                      <img
                        src={application.companyLogo}
                        alt={`Logo ${application.company}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.src = "";
                            e.currentTarget.onerror = null;
                            e.currentTarget.parentElement.innerHTML = `<div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center"><span class="text-sm font-medium">${application.company.charAt(0).toUpperCase()}</span></div>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {application.company.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{application.company}</TableCell>
                <TableCell>{application.title}</TableCell>
                <TableCell>{contractTypes[application.contractType]}</TableCell>
                <TableCell>
                  <StatusBadge status={application.status} />
                </TableCell>
                <TableCell>
                  {new Date(application.applicationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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