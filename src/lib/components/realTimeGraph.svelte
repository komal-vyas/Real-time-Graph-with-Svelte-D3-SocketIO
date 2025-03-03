<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import io from "socket.io-client";
  
    let data = [];
    const width = 600, height = 300, margin = { top: 20, right: 30, bottom: 40, left: 50 };
  
    const socket = io("http://localhost:3000");
  
    onMount(() => {
      socket.on("data", (newData) => {
        data.push(newData);
        if (data.length > 50) data.shift(); // Keep last 50 points
        updateGraph();
      });
  
      drawGraph();
    });
  
    function drawGraph() {
      const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);
  
      svg.append("path").attr("class", "line");
  
      // Create X and Y axis groups
      svg.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${height - margin.bottom})`);
      svg.append("g").attr("class", "y-axis").attr("transform", `translate(${margin.left}, 0)`);
  
      // Add labels
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Time");
  
      svg.append("text")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Value");
    }
  
    function updateGraph() {
      if (data.length === 0) return;
  
      const svg = d3.select("svg");
      const xScale = d3.scaleTime()
        .domain([data[0]?.timestamp, data[data.length - 1]?.timestamp])
        .range([margin.left, width - margin.right]);
  
      const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);
  
      // Update X and Y axes
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H:%M:%S"));
      const yAxis = d3.axisLeft(yScale);
  
      svg.select(".x-axis").call(xAxis);
      svg.select(".y-axis").call(yAxis);
  
      // Draw the line
      const line = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.value));
  
      svg.select(".line")
        .datum(data)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2);
  
      // Add data points (circles)
      const circles = svg.selectAll(".point").data(data);
  
      circles.enter()
        .append("circle")
        .attr("class", "point")
        .attr("r", 4)
        .merge(circles)
        .attr("cx", d => xScale(d.timestamp))
        .attr("cy", d => yScale(d.value))
        .attr("fill", "red")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);
  
      circles.exit().remove();
    }
  </script>
  
  <div id="chart"></div>
  