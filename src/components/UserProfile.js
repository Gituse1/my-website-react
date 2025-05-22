import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState("");
  const [finance, setFinance] = useState("");
  const [status, setStatus] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setLocation(data.location || "");
          setFinance(data.finance || "");
        }
      }
    }
    fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        location,
        finance,
      });
      setStatus("Дані оновлено.");
    } catch (err) {
      setStatus("Помилка при оновленні.");
    }
  };

  if (!userData) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Профіль користувача</h2>
      <p><strong>Ім’я:</strong> {userData.firstName}</p>
      <p><strong>Прізвище:</strong> {userData.lastName}</p>
      <p><strong>Email:</strong> {userData.email}</p>

      <div>
        <h3>Додаткова інформація</h3>
        <input
          type="text"
          placeholder="Місце проживання"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="Фінанси"
          value={finance}
          onChange={(e) => setFinance(e.target.value)}
        /><br />
        <button onClick={handleUpdate}>Оновити інформацію</button>
        <p>{status}</p>
      </div>
    </div>
  );
}
