import React, { useState, useRef, useEffect } from "react"; // Adăugat useRef
import styles from "./CsvUploader.module.css";
interface CsvUploaderProps {
  onUploadSuccess: () => void;
}
const CsvUploader: React.FC<CsvUploaderProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Ref pentru a accesa input-ul de tip file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadMessage("");
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Te rog selectează un fișier CSV.");
      return;
    }

    setIsUploading(true);
    setUploadMessage("Încărcare în curs...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage(
          `Succes: ${data.message} (Rânduri: ${data.rows}, Coloane: ${data.columns})`
        );
        console.log("Răspuns server:", data);
        setSelectedFile(null); // Resetează fișierul selectat
        // Resetează input-ul de tip file pentru a permite selectarea aceluiași fișier din nou
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess();
      } else {
        setUploadMessage(
          `Eroare: ${data.error || "A apărut o eroare necunoscută."}`
        );
        console.error("Eroare la upload:", data);
      }
    } catch (error) {
      console.error("Eroare de rețea sau la procesare:", error);
      setUploadMessage(
        "Eroare la conectarea cu serverul. Asigură-te că serverul rulează."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Permite drop-ul
    setIsDragging(true); // Activează stilul de dragging
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false); // Dezactivează stilul de dragging
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false); // Dezactivează stilul de dragging

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith(".csv")) {
        // Verificare case-insensitive
        setSelectedFile(droppedFile);
        setUploadMessage("");
        // Resetează input-ul de tip file dacă s-a făcut drop, pentru a evita confuzia
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadMessage("Te rog să tragi un fișier CSV valid.");
        setSelectedFile(null);
      }
      event.dataTransfer.clearData();
    }
  };

  // Funcție pentru a deschide fereastra de selecție fișier când se apasă butonul "Browse"
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setIsTimerActive(true);
    setTimeout(() => {
      setIsTimerActive(false);
    }, 10000);
  }, [uploadMessage]);

  return (
    <div
      className={`${styles.container} ${isDragging ? styles.dragging : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className={styles.title}>Încărcă Fișier CSV</h2>

      {/* Mesajul central pentru zona de drag and drop */}
      {!selectedFile ? (
        <p className={styles.dragDropText}>
          Trage și plasează un fișier CSV aici
        </p>
      ) : (
        <p className={styles.selectedFileName}>
          Fișier selectat: <strong>{selectedFile.name}</strong>
        </p>
      )}

      {/* Inputul de tip file este ascuns, dar conectat la ref și la label */}
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileChange}
        className={styles.fileInput}
        ref={fileInputRef} // Conectează ref-ul
      />

      {/* Butonul pentru a deschide selectorul de fișiere */}
      <button onClick={handleBrowseClick} className={styles.browseButton}>
        Selectează din calculator
      </button>

      {/* Butonul de încărcare efectivă */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className={styles.uploadButton}
      >
        {isUploading ? "Se încarcă..." : "Încarcă Fișier"}
      </button>

      {uploadMessage && isTimerActive && (
        <p
          className={`${styles.message} ${
            uploadMessage.startsWith("Eroare")
              ? styles.errorMessage
              : styles.successMessage
          }`}
        >
          {uploadMessage}
        </p>
      )}
    </div>
  );
};

export default CsvUploader;
