import "./styles/style.css";
import Hero from "./components/Hero";
import { GraphicsV1 } from "./components/Graphics";
import About from "./components/About";
import Contact from "./components/Contact";

const app = document.querySelector<HTMLDivElement>("#app");
app?.append(Hero());
app?.append(GraphicsV1());
app?.append(About());
app?.append(Contact());
