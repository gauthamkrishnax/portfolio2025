import "./styles/style.css";
import Hero from "./components/Hero";
import { GraphicsV1 } from "./components/Graphics";
import About from "./components/About";
import Contact from "./components/Contact";
import Portfolio from "./components/Portfolio";
import ThemeSwitcher from "./components/ThemeSwitcher";

const app = document.querySelector<HTMLDivElement>("#app");
app?.append(Hero());
app?.append(GraphicsV1());
app?.append(About());
app?.append(Portfolio());
app?.append(Contact());
app?.append(ThemeSwitcher());
