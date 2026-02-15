import { createFileRoute, Link } from "@tanstack/react-router";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { auth, db } from "../../firebase";

export const Route = createFileRoute("/_test/stripe-test")({
  component: StripeTestPage,
});

function StripeTestPage() {
  const [user, setUser] = useState<null | User>(null);
  const [baseUrl, setBaseUrl] = useState("http://127.0.0.1:5001/anify-oiy-ai/us-central1");
  const [statusResult, setStatusResult] = useState<any>(null);
  const [tokenSummaryResult, setTokenSummaryResult] = useState<any>(null);
  const [priceId, setPriceId] = useState("price_1Q..."); // Placeholder or valid test price ID
  const [checkoutUrl, setCheckoutUrl] = useState<null | string>(null);
  const [checkoutError, setCheckoutError] = useState<null | string>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const fetchSubscriptionStatus = async () => {
    if (!user) {
      alert("Please login first");

      return;
    }

    setLoadingStatus(true);
    setStatusResult(null);

    try {
      const response = await fetch(`${baseUrl}/subscription_status`, {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        method: "GET",
      });
      const data = await response.json();

      setStatusResult(data);
    } catch (error: any) {
      console.error(error);
      setStatusResult({ error: error.message });
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchTokenSummary = async () => {
    if (!user) {
      alert("Please login first");

      return;
    }

    setLoadingSummary(true);
    setTokenSummaryResult(null);

    try {
      const response = await fetch(`${baseUrl}/tokenSummary`, {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        method: "GET",
      });
      const data = await response.json();

      setTokenSummaryResult(data);
    } catch (error: any) {
      console.error(error);
      setTokenSummaryResult({ error: error.message });
    } finally {
      setLoadingSummary(false);
    }
  };

  const createCheckoutSession = async () => {
    if (!user) {
      alert("Please login first");

      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutUrl(null);

    try {
      const docRef = await addDoc(collection(db, "customers", user.uid, "checkout_sessions"), {
        cancel_url: `${window.location.origin}/stripe-test?cancel=true`,
        price: priceId,
        success_url: `${window.location.origin}/stripe-test?success=true`,
      });

      // Wait for the checkout session to be created by the extension
      const unsubscribe = onSnapshot(doc(db, "customers", user.uid, "checkout_sessions", docRef.id), (doc) => {
        const data = doc.data();

        if (data?.url) {
          setCheckoutUrl(data.url);
          setCheckoutLoading(false);
          unsubscribe();
        }

        if (data?.error) {
          setCheckoutError(data.error.message);
          setCheckoutLoading(false);
          unsubscribe();
        }
      });
    } catch (error: any) {
      console.error(error);
      setCheckoutError(error.message);
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stripe & API Test Page</h1>
        <Link
          className="text-blue-500 hover:underline"
          to="/"
        >
          Back to Home
        </Link>
      </div>

      {!user ?
        <div className="bg-yellow-100 p-4 rounded text-yellow-800">
          ⚠️ You are not logged in. Most features will not work.{" "}
          <Link
            className="underline font-bold"
            to="/login"
          >
            Login here
          </Link>
          .
        </div>
      : <div className="bg-green-100 p-4 rounded text-green-800">
          Logged in as: <strong>{user.email || user.uid}</strong>
        </div>
      }

      <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">API Base URL</label>
          <input
            className="border p-2 rounded w-full font-mono text-sm"
            onChange={(e) => setBaseUrl(e.target.value)}
            type="text"
            value={baseUrl}
          />
          <p className="text-xs text-gray-500">Default is local emulator. Change for production.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subscription Status */}
        <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subscription Status</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loadingStatus}
              onClick={fetchSubscriptionStatus}
            >
              {loadingStatus ? "Loading..." : "Check Status"}
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded min-h-[150px] overflow-auto text-xs font-mono">
            {statusResult ?
              <pre>{JSON.stringify(statusResult, null, 2)}</pre>
            : <span className="text-gray-400">Click Check Status to load data...</span>}
          </div>
        </div>

        {/* Token Summary */}
        <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Token Summary</h2>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              disabled={loadingSummary}
              onClick={fetchTokenSummary}
            >
              {loadingSummary ? "Loading..." : "Get Summary"}
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded min-h-[150px] overflow-auto text-xs font-mono">
            {tokenSummaryResult ?
              <pre>{JSON.stringify(tokenSummaryResult, null, 2)}</pre>
            : <span className="text-gray-400">Click Get Summary to load data...</span>}
          </div>
        </div>
      </div>

      {/* Stripe Checkout */}
      <div className="space-y-4 border p-4 rounded bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Stripe Checkout Integration (Firebase Ext)</h2>
        <p className="text-sm text-gray-600">
          This tests the <code>firestore-stripe-payments</code> extension. Creating a document in{" "}
          <code>customers/{"{uid}"}/checkout_sessions</code> should trigger the extension to generate a checkout URL.
        </p>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Stripe Price ID</label>
            <input
              className="border p-2 rounded w-full"
              onChange={(e) => setPriceId(e.target.value)}
              placeholder="price_123..."
              type="text"
              value={priceId}
            />
          </div>
          <button
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 h-[42px]"
            disabled={checkoutLoading}
            onClick={createCheckoutSession}
          >
            {checkoutLoading ? "Creating Session..." : "Create Checkout Session"}
          </button>
        </div>

        {checkoutError && <div className="bg-red-100 text-red-700 p-3 rounded">Error: {checkoutError}</div>}

        {checkoutUrl && (
          <div className="bg-green-100 text-green-900 p-4 rounded flex flex-col gap-2">
            <p className="font-semibold">Checkout Session Created!</p>
            <a
              className="text-blue-600 underline break-all"
              href={checkoutUrl}
              rel="noreferrer"
              target="_blank"
            >
              {checkoutUrl}
            </a>
            <p className="text-sm text-gray-600">Click the link above to proceed to Stripe Checkout.</p>
          </div>
        )}
      </div>
    </div>
  );
}
