import { useState } from "react";
import { authApi } from "../services/api";
import { ErrorBox } from "../components/Common";

export default function Cadastro({ onLogin, goLogin }) {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", papel: "MORADOR" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApi.cadastro(form);
      const login = await authApi.login(form.email, form.senha);
      localStorage.setItem("condoreservas_token", login.token);
      onLogin(login.usuario);
      void data;
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-5">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-xl md:p-10">
        <button type="button" onClick={goLogin} className="text-sm font-semibold text-stone-500">
          ← Voltar
        </button>
        <h1 className="mt-5 text-2xl font-black">Criar conta</h1>
        <p className="mt-1 mb-7 text-sm text-stone-500">
          Cadastre-se para usar as áreas comuns.
        </p>
        <ErrorBox message={error} />

        <label className="label">Nome *</label>
        <input
          className="input mb-4"
          required
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />

        <label className="label">E-mail *</label>
        <input
          className="input mb-4"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="label">
          Senha * <span className="font-normal text-stone-400">(mín. 6 caracteres)</span>
        </label>
        <input
          className="input mb-4"
          type="password"
          minLength="6"
          required
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
        />

        <label className="label">Papel *</label>
        <select
          className="input mb-7"
          value={form.papel}
          onChange={(e) => setForm({ ...form, papel: e.target.value })}
        >
          <option value="MORADOR">Morador</option>
          <option value="ZELADOR">Zelador</option>
        </select>

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
