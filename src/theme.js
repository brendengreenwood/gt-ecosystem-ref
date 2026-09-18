export const riskColor = (risk) => {
  switch (risk) {
    case "low": return { bg: "rgba(75, 160, 75, 0.12)", text: "#4BA04B", border: "rgba(75, 160, 75, 0.3)" };
    case "medium": return { bg: "rgba(210, 170, 50, 0.12)", text: "#C49B20", border: "rgba(210, 170, 50, 0.3)" };
    case "high": return { bg: "rgba(200, 70, 60, 0.12)", text: "#C8463C", border: "rgba(200, 70, 60, 0.3)" };
    default: return { bg: "rgba(140, 140, 160, 0.12)", text: "#8C8CA0", border: "rgba(140, 140, 160, 0.3)" };
  }
};
