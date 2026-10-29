import styles from "../page.module.css";

const workspaceItems = [
  { label: "My plans", value: "03 active" },
  { label: "Project setup", value: "In progress" },
  { label: "AI studio", value: "Ready" },
];

export default function WorkspacePage() {
  return (
    <main className={styles.workspacePage}>
      <section className={styles.workspaceShell}>
        <header className={styles.workspaceHeader}>
          <div>
            <p className={styles.kicker}>Private workspace</p>
            <h1>Founder workspace</h1>
          </div>
          <button type="button" className={styles.primaryButton}>
            New plan
          </button>
        </header>

        <div className={styles.workspaceGrid}>
          {workspaceItems.map((item) => (
            <article key={item.label} className={styles.workspaceCard}>
              <p className={styles.cardEyebrow}>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
