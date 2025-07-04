// utils/firebaseErrors.js

const firebaseErrorMap = {
  "auth/email-already-in-use": "Пользователь с таким email уже существует.",
  "auth/invalid-email": "Некорректный email адрес.",
  "auth/weak-password": "Пароль слишком простой. Минимум 6 символов.",
  "auth/user-not-found": "Пользователь не найден.",
  "auth/wrong-password": "Неверный пароль.",
  "auth/invalid-credential": "Неверный логин или пароль.",
  "auth/too-many-requests": "Слишком много попыток. Попробуйте позже.",
  "auth/network-request-failed": "Ошибка сети. Проверьте соединение.",
  "auth/operation-not-allowed": "Операция не разрешена.",
  "auth/missing-password": "Введите пароль.",
};

export function getFirebaseErrorMessage(code) {
  return firebaseErrorMap[code] || "Произошла неизвестная ошибка.";
}
