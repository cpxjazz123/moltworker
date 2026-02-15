// src/components/LoadingScreen.tsx

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="logo">
        <img src="/logo.png" alt="Anify" />
      </div>
      <div className="spinner" />
      <p>正在进入世界...</p>
    </div>
  );
}
