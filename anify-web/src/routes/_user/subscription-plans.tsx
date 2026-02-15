import { createFileRoute, Link } from "@tanstack/react-router";

import styles from "./subscription-plans.module.css";

export const Route = createFileRoute("/_user/subscription-plans")({
  component: SubscriptionPlansPage,
});

function SubscriptionPlansPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>SUBSCRIPTION PLANS</h1>
        </div>
        <Link
          className={styles.backLink}
          to="/token-usage"
        >
          ← Back to token-usage
        </Link>
      </div>

      <section className={styles.plansSection}>
        <div className={styles.planCard}>
          <h2 className={styles.planName}>Starter</h2>
          <p className={styles.planPrice}>$10 / month</p>
          <p className={styles.planDesc}>50,000 tokens included</p>
          <button>Choose plan</button>
        </div>

        <div className={`${styles.planCard} ${styles.featured}`}>
          <h2 className={styles.planName}>Pro</h2>
          <p className={styles.planPrice}>$30 / month</p>
          <p className={styles.planDesc}>200,000 tokens included</p>
          <button>Choose plan</button>
        </div>

        <div className={styles.planCard}>
          <h2 className={styles.planName}>Unlimited</h2>
          <p className={styles.planPrice}>$99 / month</p>
          <p className={styles.planDesc}>Max usage up to fair-use threshold</p>
          <button>Choose plan</button>
        </div>
      </section>
    </div>
  );
}
