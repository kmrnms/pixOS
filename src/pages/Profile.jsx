import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Profile() {
  const { username } = useParams();
  const { currentUserData } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!username) {
        setProfileData(currentUserData);
        setLoading(false);
        return;
      }

      if (currentUserData && username === currentUserData.username) {
        setProfileData(currentUserData);
        setLoading(false);
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setProfileData(snapshot.docs[0].data());
        } else {
          setProfileData(null);
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username, currentUserData]);

  if (loading) return <div className="text-center mt-10">Загрузка...</div>;

  if (!profileData) return <div className="text-center mt-10 text-red-500">Пользователь не найден</div>;

  // Проверяем, это ли профиль текущего пользователя
  const isOwnProfile = currentUserData && profileData && currentUserData.username === profileData.username;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">@{profileData.username}</h1>
      <p><strong>Полное имя:</strong> {profileData.fullName}</p>
      <p><strong>Пол:</strong> {profileData.gender}</p>
      <p><strong>Email:</strong> {profileData.email}</p>

      {isOwnProfile && (
        <Link
          to="/profile/edit"
          className="inline-block mt-6 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
        >
          Редактировать профиль
        </Link>
      )}
    </div>
  );
}
