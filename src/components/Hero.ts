import "../styles/hero.css";
import data from "../data/hero.json";
import LinkIcon from "../assets/icons/link.svg?raw";
import ChevronIcon from "../assets/icons/chevron.svg?raw";
import placeholderImage from "../assets/images/hero-placeholder.png";

const html = String.raw;

export default function Hero() {
  const heroContainer = document.createElement("section");
  heroContainer.className = "hero";
  heroContainer.innerHTML = html`
    <section class="hero">
      <div class="left">
        <div class="header">
          <span><strong>Gautham Krishna</strong></span>
          <span>Portfolio</span>
        </div>
        <div class="content">
          <h1>${data["hero-title"]}</h1>
          <h2>${data["hero-subtitle"]}</h2>
          <div>
            <a class="button primary" href=${data["hero-cta-link"]}
              >${data["hero-cta"]}</a
            >
            <a
              class="button secondary"
              target="_blank"
              href=${data["hero-sub-cta-link"]}
            >
              ${LinkIcon} ${data["hero-sub-cta"]}</a
            >
          </div>
        </div>
        <div class="next">
          <span><a href="#about">${ChevronIcon}About Me</a></span>
        </div>
      </div>
      <div class="right">
        <img src=${placeholderImage} alt=""></img>
      </div>
    </section>
  `;
  return heroContainer;
}
