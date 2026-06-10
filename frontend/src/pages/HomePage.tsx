import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import SideProfileMenu from "../components/SideProfileMenu";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "";
  const worldCupId = localStorage.getItem("worldCupId") || "";
  const worldCupName = localStorage.getItem("worldCupName") || "Sin Mundial";
  const worldCupCode = localStorage.getItem("worldCupCode") || "------";

  const [myPoints, setMyPoints] = useState(0);
  const [myPosition, setMyPosition] = useState("-");
  const [joinCode, setJoinCode] = useState("");
  const [newWorldCupName, setNewWorldCupName] = useState("");
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const loadMyRanking = async () => {
    if (!worldCupId || !userId) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/worldcups/${worldCupId}/ranking`
      );

      const data = await response.json();

      if (data.success) {
        const index = data.ranking.findIndex(
          (participant: any) => participant.user.id === userId
        );

        if (index !== -1) {
          setMyPosition(`#${index + 1}`);
          setMyPoints(data.ranking[index].points);
        }
      }
    } catch (error) {
      console.error("Error cargando ranking del usuario:", error);
    }
  };

  useEffect(() => {
    loadMyRanking();
  }, []);

  const handleJoinWorldCup = async () => {
    if (!joinCode.trim()) {
      alert("Introduce un código");
      return;
    }

    setLoadingJoin(true);

    try {
      const response = await fetch("http://localhost:3000/api/worldcups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: joinCode.trim().toUpperCase(),
          userId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Error al unirse al Mundial");
        return;
      }

      localStorage.setItem("worldCupId", data.participant.worldCup.id);
      localStorage.setItem("worldCupName", data.participant.worldCup.name);
      localStorage.setItem("worldCupCode", data.participant.worldCup.code);

      alert("Te has unido al Mundial correctamente");
      navigate("/home");
      window.location.reload();
    } catch (error) {
      console.error("Error uniéndose al Mundial:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleCreateWorldCup = async () => {
    if (!newWorldCupName.trim()) {
      alert("Introduce un nombre para el Mundial");
      return;
    }

    setLoadingCreate(true);

    try {
      const response = await fetch("http://localhost:3000/api/worldcups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newWorldCupName.trim(),
          ownerId: userId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Error al crear el Mundial");
        return;
      }

      localStorage.setItem("worldCupId", data.worldCup.id);
      localStorage.setItem("worldCupName", data.worldCup.name);
      localStorage.setItem("worldCupCode", data.worldCup.code);

      alert("Mundial creado correctamente");
      setNewWorldCupName("");
      navigate("/home");
      window.location.reload();
    } catch (error) {
      console.error("Error creando Mundial:", error);
      alert("Error al conectar con el servidor");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <h1 className="home-title">BetDial</h1>

        <p className="home-subtitle">Tu centro de predicciones</p>

        <div className="hero-card">
          <p className="hero-label">MUNDIAL ACTIVO</p>
          <h2>{worldCupName}</h2>
          <div className="hero-code">{worldCupCode}</div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>⭐</span>
            <h3>{myPoints}</h3>
            <p>Puntos</p>
          </div>

          <div className="stat-card">
            <span>🏆</span>
            <h3>{myPosition}</h3>
            <p>Posición</p>
          </div>
        </div>

        <div className="home-actions">
          <div className="create-card">
            <p className="home-section-title">Crear Mundial</p>

            <input
              type="text"
              placeholder="Nombre del Mundial"
              value={newWorldCupName}
              onChange={(e) => setNewWorldCupName(e.target.value)}
              className="join-input"
            />

            <button
              className="home-main-button"
              onClick={handleCreateWorldCup}
              disabled={loadingCreate}
            >
              {loadingCreate ? "Creando..." : "Crear Mundial"}
            </button>
          </div>

          <div className="join-card">
            <p className="home-section-title">Unirse con código</p>

            <input
              type="text"
              placeholder="Código Mundial"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="join-input"
            />

            <button
              className="join-button"
              onClick={handleJoinWorldCup}
              disabled={loadingJoin}
            >
              {loadingJoin ? "Uniendo..." : "Unirse"}
            </button>
          </div>
        </div>

        <div className="action-grid">
          <button onClick={() => navigate("/matches")} className="action-card">
            ⚽
            <span>Partidos</span>
          </button>

          <button onClick={() => navigate("/ranking")} className="action-card">
            🏆
            <span>Ranking</span>
          </button>

          <button
            onClick={() => navigate("/my-predictions")}
            className="action-card"
          >
            ⭐
            <span>Mis Picks</span>
          </button>

          <button onClick={() => navigate("/worldcups")} className="action-card">
            🌍
            <span>Mundiales</span>
          </button>
        </div>
      </div>

      <BottomNav />
      <SideProfileMenu />
    </div>
  );
}