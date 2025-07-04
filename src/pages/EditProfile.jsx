import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";

export default function EditProfile() {
  const { currentUser, currentUserData } = useAuth(); // uid и данные пользователя
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    gender: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUserData) {
      setForm({
        fullName: currentUserData.fullName || "",
        username: currentUserData.username || "",
        gender: currentUserData.gender || "",
        email: currentUserData.email || "",
      });
    }
  }, [currentUserData]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Проверка уникальности username, если изменился
      if (form.username !== currentUserData.username) {
        const usersRef = collection(db, "users");
        const usernameQuery = query(usersRef, where("username", "==", form.username));
        const usernameSnap = await getDocs(usernameQuery);

        if (!usernameSnap.empty) {
          showAlert("Этот username уже занят", "error");
          setLoading(false);
          return;
        }
      }

      // Обновляем данные в Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, {
        fullName: form.fullName,
        username: form.username,
        gender: form.gender,
        email: form.email, // Если email менять нельзя, то можно не сохранять или убрать из формы
      }, { merge: true });

      showAlert("Данные успешно обновлены", "success");

      // Можно обновить контекст, если он хранит userData (в AuthContext)
      // Например, вызвать функцию обновления из контекста, если есть

    } catch (err) {
      showAlert("Ошибка при обновлении данных", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">Редактировать профиль</h2>

      <input
        name="fullName"
        placeholder="Полное имя"
        value={form.fullName}
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded"
        disabled={loading}
      />

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded"
        disabled={loading}
      />

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
        className="w-full mb-4 p-3 border border-gray-300 rounded bg-white"
        disabled={loading}
      >
        <option value="" disabled>Пол</option>
        <option value="Мужской">Мужской</option>
        <option value="Женский">Женский</option>
      </select>

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        readOnly
        className="w-full mb-6 p-3 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-pink-600 text-white py-3 rounded font-semibold hover:bg-pink-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Сохраняем..." : "Сохранить"}
      </button>
    </form>
  );
}
