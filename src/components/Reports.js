import React from 'react';

function Reports({ changePage }) {
  return (
    <div className="page-container">
      

      <main>
        <section id="about">
          <article>
            <h2>Про наш симулятор</h2>
            <p>Ми створили цей проєкт, щоб кожен охочий міг спробувати себе у ролі підприємця, не ризикуючи реальними грошима.</p>
          </article>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-right">
          <button className="footer-btn" type="button">Зв'язатися з нами</button>
        </div>
      </footer>
    </div>
  );
}

export default Reports;
