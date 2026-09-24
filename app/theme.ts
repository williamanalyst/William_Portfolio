export const themeStorageKey = "william-portfolio-theme";

// Apply the preference before the page paints, without accessing browser APIs on the server.
export const themeBootstrap = `(() => {
  let saved;
  try { saved = localStorage.getItem('${themeStorageKey}'); } catch {}
  const theme = saved === 'light' || saved === 'dark'
    ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
})();`;
