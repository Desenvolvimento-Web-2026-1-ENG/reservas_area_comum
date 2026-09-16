import { useEffect, useState } from "react";
import { espacosApi } from "../services/api";
import { Empty, Loading, ErrorBox } from "../components/Common";

export default function Espacos({ user, onOpen, toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");
  const blank = { nome: "", descricao: "", capacidade: "", regras: "" };
  const [form, setForm] = useState(blank);

  async function load() {
    setLoading(true);
    try {
      setItems(await espacosApi.listar());
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEdit(null);
    setForm(blank);
    setError("");
    setModal(true);
  }

  function openEdit(e) {
    setEdit(e);
    setForm({ nome: e.nome, descricao: e.descricao, capacidade: e.capacidade, regras: e.regras });
    setError("");
    setModal(true);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = { ...form, capacidade: Number(form.capacidade) };
      if (edit) await espacosApi.atualizar(edit.id, data);
      else await espacosApi.criar(data);
      setModal(false);
      load();
      toast.success(edit ? "Espaço atualizado." : "Espaço cadastrado.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(id) {
    if (!confirm("Remover este espaço? Reservas vinculadas também serão removidas.")) return;
    try {
      await espacosApi.remover(id);
      load();
      toast.success("Espaço removido.");
    } catch (e) {
      toast.error(e.message);
    }
  }
  return <div>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><h1 className="page-title">Espaços comuns</h1><p className="page-subtitle">Consulte os ambientes disponíveis no condomínio.</p></div>{user.papel==="ZELADOR"&&<button className="btn btn-primary" onClick={openCreate}>+ Cadastrar espaço</button>}</div>
    {loading?<Loading/>:items.length===0?<Empty icon="🏠" text="Nenhum espaço cadastrado."/>:<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map(e=><article key={e.id} className="card flex flex-col"><div className="mb-4 flex items-start justify-between gap-3"><h2 className="text-lg font-extrabold">{e.nome}</h2><span className="badge bg-orange-100 text-orange-700">{e.capacidade} pessoas</span></div><p className="flex-1 text-sm leading-6 text-stone-600">{e.descricao}</p><div className="mt-4 rounded-xl bg-stone-50 p-3 text-xs leading-5 text-stone-500"><b className="text-stone-700">Regras:</b> {e.regras||"Sem regras adicionais."}</div><div className="mt-5 flex gap-2"><button className="btn btn-primary flex-1" onClick={()=>onOpen(e.id)}>Abrir</button>{user.papel==="ZELADOR"&&<><button className="btn btn-secondary" onClick={()=>openEdit(e)}>Editar</button><button className="btn btn-danger" onClick={()=>remove(e.id)}>Excluir</button></>}</div></article>)}</div>}
    {modal&&<div className="fixed inset-0 z-40 flex items-center justify-center bg-stone-900/40 p-5"><form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><h2 className="mb-5 text-xl font-black">{edit?"Editar espaço":"Novo espaço"}</h2><ErrorBox message={error}/>{[["nome","Nome"],["descricao","Descrição"],["capacidade","Capacidade"]].map(([k,l])=><div key={k} className="mb-4"><label className="label">{l} *</label><input className="input" required type={k==="capacidade"?"number":"text"} min={k==="capacidade"?1:undefined} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>)}<label className="label">Regras</label><textarea className="input min-h-24 resize-y" value={form.regras} onChange={e=>setForm({...form,regras:e.target.value})}/><div className="mt-6 flex justify-end gap-2"><button type="button" className="btn btn-secondary" onClick={()=>setModal(false)}>Cancelar</button><button className="btn btn-primary">{edit?"Salvar alterações":"Cadastrar"}</button></div></form></div>}
  </div>
}
