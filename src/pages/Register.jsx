import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc
} from "firebase/firestore";
import { useAlert } from "../contexts/AlertContext";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    gender: "",
    email: "",
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
      const usersRef = collection(db, "users");

      // Проверяем занятость username и email
      const usernameQuery = query(usersRef, where("username", "==", form.username));
      const emailQuery = query(usersRef, where("email", "==", form.email));

      const [usernameSnap, emailSnap] = await Promise.all([
        getDocs(usernameQuery),
        getDocs(emailQuery)
      ]);

      if (!usernameSnap.empty) {
        showAlert("Этот username уже занят", "error");
        setLoading(false);
        return;
      }

      if (!emailSnap.empty) {
        showAlert("Этот email уже зарегистрирован", "error");
        setLoading(false);
        return;
      }

      // Создаем пользователя в Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Записываем дополнительные данные в Firestore
      const userData = {
        fullName: form.fullName,
        username: form.username,
        gender: form.gender,
        email: form.email,
      };

      await setDoc(doc(db, "users", cred.user.uid), userData);

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
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">Регистрация</h2>

      <input
        name="fullName"
        placeholder="Полное имя"
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded"
        disabled={loading}
      />

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded"
        disabled={loading}
      />

      <select
        name="gender"
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded bg-white"
        disabled={loading}
        defaultValue=""
      >
        <option value="" disabled>Пол</option>
        <option value="Мужской">Мужской</option>
        <option value="Женский">Женский</option>
      </select>

      <input
        name="email"
        type="email"
        placeholder="Email"
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
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
