import { useEffect, useState } from "react";
import { reservasApi, espacosApi } from "../services/api";
import { Empty, Loading, Status, formatDate } from "../components/Common";

export default function MinhasReservas({ toast }) {
  const [items, setItems] = useState([]);
  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [r, e] = await Promise.all([
        reservasApi.minhas({ status, dataInicio: inicio, dataFim: fim, limite: 100 }),
        espacosApi.listar()
      ]);
      setItems(r.itens || []);
      setEspacos(e);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status, inicio, fim]);

  const name = (id) => espacos.find((e) => e.id === id)?.nome || id;

  async function cancel(id) {
    if (!confirm("Solicitar cancelamento desta reserva?")) return;

    try {
      await reservasApi.solicitarCancelamento(id);
      toast.success("Cancelamento enviado para aprovação do zelador.");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="page-title">Minhas reservas</h1>
        <p className="page-subtitle">Acompanhe solicitações, aprovações e cancelamentos.</p>
      </div>

      <div className="card mb-5">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="APROVADA">Aprovada</option>
            <option value="RECUSADA">Recusada</option>
            <option value="CANCELAMENTO_SOLICITADO">Cancelamento solicitado</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <input className="input" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          <input className="input" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty icon="📋" text="Nenhuma reserva encontrada com os filtros atuais." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-stone-100 text-xs uppercase text-stone-400">
              <tr>
                <th className="pb-3">Espaço</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="py-4 font-semibold">{name(r.espacoId)}</td>
                  <td>{formatDate(r.data)}</td>
                  <td>{r.horaInicio}–{r.horaFim}</td>
                  <td><Status status={r.status} /></td>
                  <td>
                    {["PENDENTE", "APROVADA"].includes(r.status) && (
                      <button className="btn btn-danger py-1.5" onClick={() => cancel(r.id)}>
                        Solicitar cancelamento
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
