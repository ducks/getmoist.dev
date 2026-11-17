// One local display preference, never a visitor identifier or network request.
(() => {
  const key = "moist-theme";
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let choice;
  try {
    choice = localStorage.getItem(key);
  } catch {
    /* Storage can be disabled. */
  }
  if (choice !== "dark" && choice !== "light") choice = null;
  const root = document.documentElement;
  function apply(theme) {
    root.dataset.theme = theme;
    const button = document.querySelector(".theme-toggle");
    if (button) {
      button.hidden = false;
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Use light theme" : "Use dark theme",
      );
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0b1f33" : "#f8f6f2");
  }
  apply(choice || (system.matches ? "dark" : "light"));
  document.addEventListener("DOMContentLoaded", () => {
    apply(root.dataset.theme);
    document.querySelector(".theme-toggle")?.addEventListener("click", () => {
      choice = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(key, choice);
      } catch {
        /* Theme still works in this tab. */
      }
      apply(choice);
    });
  });
  system.addEventListener("change", () => {
    if (!choice) apply(system.matches ? "dark" : "light");
  });
})();
