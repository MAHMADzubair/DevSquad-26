import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white p-6 rounded shadow-md w-80"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-blue-500 text-white w-full p-2 rounded"
      >
        Login
      </button>
    </form>
  );
}
