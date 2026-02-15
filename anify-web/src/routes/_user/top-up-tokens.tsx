import "../../index.css";

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_user/top-up-tokens")({
  component: TopUpTokenPage,
});

function TopUpTokenPage() {
  return (
    <div className="page usage-page">
      <div className="usage-header">
        <div>
          <h1 className="usage-title">BUY TOKENS</h1>
        </div>
        <Link
          className="usage-back-link"
          to="/token-usage"
        >
          ← Back to token-usage
        </Link>
      </div>

      <section className="plans-section">
        <div className="plan-card">
          <h2 className="plan-name">Tiny Pack</h2>
          <p className="plan-price">$3 / once</p>
          <p className="plan-desc">+ 5,000 tokens</p>
          <button className="btn-primary">Buy</button>
        </div>

        <div className="plan-card">
          <h2 className="plan-name">Small Pack</h2>
          <p className="plan-price">$10 / once</p>
          <p className="plan-desc">+ 20,000 tokens</p>
          <button className="btn-primary">Buy</button>
        </div>

        <div className="plan-card featured">
          <h2 className="plan-name">Medium Pack</h2>
          <p className="plan-price">$25 / once</p>
          <p className="plan-desc">+ 60,000 tokens</p>
          <button className="btn-primary">Buy</button>
        </div>

        <div className="plan-card">
          <h2 className="plan-name">Large Pack</h2>
          <p className="plan-price">$55 / once</p>
          <p className="plan-desc">+ 150,000 tokens</p>
          <button className="btn-primary">Buy</button>
        </div>

        <div className="plan-card">
          <h2 className="plan-name">Mega Pack</h2>
          <p className="plan-price">$120 / once</p>
          <p className="plan-desc">+ 400,000 tokens</p>
          <button className="btn-primary">Buy</button>
        </div>
      </section>
    </div>
  );
}
