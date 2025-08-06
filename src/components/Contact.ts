import "../styles/contact.css";
import data from "../data/contact.json";
import me from "../assets/images/me.jpeg";

export default function Contact() {
  const contactContainer = document.createElement("section");
  contactContainer.className = "contact";
  contactContainer.id = "contact";
  contactContainer.innerHTML = `
  <div class="content">
  <img src="${me}" alt="My Image" class="me">
    <div>
        <h2 class="heading">${data.heading}</h2>
        <a class="button secondary" href=${data["cta-link"]}>${data.cta}</a>
        <div class="socials">
            ${data.socials
      .map(
        (social) =>
          `<a class="button secondary" href="${social.link} target="_blank">${social.name}</a>`
      )
      .join("")}
        </div>
    </div>
  </div>
  `;
  return contactContainer;
}
