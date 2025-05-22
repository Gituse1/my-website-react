import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function StartupsPage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStartups() {
      try {
        const querySnapshot = await getDocs(collection(db, "startups"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStartups(data);
      } catch (err) {
        setError("Не вдалося завантажити дані стартапів.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStartups();
  }, []);

  if (loading) return <p>Завантаження...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Стартапи</h2>
      {startups.length === 0 ? (
        <p>Стартапи відсутні</p>
      ) : (
        <ul>
          {startups.map(s => (
            <li key={s.id}>
              <strong>{s.name}</strong><br />
              Кількість працівників: {s.employees}<br />
              Прибуток: {s.profit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
