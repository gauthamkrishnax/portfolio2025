import "../styles/bento.css";

interface BentoItem {
  id: number;
  content: string;
  gridColumn: string;
  gridRow: string;
  minHeight?: string; // Optional property for minimum height
}

export default function Bento(
  data: BentoItem[],
  Item: (item: BentoItem) => HTMLElement
): HTMLElement {
  const bentoContainer = document.createElement("div");
  bentoContainer.className = "bento";
  const container = document.createElement("div");
  container.className = "grid-container";

  data.forEach((item) => {
    const gridItem = document.createElement("div");
    gridItem.appendChild(Item(item));
    gridItem.className = "grid-item";
    gridItem.style.gridColumn = item.gridColumn;
    gridItem.style.gridRow = item.gridRow;
    if (item.minHeight) {
      gridItem.style.height = item.minHeight;
    }
    container.appendChild(gridItem);
  });

  bentoContainer.appendChild(container);
  return bentoContainer;
}
