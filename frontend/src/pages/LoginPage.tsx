import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";
import "./LoginPage.css";

export default function LoginPage() {
const navigate = useNavigate();

const [email, setEmail] = useState("[josema@test.com](mailto:josema@test.com)");
const [password, setPassword] = useState("123456");
const [loading, setLoading] = useState(false);

useEffect(() => {
const token = localStorage.getItem("token");


if (token) {
  navigate("/home");
}


}, [navigate]);

const handleLogin = async (
e: React.FormEvent<HTMLFormElement>
) => {
e.preventDefault();

setLoading(true);

try {
  const data = await loginUser({
    email,
    password,
  });

  if (!data.success) {
    alert(data.message || "Error al iniciar sesión");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user.id);
  localStorage.setItem("username", data.user.username);

  navigate("/home");
} catch (error) {
  console.error("Error login:", error);
  alert("Error al conectar con el servidor");
} finally {
  setLoading(false);
}

};

return ( <div className="login-page"> <div className="container"> <div className="heading">BetDial</div>

    <form
      onSubmit={handleLogin}
      className="form"
    >
      <input
        required
        className="input"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        required
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Sign In"}
      </button>

      <p className="register-text">
        ¿No tienes cuenta?{" "}
        <Link
          to="/register"
          className="register-link"
        >
          Regístrate
        </Link>
      </p>
    </form>
  </div>
</div>

);
}
