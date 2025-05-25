import "../styles/graphics.css";

export function GraphicsV1() {
  const graphicsContainer = document.createElement("section");
  graphicsContainer.className = "graphics";
  graphicsContainer.setAttribute("aria-hidden", "true");
  const whiteThingy = document.createElement("div");
  whiteThingy.className = "white-thingy";
  graphicsContainer.appendChild(whiteThingy);
  return graphicsContainer;
}
