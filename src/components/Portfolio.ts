import "../styles/portfolio.css";
import data from "../data/projects.json";
import Bento from "./Bento";

export default function Portfolio() {
  const portfolioContainer = document.createElement("section");
  portfolioContainer.className = "portfolio";
  portfolioContainer.id = "works";
  portfolioContainer.innerHTML = `<div class="container">
  <h2 class="vertical-text">*Portfolio</h2>
  <div class="portfolio-content">
  ${Bento(data).outerHTML}
  </div>
  </div>`;
  return portfolioContainer;
}
