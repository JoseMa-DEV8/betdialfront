import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, X, User, Globe, Trophy, LogOut } from "lucide-react";
import "./SideProfileMenu.css";

export default function SideProfileMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const username = localStorage.getItem("username") || "Usuario";
  const email = localStorage.getItem("email") || "";
  const worldCupName = localStorage.getItem("worldCupName") || "Sin Mundial";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <button className="settings-button" onClick={() => setOpen(true)}>
        <Settings size={24} />
      </button>

      {open && <div className="side-overlay" onClick={() => setOpen(false)} />}

      <aside className={`side-menu ${open ? "open" : ""}`}>
        <button className="side-close" onClick={() => setOpen(false)}>
          <X size={22} />
        </button>

        <div className="side-profile">
          <div className="side-avatar">
            <User size={34} />
          </div>

          <h2>{username}</h2>
          <p>{email}</p>
        </div>

        <div className="side-info-card">
          <Globe size={22} />
          <div>
            <span>Mundial activo</span>
            <strong>{worldCupName}</strong>
          </div>
        </div>

        <button className="side-link" onClick={() => navigate("/worldcups")}>
          <Globe size={21} />
          Mis Mundiales
        </button>

        <button className="side-link" onClick={() => navigate("/ranking")}>
          <Trophy size={21} />
          Ranking
        </button>

        <button className="side-link danger" onClick={logout}>
          <LogOut size={21} />
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}