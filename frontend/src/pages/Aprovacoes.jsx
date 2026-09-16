import { useEffect, useState } from "react";
import { reservasApi, espacosApi, usuariosApi } from "../services/api";
import { Empty, Loading, Status, formatDate } from "../components/Common";

export default function Aprovacoes({ toast }) {
  const [pendentes, setPendentes] = useState([]);
  const [cancelamentos, setCancelamentos] = useState([]);
  const [espacos, setEspacos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const [p, c, e, u] = await Promise.all([
        reservasApi.pendentes(),
        reservasApi.cancelamentosPendentes(),
        espacosApi.listar(),
        usuariosApi.listar()
      ]);

      setPendentes(p);
      setCancelamentos(c);
      setEspacos(e);
      setUsuarios(u);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const space = (id) => espacos.find((e) => e.id === id)?.nome || id;
  const user = (id) => usuarios.find((e) => e.id === id)?.nome || id;

  async function act(fn, id, msg) {
    try {
      await fn(id);
      toast.success(msg);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return <Loading />;

  const Row = ({ r, cancel = false }) => (
    <div className="flex flex-col gap-4 rounded-xl border border-stone-200 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="font-bold">{space(r.espacoId)}</div>
        <div className="mt-1 text-sm text-stone-500">
          {user(r.usuarioId)} · {formatDate(r.data)} · {r.horaInicio}–{r.horaFim}
        </div>
        <div className="mt-2">
          <Status status={r.status} />
        </div>
      </div>
      <div className="flex gap-2">
        {cancel ? (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => act(reservasApi.recusarCancelamento, r.id, "Cancelamento recusado.")}
            >
              Recusar
            </button>
            <button
              className="btn btn-primary"
              onClick={() => act(reservasApi.aprovarCancelamento, r.id, "Cancelamento aprovado.")}
            >
              Aprovar
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-danger"
              onClick={() => act(reservasApi.recusar, r.id, "Reserva recusada.")}
            >
              Recusar
            </button>
            <button
              className="btn btn-primary"
              onClick={() => act(reservasApi.aprovar, r.id, "Reserva aprovada.")}
            >
              Aprovar
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-7">
        <h1 className="page-title">Aprovações</h1>
        <p className="page-subtitle">
          Decida sobre novas reservas e pedidos de cancelamento.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-black">
          Reservas pendentes <span className="text-orange-500">({pendentes.length})</span>
        </h2>
        {pendentes.length ? (
          <div className="space-y-3">
            {pendentes.map((r) => <Row key={r.id} r={r} />)}
          </div>
        ) : (
          <Empty text="Não há reservas pendentes." />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-black">
          Cancelamentos solicitados <span className="text-orange-500">({cancelamentos.length})</span>
        </h2>
        {cancelamentos.length ? (
          <div className="space-y-3">
            {cancelamentos.map((r) => <Row key={r.id} r={r} cancel />)}
          </div>
        ) : (
          <Empty text="Não há cancelamentos pendentes." />
        )}
      </section>
    </div>
  );
}
