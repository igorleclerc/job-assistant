"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationsStore } from "@/lib/stores/use-applications-store";
import * as d3 from "d3";
import { motion } from "framer-motion";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function Charts() {
  const { applications } = useApplicationsStore();

  // Données pour le graphique en barres (candidatures par mois)
  const monthlyData = useMemo(() => {
    const data = applications.reduce((acc, app) => {
      const date = new Date(app.applicationDate);
      const month = date.toLocaleString("fr-FR", { month: "long" });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(data).map(([month, count]) => ({
      month,
      count,
    }));
  }, [applications]);

  // Données pour le graphique en camembert (répartition par statut)
  const statusData = useMemo(() => {
    return [
      { name: "En attente", value: applications.filter((app) => app.status === "pending").length },
      { name: "Entretien", value: applications.filter((app) => app.status === "interview").length },
      { name: "Acceptée", value: applications.filter((app) => app.status === "accepted").length },
      { name: "Refusée", value: applications.filter((app) => app.status === "rejected").length },
    ];
  }, [applications]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Candidatures par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChart data={monthlyData} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Répartition par statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <PieChart data={statusData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface BarChartProps {
  data: { month: string; count: number }[];
}

function BarChart({ data }: BarChartProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current || !data.length) return;

    const width = ref.current.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Nettoyer le conteneur
    d3.select(ref.current).selectAll("*").remove();

    // Créer le SVG pour les axes
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Créer les échelles
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 0])
      .range([height - margin.bottom, margin.top]);

    // Ajouter les axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-45)");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Créer un conteneur pour les barres
    const barsContainer = d3
      .select(ref.current)
      .append("div")
      .style("position", "absolute")
      .style("top", "0")
      .style("left", "0")
      .style("width", "100%")
      .style("height", "100%");

    // Ajouter les barres avec animation
    data.forEach((d, i) => {
      const barWidth = x.bandwidth();
      const barHeight = y(0) - y(d.count);
      const barX = x(d.month) || 0;
      const barY = y(d.count);

      barsContainer
        .append("div")
        .style("position", "absolute")
        .style("left", `${barX}px`)
        .style("top", `${barY}px`)
        .style("width", `${barWidth}px`)
        .style("height", `${barHeight}px`)
        .style("background-color", "#8884d8")
        .style("border-radius", "4px")
        .style("transition", "all 0.3s ease")
        .style("transform-origin", "bottom")
        .style("transform", "scaleY(0)")
        .style("opacity", "0")
        .transition()
        .duration(500)
        .delay(i * 100)
        .style("transform", "scaleY(1)")
        .style("opacity", "1")
        .on("end", function() {
          d3.select(this)
            .style("transition", "all 0.2s ease")
            .on("mouseover", function() {
              d3.select(this)
                .style("background-color", "#9c8ee8")
                .style("transform", "scaleY(1.05)");
            })
            .on("mouseout", function() {
              d3.select(this)
                .style("background-color", "#8884d8")
                .style("transform", "scaleY(1)");
            });
        });
    });

    // Ajouter les tooltips
    const tooltip = d3
      .select(ref.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("pointer-events", "none");

    barsContainer.selectAll("div").on("mouseover", function(event, d) {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(`
          <div class="font-medium">${d.month}</div>
          <div class="text-sm text-muted-foreground">${d.count} candidatures</div>
        `)
        .style("left", (event as MouseEvent).pageX + 10 + "px")
        .style("top", (event as MouseEvent).pageY - 28 + "px");
    }).on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });
  }, [data]);

  return <div ref={ref} className="w-full h-full relative" />;
}

interface PieChartProps {
  data: { name: string; value: number }[];
}

function PieChart({ data }: PieChartProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current || !data.length) return;

    const width = ref.current.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;

    // Nettoyer le conteneur
    d3.select(ref.current).selectAll("*").remove();

    // Créer le SVG
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Créer le générateur de camembert
    const pie = d3
      .pie<{ name: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Créer les arcs avec animation
    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Ajouter les chemins avec animation
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => COLORS[i % COLORS.length])
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0)
      .style("transform", "scale(0)")
      .transition()
      .duration(500)
      .delay((d, i) => i * 100)
      .style("opacity", 1)
      .style("transform", "scale(1)");

    // Ajouter les labels avec animation
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .style("opacity", 0)
      .text((d) => `${d.data.name}: ${d.data.value}`)
      .transition()
      .duration(500)
      .delay((d, i) => i * 100 + 300)
      .style("opacity", 1);

    // Ajouter les tooltips
    const tooltip = d3
      .select(ref.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("pointer-events", "none");

    arcs
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("transform", "scale(1.05)");
        
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(`
            <div class="font-medium">${d.data.name}</div>
            <div class="text-sm text-muted-foreground">${d.data.value} candidatures</div>
          `)
          .style("left", (event as MouseEvent).pageX + 10 + "px")
          .style("top", (event as MouseEvent).pageY - 28 + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style("transform", "scale(1)");
        
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data]);

  return <div ref={ref} className="w-full h-full" />;
} 