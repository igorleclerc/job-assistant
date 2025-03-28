"use client";

import { cn } from "@/lib/utils";
import { Clock, MessageSquare, XCircle, CheckCircle } from "lucide-react";

const statusConfig = {
  pending: {
    label: "En attente",
    className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    icon: Clock,
  },
  interview: {
    label: "Entretien",
    className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    icon: MessageSquare,
  },
  rejected: {
    label: "Refusée",
    className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    icon: XCircle,
  },
  accepted: {
    label: "Acceptée",
    className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    icon: CheckCircle,
  },
} as const;

type Status = keyof typeof statusConfig;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status || !(status in statusConfig)) {
    return null;
  }

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  );
} 