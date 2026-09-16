import { useEffect, useState } from "react";
import { espacosApi, reservasApi } from "../services/api";
import { Loading, Empty, Status, ErrorBox, formatDate } from "../components/Common";

export default function EspacoDetalhe({ id, user, onBack, toast }) {
  const [espaco, setEspaco] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({ data: "", horaInicio: "", horaFim: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [e, r] = await Promise.all([espacosApi.buscar(id), reservasApi.porEspaco(id)]);
      setEspaco(e);
      setReservas(r.itens || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function disponibilidade() {
    try {
      const r = await reservasApi.disponibilidade(id, data);
      setReservas(r.reservas || []);
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await reservasApi.criar(id, form);
      setForm({ data: "", horaInicio: "", horaFim: "" });
      toast.success("Reserva solicitada com sucesso.");
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;
  if (!espaco) return <Empty text="Espaço não encontrado." />;
  return <div><button className="mb-5 text-sm font-semibold text-orange-600" onClick={onBack}>← Voltar para espaços</button><div className="mb-7"><h1 className="page-title">{espaco.nome}</h1><p className="page-subtitle">{espaco.descricao}</p></div>
    <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="space-y-5"><div className="card"><div className="flex flex-wrap gap-3"><span className="badge bg-orange-100 text-orange-700">Capacidade: {espaco.capacidade}</span><span className="badge bg-stone-100 text-stone-600">Regras de uso</span></div><p className="mt-4 text-sm leading-6 text-stone-600">{espaco.regras||"Sem regras adicionais."}</p></div>
    <div className="card"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-extrabold">Disponibilidade</h2><p className="text-xs text-stone-400">Consulte as reservas ativas do dia.</p></div><div className="flex gap-2"><input className="input w-auto" type="date" value={data} onChange={e=>setData(e.target.value)}/><button className="btn btn-secondary" onClick={disponibilidade}>Consultar</button></div></div>{reservas.length===0?<Empty text="Nenhuma reserva ativa encontrada."/>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-stone-400"><tr><th className="pb-3">Data</th><th>Horário</th><th>Status</th></tr></thead><tbody className="divide-y divide-stone-100">{reservas.map(r=><tr key={r.id}><td className="py-3">{formatDate(r.data)}</td><td>{r.horaInicio}–{r.horaFim}</td><td><Status status={r.status}/></td></tr>)}</tbody></table></div>}</div></div>
    {user.papel==="MORADOR"&&<div className="card h-fit"><h2 className="text-lg font-extrabold">Nova reserva</h2><p className="mb-5 mt-1 text-xs text-stone-500">Solicite com pelo menos 3 horas de antecedência.</p><ErrorBox message={error}/><form onSubmit={submit}><label className="label">Data *</label><input className="input mb-4" type="date" required value={form.data} onChange={e=>setForm({...form,data:e.target.value})}/><div className="grid grid-cols-2 gap-3"><div><label className="label">Início *</label><input className="input" type="time" required value={form.horaInicio} onChange={e=>setForm({...form,horaInicio:e.target.value})}/></div><div><label className="label">Fim *</label><input className="input" type="time" required value={form.horaFim} onChange={e=>setForm({...form,horaFim:e.target.value})}/></div></div><button className="btn btn-primary mt-5 w-full" disabled={saving}>{saving?"Solicitando...":"Solicitar reserva"}</button></form></div>}</div>
  </div>
}
