import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function MarketPage({ changePage }) {
  const [competitors, setCompetitors] = useState([]);
  const [filter, setFilter] = useState('');
  const [minFinance, setMinFinance] = useState('');
  const [maxFinance, setMaxFinance] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    async function fetchCompetitors() {
      try {
        const querySnapshot = await getDocs(collection(db, "market"));
        const loadedCompetitors = [];
        querySnapshot.forEach(doc => {
          loadedCompetitors.push({ id: doc.id, ...doc.data() });
        });
        setCompetitors(loadedCompetitors);
      } catch (error) {
        console.error("Помилка при отриманні конкурентів з бази:", error);
      }
    }

    fetchCompetitors();
  }, []);

  const spheres = [...new Set(competitors.map(c => c.sphere))].sort();

  let filteredCompetitors = competitors.filter(c => {
    const matchSphere = filter ? c.sphere === filter : true;
    const matchMin = minFinance ? c.finance >= parseInt(minFinance) : true;
    const matchMax = maxFinance ? c.finance <= parseInt(maxFinance) : true;
    return matchSphere && matchMin && matchMax;
  });

  if (sortOrder === 'asc') {
    filteredCompetitors.sort((a, b) => a.finance - b.finance);
  } else if (sortOrder === 'desc') {
    filteredCompetitors.sort((a, b) => b.finance - a.finance);
  }

  return (
    <div className="page-container">
      <main>
        <section id="market-analysis">
          <h1>Аналіз Ринку</h1>

          <section id="competitors">
            <h2>Аналіз конкурентів</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="">Всі сфери</option>
                {spheres.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Мін. фінанси"
                value={minFinance}
                onChange={e => setMinFinance(e.target.value)}
              />
              <input
                type="number"
                placeholder="Макс. фінанси"
                value={maxFinance}
                onChange={e => setMaxFinance(e.target.value)}
              />

              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="">Без сортування</option>
                <option value="asc">За зростанням</option>
                <option value="desc">За спаданням</option>
              </select>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Сфера</th>
                  <th>Розмір компанії</th>
                  <th>Ринки збуту</th>
                  <th>Фінансові показники у доларах</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitors.length > 0 ? (
                  filteredCompetitors.map(c => (
                    <tr key={c.id}>
                      <td>{c.sphere}</td>
                      <td>{c.size}</td>
                      <td>{c.markets}</td>
                      <td>{c.finance?.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Конкурентів не знайдено</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <section id="trends">
            <h2>Тренди на ринку</h2>
            <ul>
              <li>Зростання попиту на технології штучного інтелекту в медицині</li>
              <li>Спрямованість на сталий розвиток та екологічні ініціативи</li>
              <li>Інвестиції в стартапи з фокусом на фінансові технології</li>
            </ul>
          </section>

          <section id="growth-opportunities">
            <h2>Можливості для розвитку</h2>
            <ul>
              <li>Розширення на нові ринки (Східна Європа, Азія)</li>
              <li>Партнерства з великими корпораціями</li>
              <li>Розробка нових продуктів під нові потреби</li>
            </ul>
          </section>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-right">
          <button className="footer-btn">Зв'язатися з нами</button>
        </div>
      </footer>
    </div>
  );
}

export default MarketPage;
