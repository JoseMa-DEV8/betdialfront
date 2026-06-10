const API_URL = "http://localhost:3000/api";

export const getWorldCupMatches = async (worldCupId: string, userId: string) => {
  const res = await fetch(`${API_URL}/worldcups/${worldCupId}/matches/${userId}`);
  return res.json();
};

export const savePrediction = async (data: {
  userId: string;
  worldCupId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
}) => {
  const res = await fetch(`${API_URL}/predictions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};