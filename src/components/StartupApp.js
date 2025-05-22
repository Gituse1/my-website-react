import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const StartupApp = () => {
  const [startups, setStartups] = useState([]);
  const [activeStartup, setActiveStartup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const [realData, setRealData] = useState({ profit: [], employees: [] });
  const [simulatedData, setSimulatedData] = useState({ profit: [], employees: [] });

  const [profitDelta, setProfitDelta] = useState(0);
  const [employeeDelta, setEmployeeDelta] = useState(0);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const loadedStartups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("startup_")) {
        const data = JSON.parse(localStorage.getItem(key));
        loadedStartups.push({ id: key, data });
      }
    }
    setStartups(loadedStartups);
  }, []);

  useEffect(() => {
    if (!chartRef.current || !showReport) return;
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Період 1", "Період 2", "Період 3", "Період 4", "Період 5"],
        datasets: [
          { label: "Реальні прибутки", data: realData.profit, backgroundColor: "rgba(75, 192, 192, 0.6)" },
          { label: "Змодельовані прибутки", data: simulatedData.profit, backgroundColor: "rgba(153, 102, 255, 0.6)" },
          { label: "Реальні працівники", data: realData.employees, backgroundColor: "rgba(255, 159, 64, 0.6)" },
          { label: "Змодельовані працівники", data: simulatedData.employees, backgroundColor: "rgba(54, 162, 235, 0.6)" },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }, [realData, simulatedData, showReport]);

  const applyStartup = (startup) => {
    setActiveStartup(startup);
    setShowForm(false);
    setShowReport(false);

    const profit = parseFloat(startup.profits);
    const employees = parseInt(startup.employees);

    setRealData({
      profit: Array(5).fill(profit),
      employees: Array(5).fill(employees),
    });

    setSimulatedData({
      profit: [profit, profit + 100, profit + 200, profit + 150, profit + 250],
      employees: [employees, employees + 2, employees + 4, employees + 6, employees + 8],
    });

    setProfitDelta(0);
    setEmployeeDelta(0);
  };

  const deleteStartup = (id) => {
    localStorage.removeItem(id);
    setStartups((prev) => prev.filter((s) => s.id !== id));

    if (activeStartup && activeStartup.id === id) {
      setActiveStartup(null);
      setRealData({ profit: [], employees: [] });
      setSimulatedData({ profit: [], employees: [] });
      setShowReport(false);
      setProfitDelta(0);
      setEmployeeDelta(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const companyName = form["company-name"].value.trim();
    const industry = form["industry"].value.trim();
    const employees = parseInt(form["employees"].value);
    const profits = parseFloat(form["profits"].value);
    const expenses = parseFloat(form["expenses"].value);
    const markets = form["markets"].value.trim();
    const offices = form["offices"].value.trim();

    if (!companyName) return;

    const id = "startup_" + Date.now();
    const newStartup = {
      id,
      data: { companyName, industry, employees, profits, expenses, markets, offices },
    };

    localStorage.setItem(id, JSON.stringify(newStartup.data));
    setStartups((prev) => [...prev, newStartup]);
    applyStartup(newStartup.data);
    setShowReport(false);

    form.reset();
    setShowForm(false);
  };

  const applyChangesToStartup = () => {
    if (!activeStartup) return;

    const updatedProfits = parseFloat(activeStartup.profits) + parseFloat(profitDelta || 0);
    const updatedEmployees = parseInt(activeStartup.employees) + parseInt(employeeDelta || 0);

    const updatedStartup = {
      ...activeStartup,
      profits: updatedProfits,
      employees: updatedEmployees,
    };

    const updatedStartups = startups.map((s) =>
      s.id === activeStartup.id ? { ...s, data: updatedStartup } : s
    );

    localStorage.setItem(activeStartup.id, JSON.stringify(updatedStartup));
    setStartups(updatedStartups);
    setActiveStartup(updatedStartup);

    setProfitDelta(0);
    setEmployeeDelta(0);

    setRealData({
      profit: Array(5).fill(updatedProfits),
      employees: Array(5).fill(updatedEmployees),
    });
    setSimulatedData({
      profit: [updatedProfits, updatedProfits + 100, updatedProfits + 200, updatedProfits + 150, updatedProfits + 250],
      employees: [updatedEmployees, updatedEmployees + 2, updatedEmployees + 4, updatedEmployees + 6, updatedEmployees + 8],
    });
  };

  // Функція для відображення характеристик стартапу
  const StartupDetails = ({ startup }) => {
    if (!startup) return null;
    return (
      <section style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
        <h3>Характеристики стартапу</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><b>Назва компанії:</b> {startup.companyName}</li>
          <li><b>Сфера діяльності:</b> {startup.industry}</li>
          <li><b>Кількість працівників:</b> {startup.employees}</li>
          <li><b>Прибуток:</b> {startup.profits}</li>
          <li><b>Витрати:</b> {startup.expenses}</li>
          <li><b>Ринки збуту:</b> {startup.markets}</li>
          <li><b>Офіси:</b> {startup.offices}</li>
        </ul>
      </section>
    );
  };

  // Стилі CSS
  const styles = {
    container: { maxWidth: "900px", margin: "auto", padding: "20px" },
    button: {
      marginRight: "10px",
      padding: "8px 16px",
      cursor: "pointer",
      border: "1px solid #333",
      backgroundColor: "#fff",
      transition: "background-color 0.3s, color 0.3s",
    },
    activeButton: {
      backgroundColor: "#333",
      color: "#fff",
      borderColor: "#222",
    },
    formSection: {
      marginBottom: "20px",
      border: "1px solid #ccc",
      padding: "10px",
    },
    formRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    label: {
      width: "180px",
      fontWeight: "600",
      paddingRight: "10px",
      textAlign: "right",
    },
    input: {
      flexGrow: 1,
      padding: "6px 10px",
      fontSize: "14px",
    },
    startupTab: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #ddd",
      padding: "8px",
      marginBottom: "8px",
    },
    startupName: {
      flexBasis: "60%",
      fontWeight: "600",
      overflowWrap: "break-word",
    },
    employeesCount: {
      flexBasis: "30%",
      textAlign: "right",
      fontWeight: "500",
      color: "#555",
    },
    deltaInput: {
      width: "80px",
      marginRight: "10px",
      padding: "6px 8px",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ marginBottom: "20px" }}>
        <button
          style={{ ...styles.button, ...(showForm ? styles.activeButton : {}) }}
          onClick={() => {
            setShowForm(true);
            setActiveStartup(null);
            setShowReport(false);
          }}
        >
          Створити стартап
        </button>
        <button
          style={{ ...styles.button, ...(!showForm && activeStartup ? styles.activeButton : {}) }}
          disabled={!activeStartup}
          onClick={() => {
            setShowForm(false);
            setShowReport(false);
          }}
        >
          Застосувати стартап
        </button>
      </div>

      {showForm && (
        <>
          <section id="startup-form" style={styles.formSection}>
            <h2>Створити стартап</h2>
            <form id="startupForm" onSubmit={handleSubmit}>
              {[
                { label: "Назва компанії", name: "company-name", type: "text" },
                { label: "Сфера діяльності", name: "industry", type: "text" },
                { label: "Кількість працівників", name: "employees", type: "number" },
                { label: "Прибуток", name: "profits", type: "number", step: "0.01" },
                { label: "Витрати", name: "expenses", type: "number", step: "0.01" },
                { label: "Ринки збуту", name: "markets", type: "text" },
                { label: "Офіси", name: "offices", type: "text" },
              ].map(({ label, name, type, step }) => (
                <div key={name} style={styles.formRow}>
                  <label htmlFor={name} style={styles.label}>
                    {label}:
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    step={step}
                    required
                    style={styles.input}
                  />
                </div>
              ))}

              <div style={{ textAlign: "center" }}>
                <button type="submit" style={styles.button}>
                  Створити
                </button>
              </div>
            </form>
          </section>

          {/* Відображення характеристик активного (новоствореного) стартапу */}
          {activeStartup && <StartupDetails startup={activeStartup} />}
        </>
      )}

      {!showForm && (
        <>
          {/* Список стартапів */}
          <section id="startups-list">
            <h2>Список стартапів</h2>
            {startups.length === 0 && <p>Стартапів немає.</p>}
            {startups.map(({ id, data }) => (
              <div key={id} style={styles.startupTab}>
                <div style={styles.startupName}>{data.companyName}</div>
                <div style={styles.employeesCount}>Працівників: {data.employees}</div>
                <div>
                  <button
                    style={styles.button}
                    onClick={() => applyStartup(data)}
                  >
                    Застосувати
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => deleteStartup(id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Відображення активного стартапу і управління змінами */}
          {activeStartup && (
            <section id="active-startup" style={{ marginTop: "30px" }}>
              <StartupDetails startup={activeStartup} />

              <div
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: "#eef",
                }}
              >
                <h3>Змінити характеристики стартапу</h3>
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ marginRight: "10px" }}>
                    Зміна прибутку:
                    <input
                      type="number"
                      style={styles.deltaInput}
                      value={profitDelta}
                      onChange={(e) => setProfitDelta(e.target.value)}
                    />
                  </label>
                  <label>
                    Зміна кількості працівників:
                    <input
                      type="number"
                      style={styles.deltaInput}
                      value={employeeDelta}
                      onChange={(e) => setEmployeeDelta(e.target.value)}
                    />
                  </label>
                </div>
                <button onClick={applyChangesToStartup} style={styles.button}>
                  Застосувати зміни
                </button>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  style={styles.button}
                  onClick={() => setShowReport((prev) => !prev)}
                >
                  {showReport ? "Приховати звіт" : "Показати звіт"}
                </button>
                {showReport && (
                  <div style={{ marginTop: "20px" }}>
                    <canvas ref={chartRef} />
                    <table
                      border="1"
                      cellPadding="5"
                      style={{ marginTop: "20px", borderCollapse: "collapse", width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>Період</th>
                          {[1, 2, 3, 4, 5].map((p) => (
                            <th key={p}>{p}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Реальні прибутки</td>
                          {realData.profit.map((v, i) => (
                            <td key={i}>{v}</td>
                          ))}
                        </tr>
                        <tr>
                          <td>Змодельовані прибутки</td>
                          {simulatedData.profit.map((v, i) => (
                            <td key={i}>{v}</td>
                          ))}
                        </tr>
                        <tr>
                          <td>Реальні працівники</td>
                          {realData.employees.map((v, i) => (
                            <td key={i}>{v}</td>
                          ))}
                        </tr>
                        <tr>
                          <td>Змодельовані працівники</td>
                          {simulatedData.employees.map((v, i) => (
                            <td key={i}>{v}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default StartupApp;
