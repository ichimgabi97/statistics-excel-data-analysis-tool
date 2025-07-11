import React, { useEffect, useState } from "react";
import styles from "./App.module.css";

import CsvUploader from "./components/CsvUploader/CsvUploader";
import PaymentStats from "./components/PaymentStats/PaymentStats";

const App: React.FC = () => {
  const [dataUpdated, setDataUpdated] = useState(false);

  const handleFileUploadSuccess = () => {
    setDataUpdated((prev) => !prev);
  };

  useEffect(() => {
    fetch("http://localhost:5000/test")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("A apărut o eroare la fetch:", error);
      });
  }, []);

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.mainTitle}>Sistem de Gestiune și Analiză Plăți</h1>
      <div className={styles.contentWrapper}>
        <CsvUploader onUploadSuccess={handleFileUploadSuccess} />
        <hr className={styles.separator} />
        <PaymentStats refreshTrigger={dataUpdated} />
      </div>
    </div>
  );
};

export default App;
