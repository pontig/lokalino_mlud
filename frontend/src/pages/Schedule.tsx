import React from "react";

const Schedule: React.FC = () => {
  return (
    <div className="schedule">
      <h1 className="schedule-title">Programma del Merkatino</h1>
      <p className="schedule-description">
        Scopri le date e gli orari per la consegna e il ritiro dei libri.
      </p>
      <ul className="schedule-list">
        <li>Consegna libri: 1-5 Marzo, dalle 10:00 alle 18:00</li>
        <li>Ritiro libri invenduti: 10 Marzo, dalle 10:00 alle 16:00</li>
      </ul>
    </div>
  );
};

export default Schedule;