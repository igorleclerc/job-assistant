"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useApplicationsStore } from "@/lib/stores/use-applications-store";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Définition des couleurs directes
const COLORS = {
  pending: "#0ea5e9", // bleu
  interview: "#f59e0b", // orange
  accepted: "#10b981", // vert
  rejected: "#ef4444", // rouge
} as const;

type StatusType = keyof typeof COLORS;

interface PieDataItem {
  name: string;
  value: number;
  status: StatusType;
}

export function Charts() {
  const { applications } = useApplicationsStore();

  // Préparation des données mensuelles avec filtrage des mois vides
  const monthlyData = useMemo(() => {
    // Créer un objet pour stocker les totaux par mois
    const monthlyTotals: Record<string, number> = {};

    // Compter les candidatures par mois
    applications.forEach((app) => {
      const date = new Date(app.applicationDate);
      const monthKey = date.toLocaleString('fr-FR', { month: 'short' });
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + 1;
    });

    // Convertir en tableau et trier par date
    return Object.entries(monthlyTotals)
      .map(([month, total]) => ({
        month: month.charAt(0).toUpperCase() + month.slice(1),
        total
      }))
      .sort((a, b) => {
        const months = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  }, [applications]);

  // Données pour le diagramme circulaire
  const pieData = useMemo<PieDataItem[]>(() => {
    const statusCounts = {
      pending: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
    };

    applications.forEach(app => {
      statusCounts[app.status as StatusType]++;
    });

    const items: PieDataItem[] = [
      { 
        name: "En attente", 
        value: statusCounts.pending,
        status: "pending" as const
      },
      { 
        name: "Entretien", 
        value: statusCounts.interview,
        status: "interview" as const
      },
      { 
        name: "Acceptée", 
        value: statusCounts.accepted,
        status: "accepted" as const
      },
      { 
        name: "Refusée", 
        value: statusCounts.rejected,
        status: "rejected" as const
      },
    ];

    return items.filter(item => item.value > 0);
  }, [applications]);

  const chartConfig = {
    pending: {
      label: "En attente",
      color: COLORS.pending,
    },
    interview: {
      label: "Entretien",
      color: COLORS.interview,
    },
    accepted: {
      label: "Acceptée",
      color: COLORS.accepted,
    },
    rejected: {
      label: "Refusée",
      color: COLORS.rejected,
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Candidatures par mois</CardTitle>
          <CardDescription>Evolution mensuelle</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  angle={0}
                  textAnchor="middle"
                  height={30}
                  fontSize={12}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  name="Total des candidatures"
                  dataKey="total" 
                  fill={COLORS.pending}
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Répartition par statut</CardTitle>
          <CardDescription>Vue d'ensemble des candidatures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    cx="50%"
                    cy="50%"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.status]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: COLORS[entry.status] }}
                />
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 