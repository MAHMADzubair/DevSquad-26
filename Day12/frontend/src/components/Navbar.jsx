import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center bg-black text-white p-4">
      <h1 className="text-xl font-bold">Task Manager</h1>

      <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
