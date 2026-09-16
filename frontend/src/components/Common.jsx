export function Loading({ text = "Carregando..." }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-stone-500">
      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
      {text}
    </div>
  );
}

export function Empty({ icon = "📭", text }) {
  return (
    <div className="card py-12 text-center">
      <div className="text-3xl">{icon}</div>
      <p className="mt-3 text-sm text-stone-500">{text}</p>
    </div>
  );
}

export function Status({ status }) {
  const styles = {
    PENDENTE: "bg-amber-100 text-amber-800",
    APROVADA: "bg-green-100 text-green-800",
    RECUSADA: "bg-red-100 text-red-800",
    CANCELAMENTO_SOLICITADO: "bg-orange-100 text-orange-800",
    CANCELADA: "bg-stone-100 text-stone-600"
  };
  const labels = {
    PENDENTE: "Pendente",
    APROVADA: "Aprovada",
    RECUSADA: "Recusada",
    CANCELAMENTO_SOLICITADO: "Cancelamento solicitado",
    CANCELADA: "Cancelada"
  };

  return (
    <span className={`badge ${styles[status] || "bg-stone-100 text-stone-600"}`}>
      {labels[status] || status}
    </span>
  );
}

export const formatDate = d => new Date(`${d}T12:00:00`).toLocaleDateString("pt-BR");
export const formatDateTime = (date, start, end) => `${formatDate(date)} · ${start}–${end}`;

export function ErrorBox({ message }) {
  return message ? (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  ) : null;
}
