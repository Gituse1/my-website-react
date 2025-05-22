import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig"; // db додаємо сюди

export default function RegisterForm({ changePage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // записуємо ім'я, прізвище, email у Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
      });

      changePage("login"); // можна переадресувати одразу на логін
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Реєстрація</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Ім’я"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        /><br/>
        <input
          type="text"
          placeholder="Прізвище"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        /><br/>
        <input
          type="email"
          placeholder="Електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Зареєструватися</button>
      </form>
      <p>Вже є акаунт? <button onClick={() => changePage("login")}>Увійти</button></p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
