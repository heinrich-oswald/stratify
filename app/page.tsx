import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.authIntro}>
          <div className={styles.brandWrap}>
            <div className={styles.brandMark}>S</div>
            <span className={styles.brandText}>Stratify</span>
          </div>

          <p className={styles.kicker}>Founder access</p>
          <h1>Welcome back, founder.</h1>
          <p className={styles.subtitle}>
            Sign in to reopen your startup plan, refine assumptions, and keep
            momentum moving from one decision to the next.
          </p>
        </div>

        <form className={styles.authForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Work email</label>
            <input id="email" type="email" placeholder="founder@company.com" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Enter your password" />
          </div>

          <button type="submit" className={styles.primaryButton}>
            Continue to workspace
          </button>

          <button type="button" className={styles.secondaryButton}>
            Create account
          </button>
        </form>
      </section>
    </main>
  );
}
