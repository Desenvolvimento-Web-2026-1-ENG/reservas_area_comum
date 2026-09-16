import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function push(type, message) {
    const id = Date.now() + Math.random();

    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }

  return {
    toasts,
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m)
  };
}

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(92vw,380px)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg ${t.type === "error" ? "border-red-200 text-red-700" : t.type === "success" ? "border-green-200 text-green-700" : "border-orange-200 text-orange-700"}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
