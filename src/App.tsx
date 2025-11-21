import styles from "./styles/App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.maintenanceCard}>
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjlweGt5MTRpb3V1Y3RqMHJxbHNzbW8wODF2eHpqNjFsMDVmc3JoNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CQSwmarig75orqqj0a/giphy.gif"
          alt="Bakım"
          className={styles.maintenanceGif}
        />
        <h1 className={styles.maintenanceTitle}>404 NOT FOUND</h1>
        <p className={styles.maintenanceText}>
          Buraya geleceğini biliyorduk ama biraz geç kaldın.
        </p>
        <div className={styles.lostItems}>
          <h2 className={styles.lostItemsTitle}>Kaybettiğin şeyler:</h2>
          <ul className={styles.lostItemsList}>
            <li>🎬 Dizi önerileri</li>
            <li>🧩 Mekanları eşleştirme oyunu</li>
            <li>🎵 Sana özel hazırlanmış Spotify playlisti</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
