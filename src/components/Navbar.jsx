import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext"; // предположим, что у вас есть такой хук

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUserData } = useAuth(); // Получаем пользователя из контекста

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
      <nav className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold select-none text-pink-600">InstaClone</Link>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="hover:text-pink-600 transition">Главная</Link>
          </li>
          {currentUserData ? (
            <>
              <li>
                <Link to="/profile" className="hover:text-pink-600 transition font-semibold">
                  {currentUserData.username}
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-pink-600 hover:text-pink-800 transition font-semibold"
                >
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-pink-600 transition">Вход</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-pink-600 transition">Регистрация</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
