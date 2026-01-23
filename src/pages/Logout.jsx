import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
function Login() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ vient du AuthProvider

  const handleSubmit = async (e) => {
    e.preventDefault();

    logout();
    navigate("/connexion");
  };

  return (
    <main className="flex min-h-screen w-screen overflow-x-hidden bg-slate-900">
      <div className="relative flex-[7] h-screen overflow-hidden">
        <img
          src="/login/val-de-loir-bg.png"
          alt="img-bg"
          className="h-full w-full object-cover"
        />
        <img
          src="/login/logo.png"
          alt="Logo"
          className="absolute left-6 top-6 w-64"
        />
      </div>

      <div className="flex flex-[3] w-full max-w-[50vw] min-h-screen items-center justify-center bg-slate-900 px-6 sm:px-10">
        <button onClick={(e) => handleSubmit(e)}>Déconnexion</button>
      </div>
    </main>
  );
}

export default Login;
