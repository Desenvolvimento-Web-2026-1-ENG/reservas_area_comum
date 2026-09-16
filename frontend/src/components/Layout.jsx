const NAV = [
  ["espacos", "🏠", "Espaços comuns"],
  ["minhas", "📋", "Minhas reservas"],
  ["aprovacoes", "✓", "Aprovações", "ZELADOR"],
  ["usuarios", "👥", "Usuários", "ZELADOR"],
  ["perfil", "◉", "Perfil"]
];

export default function Layout({ user, page, setPage, onLogout, children }) {
  return (
    <div className="min-h-screen bg-stone-50 md:flex">
      <aside className="flex w-full flex-col border-b border-stone-200 bg-white md:fixed md:inset-y-0 md:w-64 md:border-b-0 md:border-r">
        <div className="px-6 py-6">
          <div className="text-xl font-black tracking-tight">
            Condo<span className="text-orange-500">Reservas</span>
          </div>
          <div className="mt-1 text-xs text-stone-400">Gestão de áreas comuns</div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:overflow-visible">
          {NAV.filter(([, , , role]) => !role || role === user.papel).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition md:w-full ${page === key ? "bg-orange-50 text-orange-700" : "text-stone-600 hover:bg-stone-50"}`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-stone-100 p-4 md:block">
          <div className="mb-3 truncate text-sm font-semibold">{user.nome}</div>
          <div className="mb-3 text-xs text-stone-400">{user.papel}</div>
          <button className="btn btn-secondary w-full" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <main className="min-h-screen flex-1 md:ml-64">
        <div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div>
        <div className="p-4 md:hidden">
          <button className="btn btn-secondary w-full" onClick={onLogout}>Sair</button>
        </div>
      </main>
    </div>
  );
}
