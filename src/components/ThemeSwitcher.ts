import Light from "../assets/icons/light.svg";
import Dark from "../assets/icons/dark.svg";

type Theme = "light" | "dark";

/**
 * Detects and returns the initial theme based on user preference
 */
function getInitialTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Updates the button icon based on the current theme
 */
function updateButtonIcon(button: HTMLButtonElement, theme: Theme): void {
  const iconSrc = theme === "dark" ? Dark : Light;
  const altText = `Switch to ${theme === "dark" ? "light" : "dark"} theme`;
  button.innerHTML = `<img src="${iconSrc}" alt="${altText}" />`;
}

/**
 * Creates a theme toggle button with appropriate styling and behavior
 */
export default function ThemeSwitcher(): HTMLButtonElement {
  const html = document.documentElement;
  let currentTheme: Theme = getInitialTheme();

  // Set initial theme
  html.setAttribute("data-theme", currentTheme);
  html.style.colorScheme = currentTheme;

  // Create button element
  const button = document.createElement("button");
  button.className = "theme-switcher";
  button.setAttribute("aria-label", "Toggle theme");
  button.title = "Toggle theme";
  button.type = "button";

  // Apply styles
  Object.assign(button.style, {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
  });

  // Set up theme toggle functionality
  button.onclick = () => {
    currentTheme = (html.getAttribute("data-theme") as Theme) || "light";
    const newTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", newTheme);
    html.style.colorScheme = newTheme;
    currentTheme = newTheme;

    updateButtonIcon(button, newTheme);
  };

  // Set initial button icon
  updateButtonIcon(button, currentTheme);

  return button;
}
