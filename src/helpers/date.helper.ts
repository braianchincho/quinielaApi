export const getLocaleDate = () => {
    const localeString = new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
    return new Date(localeString);
};