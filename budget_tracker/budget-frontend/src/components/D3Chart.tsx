import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type Datum = { label: string; value: number };

export default function D3Chart({ data, type = "pie" }: { data: Datum[]; type?: "pie" | "bar"; }) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    const parent = ref.current.parentElement;
    if (!parent) return;

    // Make it responsive
    const width = parent.clientWidth;
    const height = parent.clientWidth * 0.6;
    svg.attr("width", width).attr("height", height);

    svg.selectAll("*").remove();
    if (!data || data.length === 0) return;

    if (type === "pie") {
      const radius = Math.min(width, height) / 2.5;
      const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
      const pie = d3.pie<Datum>().value((d) => d.value).sort(null);
      const arc = d3.arc<d3.PieArcDatum<Datum>>().innerRadius(0).outerRadius(radius);
      const arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");

      const color = d3.scaleOrdinal(d3.schemeTableau10);

      arcs.append("path")
        .attr("d", arc as any)
        .attr("fill", (d) => color(d.data.label))
        .attr("stroke", "white");

      arcs.append("text")
        .attr("transform", (d) => `translate(${(arc.centroid as any)(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", 12)
        .style("fill", "white")
        .text((d) => d.data.label);
    } else {
      const margin = { top: 20, right: 20, bottom: 40, left: 50 };
      const w = width - margin.left - margin.right;
      const h = height - margin.top - margin.bottom;

      const x = d3.scaleBand().domain(data.map((d) => d.label)).range([0, w]).padding(0.3);
      const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) || 1]).range([h, 0]).nice();

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
      g.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x));
      g.append("g").call(d3.axisLeft(y).ticks(5));

      g.selectAll(".bar").data(data).enter().append("rect")
        .attr("x", (d) => x(d.label)!)
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => h - y(d.value))
        .attr("fill", "var(--primary-color)");
    }
  }, [data, type]);

  return <svg ref={ref} />;
}