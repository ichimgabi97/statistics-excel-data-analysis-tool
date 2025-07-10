import React, { useState } from "react";
import "./App.css";
import Test from "./components/test/Test";
import CsvUploader from "./components/CsvUploader/CsvUploader";
import PaymentStats from "./components/PaymentStats/PaymentStats";

const App: React.FC = () => {
  const [dataUpdated, setDataUpdated] = useState(false);

  // Funcție pasată către FileUploadComponent pentru a o apela după upload de succes
  const handleFileUploadSuccess = () => {
    setDataUpdated((prev) => !prev); // Togglează state-ul pentru a declanșa reîncărcarea
  };

  return (
    <>
      <h1>Hello from React</h1>
      <Test />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "50px",
          padding: "50px",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <CsvUploader onUploadSuccess={handleFileUploadSuccess} />
        {/* O linie separatoare pentru claritate */}
        <hr
          style={{ width: "80%", border: "none", borderTop: "1px solid #ccc" }}
        />
        <PaymentStats refreshTrigger={dataUpdated} />
      </div>
    </>
  );
};

export default App;
