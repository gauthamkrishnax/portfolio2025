import "./styles/style.css";

const html = String.raw;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html`
  <div>
    <h1>Hello World!</h1>
  </div>
`;
