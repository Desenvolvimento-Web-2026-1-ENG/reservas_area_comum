import { useEffect, useState } from "react";
import { usuariosApi } from "../services/api";
import { Empty, Loading } from "../components/Common";

export default function Usuarios({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await usuariosApi.listar());
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="mb-7 flex items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-subtitle">Visão administrativa dos moradores e zeladores.</p>
        </div>
        <button className="btn btn-secondary" onClick={load}>↻ Recarregar lista</button>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty icon="👥" text="Nenhum usuário encontrado." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-stone-100 text-xs uppercase text-stone-400">
              <tr><th className="pb-3">Nome</th><th>E-mail</th><th>Papel</th><th>Criado em</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((u) => (
                <tr key={u.id}>
                  <td className="py-4 font-semibold">{u.nome}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.papel === "ZELADOR" ? "bg-orange-100 text-orange-700" : "bg-stone-100 text-stone-600"}`}>
                      {u.papel}
                    </span>
                  </td>
                  <td>{new Date(u.criadoEm).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
