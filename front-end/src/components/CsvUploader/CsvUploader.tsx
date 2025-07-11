import React, { useState, useRef, useEffect } from "react";
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
        setSelectedFile(null);
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
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith(".csv")) {
        setSelectedFile(droppedFile);
        setUploadMessage("");
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

      {!selectedFile ? (
        <p className={styles.dragDropText}>
          Trage și plasează un fișier CSV aici
        </p>
      ) : (
        <p className={styles.selectedFileName}>
          Fișier selectat: <strong>{selectedFile.name}</strong>
        </p>
      )}

      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileChange}
        className={styles.fileInput}
        ref={fileInputRef}
      />

      <button onClick={handleBrowseClick} className={styles.browseButton}>
        Selectează din calculator
      </button>

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
