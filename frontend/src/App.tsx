import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WorldCupMatchesPage from "./pages/WorldCupMatchesPage";
import RankingPage from "./pages/WorldCupRankingPage";
import MyWorldCupsPage from "./pages/MyWorldCupsPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/matches" element={<WorldCupMatchesPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/worldcups" element={<MyWorldCupsPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;