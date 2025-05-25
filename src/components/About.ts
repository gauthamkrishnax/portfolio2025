import "../styles/about.css";
import data from "../data/about.json";

export default function About() {
  const aboutContainer = document.createElement("section");
  aboutContainer.className = "about";
  aboutContainer.id = "about";
  aboutContainer.innerHTML = `
    <div>
      <div class="content">
        <h2 class="heading">${data.heading}</h2>
        ${data.paragraphs.map((p) => `<p>${p}</p>`).join("")}
        <p><strong class="subheading">${data.footnote}</strong></p>
      </div>
      <div class="timeline"></div>
    </div>
  `;
  return aboutContainer;
}
