// Generates FW + random 5-digit + current year
function generateIncidentId() {
  const rnd = Math.floor(10000 + Math.random() * 90000); // 5-digit
  const year = new Date().getFullYear();
  return `FW${rnd}${year}`;
}

module.exports = { generateIncidentId };
