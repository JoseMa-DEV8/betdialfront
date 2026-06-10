import { useEffect, useState } from "react";
import { getWorldCupMatches, savePrediction } from "../services/matchesApi";
import BottomNav from "../components/BottomNav";
import "./WorldCupMatchesPage.css";

interface Match {
  id: string;
  matchDate: string;
  groupName: string;
  homeScore: number | null;
  awayScore: number | null;
  finished: boolean;
  homeTeam: { name: string; tla: string; crest: string | null };
  awayTeam: { name: string; tla: string; crest: string | null };
  prediction: { homeScore: number; awayScore: number; points: number } | null;
}

export default function WorldCupMatchesPage() {
  const userId = localStorage.getItem("userId") || "";
  const worldCupId = localStorage.getItem("worldCupId") || "";

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<
    Record<string, { homeScore: string; awayScore: string }>
  >({});

  const loadMatches = async () => {
    try {
      const data = await getWorldCupMatches(worldCupId, userId);

      if (data.success) {
        setMatches(data.matches);

        const initialScores: Record<
          string,
          { homeScore: string; awayScore: string }
        > = {};

        data.matches.forEach((match: Match) => {
          if (match.prediction) {
            initialScores[match.id] = {
              homeScore: String(match.prediction.homeScore),
              awayScore: String(match.prediction.awayScore),
            };
          }
        });

        setScores(initialScores);
      }
    } catch (error) {
      console.error("Error cargando partidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleChange = (
    matchId: string,
    field: "homeScore" | "awayScore",
    value: string
  ) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: {
        homeScore: prev[matchId]?.homeScore || "",
        awayScore: prev[matchId]?.awayScore || "",
        [field]: value,
      },
    }));
  };

  const handleWinnerClick = (
    matchId: string,
    type: "home" | "draw" | "away"
  ) => {
    if (type === "home") {
      setScores((prev) => ({
        ...prev,
        [matchId]: {
          homeScore: "1",
          awayScore: "0",
        },
      }));
    }

    if (type === "draw") {
      setScores((prev) => ({
        ...prev,
        [matchId]: {
          homeScore: "1",
          awayScore: "1",
        },
      }));
    }

    if (type === "away") {
      setScores((prev) => ({
        ...prev,
        [matchId]: {
          homeScore: "0",
          awayScore: "1",
        },
      }));
    }
  };

  const handleSave = async (matchId: string) => {
    const prediction = scores[matchId];

    if (
      !prediction ||
      prediction.homeScore === "" ||
      prediction.awayScore === ""
    ) {
      alert("Introduce los dos resultados");
      return;
    }

    const result = await savePrediction({
      userId,
      worldCupId,
      matchId,
      homeScore: Number(prediction.homeScore),
      awayScore: Number(prediction.awayScore),
    });

    if (result.success) {
      alert("Pronóstico guardado");
      loadMatches();
    } else {
      alert(result.message || "Error al guardar pronóstico");
    }
  };

  if (loading) {
    return (
      <div className="matches-page">
        <div className="matches-wrapper">
          <h1 className="matches-title">BetDial</h1>
          <p className="matches-subtitle">Cargando partidos...</p>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="matches-page">
      <div className="matches-wrapper">
        <h1 className="matches-title">BetDial</h1>

        <p className="matches-subtitle">Pronósticos Mundial 2026</p>

        <div className="matches-list">
          {matches.map((match) => {
            const currentHome = scores[match.id]?.homeScore || "";
            const currentAway = scores[match.id]?.awayScore || "";

            const selectedWinner =
              currentHome !== "" && currentAway !== ""
                ? Number(currentHome) > Number(currentAway)
                  ? "home"
                  : Number(currentHome) < Number(currentAway)
                  ? "away"
                  : "draw"
                : null;

            return (
              <div key={match.id} className="match-card">
                <div className="match-top">
                  <div>
                    <p className="match-group">
                      {match.groupName?.replace("_", " ")}
                    </p>

                    <p className="match-date">
                      {new Date(match.matchDate).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span className="match-group">
                    {match.finished ? "Finalizado" : "Próximo"}
                  </span>
                </div>

                <div className="team-row">
                  <div className="team-info">
                    {match.homeTeam.crest && (
                      <img
                        src={match.homeTeam.crest}
                        alt={match.homeTeam.name}
                        className="team-flag"
                      />
                    )}

                    <div>
                      <p className="team-name">{match.homeTeam.name}</p>
                      <p className="team-code">{match.homeTeam.tla}</p>
                    </div>
                  </div>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    disabled={match.finished}
                    value={currentHome}
                    onChange={(e) =>
                      handleChange(match.id, "homeScore", e.target.value)
                    }
                    className="score-input"
                  />
                </div>

                <div className="score-separator">-</div>

                <div className="team-row">
                  <div className="team-info">
                    {match.awayTeam.crest && (
                      <img
                        src={match.awayTeam.crest}
                        alt={match.awayTeam.name}
                        className="team-flag"
                      />
                    )}

                    <div>
                      <p className="team-name">{match.awayTeam.name}</p>
                      <p className="team-code">{match.awayTeam.tla}</p>
                    </div>
                  </div>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    disabled={match.finished}
                    value={currentAway}
                    onChange={(e) =>
                      handleChange(match.id, "awayScore", e.target.value)
                    }
                    className="score-input"
                  />
                </div>

                {!match.finished && (
                  <>
                    <p className="quick-title">
                      Pulsa una opción rápida para marcar ganador
                    </p>

                    <div className="quick-buttons">
                      <button
                        onClick={() => handleWinnerClick(match.id, "home")}
                        className={`quick-button ${
                          selectedWinner === "home" ? "active" : ""
                        }`}
                      >
                        {match.homeTeam.tla}
                      </button>

                      <button
                        onClick={() => handleWinnerClick(match.id, "draw")}
                        className={`quick-button ${
                          selectedWinner === "draw" ? "active" : ""
                        }`}
                      >
                        Empate
                      </button>

                      <button
                        onClick={() => handleWinnerClick(match.id, "away")}
                        className={`quick-button ${
                          selectedWinner === "away" ? "active" : ""
                        }`}
                      >
                        {match.awayTeam.tla}
                      </button>
                    </div>
                  </>
                )}

                <div className="match-footer">
                  {match.finished ? (
                    <p className="prediction-status">
                      Resultado final: {match.homeScore} - {match.awayScore} ·
                      Puntos: {match.prediction?.points ?? 0}
                    </p>
                  ) : (
                    <>
                      <p className="prediction-status">
                        {match.prediction
                          ? `Guardado: ${match.prediction.homeScore} - ${match.prediction.awayScore}`
                          : "Todavía no has hecho pronóstico"}
                      </p>

                      <button
                        onClick={() => handleSave(match.id)}
                        className="save-button"
                      >
                        {match.prediction
                          ? "Actualizar pronóstico"
                          : "Guardar pronóstico"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}