import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./MyWorldCupsPage.css";

interface WorldCup {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  points: number;
  participantsCount: number;
  joinedAt: string;
}

export default function MyWorldCupsPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";

  const [worldCups, setWorldCups] = useState<WorldCup[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorldCups = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}/worldcups`
      );

      const data = await response.json();

      if (data.success) {
        setWorldCups(data.worldCups);
      }
    } catch (error) {
      console.error("Error cargando mundiales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorldCups();
  }, []);

  const handleSelectWorldCup = (worldCup: WorldCup) => {
    localStorage.setItem("worldCupId", worldCup.id);
    localStorage.setItem("worldCupName", worldCup.name);
    localStorage.setItem("worldCupCode", worldCup.code);

    navigate("/home");
  };

  if (loading) {
    return (
      <div className="worldcups-page">
        <div className="worldcups-wrapper">
          <h1 className="worldcups-title">Mundiales</h1>
          <p className="worldcups-subtitle">Cargando tus mundiales...</p>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="worldcups-page">
      <div className="worldcups-wrapper">
        <h1 className="worldcups-title">Mundiales</h1>

        <p className="worldcups-subtitle">
          Elige en qué Mundial quieres jugar
        </p>

        {worldCups.length === 0 && (
          <div className="worldcups-empty-card">
            <p className="worldcups-empty-title">
              Todavía no estás en ningún Mundial
            </p>
            <p className="worldcups-empty-text">
              Crea uno nuevo o únete con un código.
            </p>
          </div>
        )}

        <div className="worldcups-list">
          {worldCups.map((worldCup) => {
            const isActive =
              localStorage.getItem("worldCupId") === worldCup.id;

            return (
              <button
                key={worldCup.id}
                className={`worldcup-card ${isActive ? "active" : ""}`}
                onClick={() => handleSelectWorldCup(worldCup)}
              >
                <div className="worldcup-card-top">
                  <div>
                    <p className="worldcup-name">{worldCup.name}</p>
                    <p className="worldcup-code">Código: {worldCup.code}</p>
                  </div>

                  {isActive && (
                    <span className="worldcup-active-pill">Activo</span>
                  )}
                </div>

                <div className="worldcup-stats">
                  <div>
                    <span>{worldCup.points}</span>
                    <small>tus puntos</small>
                  </div>

                  <div>
                    <span>{worldCup.participantsCount}</span>
                    <small>participantes</small>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}