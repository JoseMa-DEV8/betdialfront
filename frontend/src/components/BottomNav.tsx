import "./BottomNav.css";
import { useNavigate } from "react-router-dom";

import {
  House,
  Trophy,
  Globe,
  CircleDot
} from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <button
        className="nav-btn"
        onClick={() => navigate("/home")}
      >
        <House size={26} />
      </button>

      <button
        className="nav-btn"
        onClick={() => navigate("/worldcups")}
      >
        <Globe size={26} />
      </button>

      <button
        className="nav-btn"
        onClick={() => navigate("/matches")}
      >
        <CircleDot size={26} />
      </button>

      <button
        className="nav-btn"
        onClick={() => navigate("/ranking")}
      >
        <Trophy size={26} />
      </button>
    </div>
  );
}