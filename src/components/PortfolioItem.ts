export default function PortfolioItem(data: { id: number }): HTMLElement {
  const item = document.createElement("div");
  item.className = "portfolio-item";
  if (data.id === 1) {
    item.innerHTML = `
  <img src="src/videos/blob.gif" alt="Project Image" class="portfolio-image">
  `;
  }
  return item;
}
