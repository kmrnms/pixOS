import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAlert } from "../contexts/AlertContext";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    login: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let emailToLogin = form.login;
      const emailPattern = /\S+@\S+\.\S+/;

      // Если ввели username, находим email по username
      if (!emailPattern.test(form.login)) {
        const usersRef = collection(db, "users");
        const usernameQuery = query(usersRef, where("username", "==", form.login));
        const usernameSnap = await getDocs(usernameQuery);

        if (usernameSnap.empty) {
          showAlert("Пользователь не найден", "error");
          setLoading(false);
          return;
        }

        usernameSnap.forEach((doc) => {
          emailToLogin = doc.data().email;
        });
      }

      // Авторизуемся по email и паролю
      await signInWithEmailAndPassword(auth, emailToLogin, form.password);

      // Навигация на главную (контекст сам обновит состояние пользователя)
      navigate("/");
    } catch (err) {
      showAlert(getFirebaseErrorMessage(err.code), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">Вход</h2>

      <input
        name="login"
        placeholder="Email или Username"
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded"
        disabled={loading}
      />

      <input
        name="password"
        type="password"
        placeholder="Пароль"
        onChange={handleChange}
        required
        className="w-full mb-6 p-3 border border-gray-300 rounded"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-pink-600 text-white py-3 rounded font-semibold hover:bg-pink-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
