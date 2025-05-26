import "../styles/bento.css";

interface BentoItem {
  id: number;
  content: string;
  gridColumn: string;
  gridRow: string;
  minHeight?: string; // Optional property for minimum height
}

export default function Bento(data: BentoItem[]) {
  const bentoContainer = document.createElement("div");
  bentoContainer.className = "bento";
  const container = document.createElement("div");
  container.className = "grid-container";

  data.forEach((item) => {
    const gridItem = document.createElement("div");
    gridItem.className = "grid-item";
    gridItem.style.gridColumn = item.gridColumn;
    gridItem.style.gridRow = item.gridRow;
    if (item.minHeight) {
      gridItem.style.minHeight = item.minHeight;
    }
    container.appendChild(gridItem);
  });

  bentoContainer.appendChild(container);
  return bentoContainer;
}
