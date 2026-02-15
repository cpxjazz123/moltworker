import { createFileRoute, Link } from "@tanstack/react-router";
import { onAuthStateChanged, type User } from "firebase/auth";
import React from "react";

import { auth } from "../../firebase";
import styles from "./token-usage.module.css";

interface PlanInfo {
  periodEnd: string;
  periodStart: string;
  quotaTokens?: number; // only for subscription (hardLimitTokens from API)
  remainingTokens?: number; // only for subscription (balanceTokens from API)
  type: PlanType;
  usedTokens: number; // lifetimeUsedTokens from API
}

type PlanType = "payg" | "subscription";

interface UsageLog {
  createdAt: string;
  feature: string;
  id: string;
  model: string;
  totalTokens: number;
}

// API response types
interface TokenSummaryResponse {
  balanceTokens: number;
  billingPeriodEnd: string | null;
  billingPeriodStart: string | null;
  gameUid: number | null;
  hardLimitTokens: number | null;
  lifetimeUsedTokens: number;
  planType: "free" | "subscription" | "topup";
  softLimitTokens: number | null;
}

interface TokenEventResponse {
  costUsd: number;
  createdAt: string;
  direction: "credit" | "debit";
  id: string;
  inputTokens: number;
  meta?: { feature?: string };
  model: string;
  outputTokens: number;
  totalTokens: number;
  userId: string;
}

interface TokenEventsResponse {
  items: TokenEventResponse[];
  total: number;
}

export const Route = createFileRoute("/_user/token-usage")({
  component: TokenUsagePage,
});

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://us-central1-anify-oiy-ai.cloudfunctions.net/api";

async function fetchTokenSummary(userId: string): Promise<TokenSummaryResponse> {
  const response = await fetch(`${API_BASE_URL}/tokens/summary`, {
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch token summary: ${response.status}`);
  }
  return response.json();
}

async function fetchTokenEvents(userId: string, limit = 20): Promise<TokenEventsResponse> {
  const response = await fetch(`${API_BASE_URL}/tokens/events?limit=${limit}`, {
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch token events: ${response.status}`);
  }
  return response.json();
}

function mapSummaryToPlanInfo(summary: TokenSummaryResponse): PlanInfo {
  // Map backend planType to frontend PlanType
  const planTypeMap: Record<string, PlanType> = {
    free: "payg",
    subscription: "subscription",
    topup: "payg",
  };

  // Calculate period dates (default to current month if not set)
  const now = new Date();
  const defaultPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const defaultPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  return {
    periodEnd: summary.billingPeriodEnd ?? defaultPeriodEnd,
    periodStart: summary.billingPeriodStart ?? defaultPeriodStart,
    quotaTokens: summary.hardLimitTokens ?? undefined,
    remainingTokens: summary.balanceTokens,
    type: planTypeMap[summary.planType] ?? "payg",
    usedTokens: summary.lifetimeUsedTokens,
  };
}

function mapEventsToLogs(events: TokenEventResponse[]): UsageLog[] {
  return events.map((event) => ({
    createdAt: event.createdAt,
    feature: event.meta?.feature ?? event.model,
    id: event.id,
    model: event.model,
    totalTokens: event.totalTokens,
  }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

/* payg users */
function PaygPanel({ plan }: { plan: PlanInfo }) {
  return (
    <section className={`${styles.cards} ${styles.cardsSingle}`}>
      <div className={`${styles.card} ${styles.cardMain}`}>
        <div className={styles.cardLabel}>Tokens used</div>
        <div className={styles.cardValue}>
          {plan.usedTokens.toLocaleString()} <span className={styles.unit}>tokens</span>
        </div>
        <div className={styles.cardFoot}>This cycle</div>
      </div>
    </section>
  );
}

/* subscription users */
function SubscriptionPanel({ plan }: { plan: PlanInfo }) {
  const quota = plan.quotaTokens ?? 0;
  const used = plan.usedTokens;
  const remaining = plan.remainingTokens ?? Math.max(quota - used, 0);
  const ratio = quota > 0 ? Math.min(used / quota, 1) : 0;

  return (
    <section className={`${styles.cards} ${styles.cardsSingle}`}>
      <div className={`${styles.card} ${styles.cardMain}`}>
        <div className={styles.cardLabel}>Remaining balance</div>
        <div className={styles.cardValue}>
          {remaining.toLocaleString()} <span className={styles.unit}>tokens</span>
        </div>
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <div className={styles.cardFoot}>
          Used {used.toLocaleString()} / {quota.toLocaleString()} this cycle
        </div>
      </div>
    </section>
  );
}

function TokenUsagePage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [plan, setPlan] = React.useState<null | PlanInfo>(null);
  const [logs, setLogs] = React.useState<UsageLog[]>([]);
  const [user, setUser] = React.useState<User | null>(null);

  // Listen to auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch usage data when user is available
  React.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [summaryData, eventsData] = await Promise.all([
          fetchTokenSummary(user.uid),
          fetchTokenEvents(user.uid),
        ]);

        setPlan(mapSummaryToPlanInfo(summaryData));
        setLogs(mapEventsToLogs(eventsData.items));
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
        setError(err instanceof Error ? err.message : "Failed to load usage data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className={styles.page}>Loading usage…</div>;
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <p>Please <Link to="/login">login</Link> to view your token usage.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>Error: {error}</p>
        <Link to="/adventure">← Back to adventure</Link>
      </div>
    );
  }

  if (!plan) {
    return <div className={styles.page}>No usage data available.</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Token Usage</h1>
          <p className={styles.subtitle}>
            Usage cycle: {formatDate(plan.periodStart)} – {formatDate(plan.periodEnd)}
          </p>
        </div>
        <Link
          className={styles.backLink}
          to="/adventure"
        >
          ← Back to adventure
        </Link>
      </div>

      {plan.type === "subscription" ?
        <SubscriptionPanel plan={plan} />
      : <PaygPanel plan={plan} />}

      {/* 统一的充值 / 订阅入口 */}
      <UsageActions planType={plan.type} />

      <UsageTable logs={logs} />
    </div>
  );
}

/* top-up */
function UsageActions({ planType }: { planType: PlanType }) {
  return (
    <section className={styles.actions}>
      {planType === "subscription" ?
        <>
          <p className={styles.actionsText}>Want to adjust your plan or need more tokens?</p>
          <div className={styles.actionsButtons}>
            <Link
              className={styles.btnPrimary}
              to="/subscription-plans"
            >
              Manage subscription
            </Link>
            <Link
              className={styles.btnSecondary}
              to="/top-up-tokens"
            >
              Buy extra tokens
            </Link>
          </div>
        </>
      : <>
          <p className={styles.actionsText}>Want to subscribe a premium plan or need more tokens?</p>
          <div className={styles.actionsButtons}>
            <Link
              className={styles.btnPrimary}
              to="/subscription-plans"
            >
              View subscription plans
            </Link>
            <Link
              className={styles.btnSecondary}
              to="/top-up-tokens"
            >
              Add tokens once
            </Link>
          </div>
        </>
      }
    </section>
  );
}

function UsageTable({ logs }: { logs: UsageLog[] }) {
  if (!logs.length) {
    return (
      <section className={styles.tableWrapper}>
        <h2 className={styles.sectionTitle}>Usage history</h2>
        <p className={styles.empty}>No usage records yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.tableWrapper}>
      <h2 className={styles.sectionTitle}>Usage history</h2>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Feature</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.feature}</td>
                <td>{log.totalTokens.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
