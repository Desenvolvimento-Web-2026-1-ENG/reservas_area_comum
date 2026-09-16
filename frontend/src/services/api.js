const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const token = localStorage.getItem("condoreservas_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.mensagem || body.erro || body.error || `Erro ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const authApi = {
  login: (email, senha) => request("/autenticacao/entrar", { method: "POST", body: JSON.stringify({ email, senha }) }),
  cadastro: (data) => request("/usuarios", { method: "POST", body: JSON.stringify(data) })
};

export const usuariosApi = {
  me: () => request("/usuarios/me"),
  atualizarMeu: (data) => request("/usuarios/me", { method: "PATCH", body: JSON.stringify(data) }),
  listar: () => request("/usuarios")
};

export const espacosApi = {
  listar: () => request("/espacos"),
  buscar: (id) => request(`/espacos/${id}`),
  criar: (data) => request("/espacos", { method: "POST", body: JSON.stringify(data) }),
  atualizar: (id, data) => request(`/espacos/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remover: (id) => request(`/espacos/${id}`, { method: "DELETE" })
};

const withFilters = (path, filters = {}) => {
  const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined && v !== null));
  return params.toString() ? `${path}?${params}` : path;
};

export const reservasApi = {
  criar: (espacoId, data) => request(`/espacos/${espacoId}/reservas`, { method: "POST", body: JSON.stringify(data) }),
  minhas: (filters = {}) => request(withFilters("/reservas/minhas", filters)),
  porEspaco: (espacoId, filters = {}) => request(withFilters(`/espacos/${espacoId}/reservas`, filters)),
  disponibilidade: (espacoId, data) => request(withFilters(`/espacos/${espacoId}/disponibilidade`, { data })),
  pendentes: () => request("/reservas/pendentes"),
  cancelamentosPendentes: () => request("/reservas/cancelamentos-pendentes"),
  aprovar: (id) => request(`/reservas/${id}/aprovacao`, { method: "PATCH" }),
  recusar: (id) => request(`/reservas/${id}/recusa`, { method: "PATCH" }),
  solicitarCancelamento: (id) => request(`/reservas/${id}/cancelamento`, { method: "POST" }),
  aprovarCancelamento: (id) => request(`/reservas/${id}/cancelamento/aprovacao`, { method: "PATCH" }),
  recusarCancelamento: (id) => request(`/reservas/${id}/cancelamento/recusa`, { method: "PATCH" })
};
