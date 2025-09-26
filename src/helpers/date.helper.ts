export const getLocaleDate = (): string => {
  return new Date()
    .toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
};