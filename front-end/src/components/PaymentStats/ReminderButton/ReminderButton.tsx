// src/components/ReminderButton.tsx
import React, { useState } from "react";
import styles from "../PaymentStats.module.css"; // Reutilizăm stilurile existente

interface ReminderButtonProps {
  // O funcție de callback opțională, dacă componenta părinte vrea să știe când s-a terminat trimiterea
  onRemindersSent?: (message: string, isError: boolean) => void;
  // Prop pentru a dezactiva butonul dacă nu sunt date (din PaymentStats)
  isDisabled?: boolean;
}

const ReminderButton: React.FC<ReminderButtonProps> = ({
  onRemindersSent,
  isDisabled = false,
}) => {
  const [sendingReminders, setSendingReminders] = useState<boolean>(false);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);

  const handleSendReminders = async () => {
    setSendingReminders(true);
    setReminderMessage(null); // Resetează mesajul la fiecare trimitere

    try {
      const response = await fetch("http://localhost:5000/send-reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      const isError = !response.ok;
      const message =
        data.message || data.error || "A apărut o eroare necunoscută.";

      setReminderMessage(message); // Setează mesajul pentru afișare locală
      if (onRemindersSent) {
        onRemindersSent(message, isError); // Anunță componenta părinte
      }
    } catch (err) {
      console.error("Eroare la trimiterea reminderelor:", err);
      const errorMessage = "Eroare de rețea la trimiterea reminderelor.";
      setReminderMessage(errorMessage);
      if (onRemindersSent) {
        onRemindersSent(errorMessage, true);
      }
    } finally {
      setSendingReminders(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSendReminders}
        // Butonul este dezactivat dacă se trimit deja remindere sau dacă isDisabled este true (fără date)
        disabled={sendingReminders || isDisabled}
        className={styles.sendRemindersButton}
      >
        {sendingReminders
          ? "Se trimit remindere..."
          : "Trimite Remindere Plăți"}
      </button>
      {reminderMessage && (
        <p
          className={
            reminderMessage.includes("Eroare")
              ? styles.errorMessage
              : styles.successMessage
          }
        >
          {reminderMessage}
        </p>
      )}
    </>
  );
};

export default ReminderButton;
