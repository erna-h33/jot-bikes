/**
 * Generates a random serial number for a bike
 * Format: BIKE-XXXX-YYYY where XXXX is a random 4-digit number and YYYY is the year
 * @returns {string} A randomly generated serial number
 */
export const generateSerialNumber = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number between 1000-9999
  const currentYear = new Date().getFullYear();
  return `BIKE-${randomNum}-${currentYear}`;
};
