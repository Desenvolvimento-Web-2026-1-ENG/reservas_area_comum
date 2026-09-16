import { useEffect, useState } from "react";
import { usuariosApi } from "../services/api";
import { Loading, ErrorBox } from "../components/Common";

export default function Perfil({ user, setUser, toast, onLogout }) {
  const [data, setData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ nome: user.nome, email: user.email, senha: "" });

  async function load() {
    setLoading(true);
    try {
      const u = await usuariosApi.me();
      setData(u);
      setUser(u);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  function openEdit() {
    setForm({ nome: data.nome, email: data.email, senha: "" });
    setError("");
    setModal(true);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = { nome: form.nome, email: form.email };
      if (form.senha) payload.senha = form.senha;
      const u = await usuariosApi.atualizarMeu(payload);
      setData(u);
      setUser(u);
      setModal(false);
      toast.success("Perfil atualizado com sucesso.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-7">
        <h1 className="page-title">Perfil</h1>
        <p className="page-subtitle">Dados da sua conta e sessão atual.</p>
      </div>

      <div className="card max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-black text-orange-600">
            {data.nome?.[0]}
          </div>
          <div>
            <h2 className="text-lg font-black">{data.nome}</h2>
            <p className="text-sm text-stone-500">{data.email}</p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">Papel</dt>
            <dd className="mt-1 font-semibold">{data.papel}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">Cadastro</dt>
            <dd className="mt-1 font-semibold">{new Date(data.criadoEm).toLocaleDateString("pt-BR")}</dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={openEdit}>Editar perfil</button>
          <button className="btn btn-secondary" onClick={load}>↻ Recarregar perfil</button>
          <button className="btn btn-danger" onClick={onLogout}>Sair</button>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-stone-900/40 p-5">
          <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-1 text-xl font-black">Editar perfil</h2>
            <p className="mb-5 text-sm text-stone-500">Atualize seus dados pessoais.</p>
            <ErrorBox message={error} />

            <label className="label">Nome *</label>
            <input className="input mb-4" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <label className="label">E-mail *</label>
            <input className="input mb-4" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label className="label">Nova senha <span className="font-normal text-stone-400">(opcional, mín. 6 caracteres)</span></label>
            <input className="input" type="password" minLength="6" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
