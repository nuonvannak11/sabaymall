export  function getThemeFromCookie() {
  if (typeof document === "undefined") return "light";
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/);
  return match ? match[1] : "light";
}