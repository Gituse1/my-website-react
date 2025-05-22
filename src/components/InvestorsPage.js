import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";  // імпортуємо з офіційного пакету
import { db } from "../firebase/firebaseConfig.js";




function InvestorsPage({ changePage }) {
  const [investors, setInvestors] = useState([]);
  const [competitors, setCompetitors] = useState([]);

  useEffect(() => {
    async function fetchInvestors() {
      const querySnapshot = await getDocs(collection(db, "investors"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestors(data);
    }

    async function fetchCompetitors() {
      const querySnapshot = await getDocs(collection(db, "competitors"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompetitors(data);
    }

    fetchInvestors();
    fetchCompetitors();
  }, []);

  return (
    <div className="page-container">
      <main>
        <h2>Інвестори</h2>
        <div className="grid-list">
          {investors.map((investor) => (
            <div key={investor.id} className="grid-item">
              <div className="investor-header">{investor.name}</div>
              <div className="investor-detail">{investor.sector}</div>
              <div className="investor-detail">{investor.capital}</div>
            </div>
          ))}
        </div>

        <h2>Конкуренти</h2>
        <div className="grid-list">
          {competitors.map((comp) => (
            <div key={comp.id} className="grid-item">
              <div className="investor-header">{comp.name}</div>
              <div className="investor-detail">{comp.sector}</div>
              <div className="investor-detail">Рейтинг: {comp.rating}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-right">
          <button className="footer-btn" type="button">Зв'язатися з нами</button>
        </div>
      </footer>
    </div>
  );
}

export default InvestorsPage;
