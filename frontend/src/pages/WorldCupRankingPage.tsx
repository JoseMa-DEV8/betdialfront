import { useEffect, useState } from "react";
import "./WorldCupRankingPage.css";
import BottomNav from "../components/BottomNav";


interface RankingUser {
  id: string;
  points: number;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function RankingPage() {
  const worldCupId = localStorage.getItem("worldCupId") || "";

  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRanking = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/worldcups/${worldCupId}/ranking`
      );

      const data = await response.json();

      if (data.success) {
        setRanking(data.ranking);
      }
    } catch (error) {
      console.error("Error cargando ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanking();
  }, []);

  if (loading) {
    return (
      <div className="ranking-page">
        <div className="ranking-wrapper">
          <h1 className="ranking-title">Ranking</h1>
          <p className="ranking-subtitle">Cargando clasificación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ranking-page">
      <div className="ranking-wrapper">
        <h1 className="ranking-title">Ranking</h1>
        <p className="ranking-subtitle">Clasificación del Mundial</p>

        <div className="ranking-list">
          {ranking.map((participant, index) => (
            <div key={participant.id} className="ranking-card">
              <div className="ranking-position">
                {index + 1}
              </div>

              <div className="ranking-user">
                <p className="ranking-name">
                  {participant.user.name || participant.user.email}
                </p>
                <p className="ranking-email">
                  {participant.user.email}
                </p>
              </div>

              <div className="ranking-points">
                <span>{participant.points}</span>
                <small>pts</small>
              </div>
            </div>
          ))}
        </div>

        {ranking.length === 0 && (
          <p className="ranking-empty">
            Todavía no hay participantes en este Mundial.
          </p>
        )}
      </div>
      <BottomNav />
    </div>
  );
}