import React, { useEffect, useState, useCallback } from "react";
import styles from "./PaymentStats.module.css";
import ReminderButton from "./ReminderButton/ReminderButton";

interface PaymentStatsData {
  total_people: number;
  paid_full: number;
  paid_partial: number;
  not_paid: number;
  message?: string;
  error?: string;
}

interface PaymentStatsProps {
  refreshTrigger?: boolean | number;
}

const PaymentStats: React.FC<PaymentStatsProps> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState<PaymentStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5000/payment-stats");
      const data: PaymentStatsData = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        setError(
          data.message ||
            data.error ||
            "A apărut o eroare la preluarea statisticilor."
        );
      }
    } catch (err) {
      console.error("Eroare la conectarea cu serverul:", err);
      setError(
        "Nu s-a putut conecta la server. Asigură-te că serverul Flask rulează și că ai încărcat un fișier CSV."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshTrigger]);

  const handleRemindersSent = (message: string, isError: boolean) => {
    console.log(
      "Mesaj de la ReminderButton:",
      message,
      "Este eroare:",
      isError
    );
  };

  const CIRCLE_RADIUS = 60;
  const STROKE_WIDTH = 12;
  const circumference = 2 * Math.PI * CIRCLE_RADIUS;

  const greenColor = "#28a745";
  const yellowColor = "#ffc107";
  const redColor = "#dc3545";

  const paidFullPercentage = stats
    ? (stats.paid_full / stats.total_people) * 100
    : 0;
  const paidPartialPercentage = stats
    ? (stats.paid_partial / stats.total_people) * 100
    : 0;
  const notPaidPercentage = stats
    ? (stats.not_paid / stats.total_people) * 100
    : 0;

  let currentRotation = -90;
  const segments = [];

  if (paidFullPercentage > 0) {
    const angle = (paidFullPercentage / 100) * 360;
    segments.push({
      percentage: paidFullPercentage,
      color: greenColor,
      rotate: currentRotation,
      length: (paidFullPercentage / 100) * circumference,
    });
    currentRotation += angle;
  }

  if (paidPartialPercentage > 0) {
    const angle = (paidPartialPercentage / 100) * 360;
    segments.push({
      percentage: paidPartialPercentage,
      color: yellowColor,
      rotate: currentRotation,
      length: (paidPartialPercentage / 100) * circumference,
    });
    currentRotation += angle;
  }

  if (notPaidPercentage > 0) {
    const angle = (notPaidPercentage / 100) * 360;
    segments.push({
      percentage: notPaidPercentage,
      color: redColor,
      rotate: currentRotation,
      length: (notPaidPercentage / 100) * circumference,
    });
    currentRotation += angle;
  }

  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.title}>Statistici Plăți</h2>

      <div className={styles.progressBarWrapper}>
        <div className={styles.circularProgressStack}>
          <svg
            height={CIRCLE_RADIUS * 2 + STROKE_WIDTH}
            width={CIRCLE_RADIUS * 2 + STROKE_WIDTH}
            viewBox={`0 0 ${CIRCLE_RADIUS * 2 + STROKE_WIDTH} ${
              CIRCLE_RADIUS * 2 + STROKE_WIDTH
            }`}
            className={styles.progressBarSvg}
          >
            <circle
              className={styles.progressBarBackground}
              cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
              cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
              r={CIRCLE_RADIUS}
              strokeWidth={STROKE_WIDTH}
            />

            {segments.map((segment, index) => (
              <circle
                key={index}
                className={styles.progressBarProgress}
                cx={CIRCLE_RADIUS + STROKE_WIDTH / 2}
                cy={CIRCLE_RADIUS + STROKE_WIDTH / 2}
                r={CIRCLE_RADIUS}
                strokeWidth={STROKE_WIDTH}
                stroke={segment.color}
                strokeDasharray={`${segment.length} ${
                  circumference - segment.length
                }`}
                strokeDashoffset={0}
                strokeLinecap="butt"
                style={{
                  transformOrigin: "center center",
                  transform: `rotate(${segment.rotate}deg)`,
                }}
              />
            ))}
          </svg>
        </div>
        <div className={styles.totalPeopleDisplay}>
          {stats ? stats.total_people : 0}
        </div>
        <div className={styles.totalPeopleLabel}>persoane</div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span
            className={styles.legendColor}
            style={{ backgroundColor: greenColor }}
          ></span>
          Plătit Complet ({paidFullPercentage.toFixed(1)}%)
        </div>
        <div className={styles.legendItem}>
          <span
            className={styles.legendColor}
            style={{ backgroundColor: yellowColor }}
          ></span>
          Plată Parțială ({paidPartialPercentage.toFixed(1)}%)
        </div>
        <div className={styles.legendItem}>
          <span
            className={styles.legendColor}
            style={{ backgroundColor: redColor }}
          ></span>
          Nu au Plătit ({notPaidPercentage.toFixed(1)}%)
        </div>
      </div>

      <ReminderButton
        onRemindersSent={handleRemindersSent}
        isDisabled={!stats || stats.total_people === 0}
      />
    </div>
  );
};

export default PaymentStats;
