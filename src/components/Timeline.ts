import "../styles/timeline.css";
import data from "../data/about.json";

export default function Timeline() {
  const timelineContainer = document.createElement("div");
  timelineContainer.className = "timeline-container";

  // Create SVG element
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("class", "timeline-svg");
  svg.setAttribute("aria-label", "Timeline of career and personal milestones");

  // Calculate dimensions based on the number of timeline entries
  const entries = data.timeline;
  const entryHeight = 80; // Height for each timeline entry
  const svgHeight = entries.length * entryHeight;
  const svgWidth = 500; // Fixed width for the SVG

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", `${svgHeight}px`);
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

  // Create the main vertical line
  const mainLine = document.createElementNS(svgNamespace, "line");
  mainLine.setAttribute("x1", "40");
  mainLine.setAttribute("y1", "0");
  mainLine.setAttribute("x2", "40");
  mainLine.setAttribute("y2", svgHeight.toString());
  mainLine.setAttribute("stroke", "var(--color-gray-900)");
  mainLine.setAttribute("stroke-width", "2");
  svg.appendChild(mainLine);

  // Add dots and circles at the top of the main line
  // Small dot
  const topDot = document.createElementNS(svgNamespace, "circle");
  topDot.setAttribute("cx", "40");
  topDot.setAttribute("cy", "0");
  topDot.setAttribute("r", "3");
  topDot.setAttribute("fill", "var(--color-gray-900)");
  svg.appendChild(topDot);

  // Additional dots above for the ellipsis effect
  for (let i = 1; i <= 3; i++) {
    const dot = document.createElementNS(svgNamespace, "circle");
    dot.setAttribute("cx", "40");
    dot.setAttribute("cy", (-15 * i).toString());
    dot.setAttribute("r", "2");
    dot.setAttribute("fill", `rgb(${64 * i}, ${64 * i}, ${64 * i})`);
    svg.appendChild(dot);
  }

  // Adjust SVG viewBox to include the top ellipses
  const viewBoxY = -45; // Negative value to show elements above the top edge
  svg.setAttribute("viewBox", `0 ${viewBoxY} ${svgWidth} ${svgHeight + 90}`); // Add 90 (45 top + 45 bottom) to height

  // Add dots and circles at the bottom of the main line
  // Small dot
  const bottomDot = document.createElementNS(svgNamespace, "circle");
  bottomDot.setAttribute("cx", "40");
  bottomDot.setAttribute("cy", svgHeight.toString());
  bottomDot.setAttribute("r", "3");
  bottomDot.setAttribute("fill", "var(--color-gray-900)");
  svg.appendChild(bottomDot);

  // Additional dots below for the ellipsis effect
  for (let i = 1; i <= 3; i++) {
    const dot = document.createElementNS(svgNamespace, "circle");
    dot.setAttribute("cx", "40");
    dot.setAttribute("cy", (svgHeight + 15 * i).toString());
    dot.setAttribute("r", "2");
    dot.setAttribute("fill", `rgb(${64 * i}, ${64 * i}, ${64 * i})`);
    svg.appendChild(dot);
  }

  // Add timeline entries
  entries.forEach((entry, index) => {
    const yPosition = (index + 0.5) * entryHeight;

    // Calculate horizontal line length based on position percentage
    const position = entry.position || 50; // Default to 50% if not specified
    const lineLength = Math.max(60, position * 2); // Minimum length of 60px, scale position by 2
    const circleX = 40 + lineLength; // Position the circle at the end of the line

    // Horizontal line
    const horizontalLine = document.createElementNS(svgNamespace, "line");
    horizontalLine.setAttribute("x1", "40");
    horizontalLine.setAttribute("y1", yPosition.toString());
    horizontalLine.setAttribute("x2", circleX.toString());
    horizontalLine.setAttribute("y2", yPosition.toString());
    horizontalLine.setAttribute("stroke", "var(--color-gray-900)");
    horizontalLine.setAttribute("stroke-width", "2");

    // Use dashed line for non-milestone entries
    if (!entry.milestone) {
      horizontalLine.setAttribute("stroke-dasharray", "4");
    }

    svg.appendChild(horizontalLine);

    // Circle with border at the end of the horizontal line
    // First add the border circle (slightly larger)
    const circleBorder = document.createElementNS(svgNamespace, "circle");
    circleBorder.setAttribute("cx", circleX.toString());
    circleBorder.setAttribute("cy", yPosition.toString());
    circleBorder.setAttribute("r", "5");
    circleBorder.setAttribute("fill", "white");
    circleBorder.setAttribute("stroke", "var(--color-gray-900)");
    circleBorder.setAttribute("stroke-width", "2");
    svg.appendChild(circleBorder);

    // Then add the inner colored circle
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", circleX.toString());
    circle.setAttribute("cy", yPosition.toString());
    circle.setAttribute("r", "4");

    // Use different color for milestone entries
    if (entry.milestone) {
      // Check if this is the latest milestone (Associate Technical Consultant)
      if (entry.current) {
        circle.setAttribute("fill", "var(--color-secondary)"); // Yellow for current position
      } else {
        circle.setAttribute("fill", "var(--color-primary)"); // Blue for other milestones
      }
    } else {
      circle.setAttribute("fill", "var(--color-primary)"); // Blue for regular entries
    }

    svg.appendChild(circle);

    // Text label - position it after the circle with some spacing
    const textGroup = document.createElementNS(svgNamespace, "g");
    textGroup.setAttribute("class", "timeline-text");

    // Handle text wrapping by splitting long text into multiple tspan elements if needed
    const text = document.createElementNS(svgNamespace, "text");
    text.setAttribute("x", (circleX + 20).toString()); // Position text after the circle
    text.setAttribute("y", yPosition.toString());
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute(
      "class",
      entry.milestone ? "milestone-text" : "regular-text"
    );

    // Smart text wrapping that only breaks at spaces
    const info = entry.info;
    const words = info.split(" ");

    if (words.length > 5) {
      // Find a good breaking point around the middle of the text
      const midPoint = Math.floor(words.length / 2);

      // Create first tspan with first half of words
      const tspan1 = document.createElementNS(svgNamespace, "tspan");
      tspan1.setAttribute("x", (circleX + 20).toString());
      tspan1.setAttribute("dy", "-0.5em");
      tspan1.textContent = words.slice(0, midPoint).join(" ");

      // Create second tspan for the rest of the words
      const tspan2 = document.createElementNS(svgNamespace, "tspan");
      tspan2.setAttribute("x", (circleX + 20).toString());
      tspan2.setAttribute("dy", "1.2em");
      tspan2.textContent = words.slice(midPoint).join(" ");

      text.appendChild(tspan1);
      text.appendChild(tspan2);
    } else {
      text.textContent = info;
    }

    textGroup.appendChild(text);
    svg.appendChild(textGroup);
  });

  timelineContainer.appendChild(svg);
  return timelineContainer;
}
