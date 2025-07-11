import React, { useState } from "react";
import styles from "../PaymentStats.module.css";

interface ReminderButtonProps {
  onRemindersSent?: (message: string, isError: boolean) => void;
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
    setReminderMessage(null);

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

      setReminderMessage(message);
      if (onRemindersSent) {
        onRemindersSent(message, isError);
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
