import { useState } from "react";
import { authApi } from "../services/api";
import { ErrorBox } from "../components/Common";

export default function Login({ onLogin, goCadastro }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login(form.email, form.senha);
      localStorage.setItem("condoreservas_token", data.token);
      onLogin(data.usuario);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-5">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden bg-orange-500 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="text-2xl font-black">CondoReservas</div>
            <p className="mt-4 max-w-sm text-orange-50">
              Reserve espaços comuns do condomínio de forma simples, transparente e organizada.
            </p>
          </div>
          <div className="text-sm text-orange-100">Moradores solicitam. Zeladores administram.</div>
        </div>

        <form onSubmit={submit} className="p-7 md:p-10">
          <div className="mb-8">
            <div className="text-sm font-bold text-orange-500 md:hidden">CONDORRESERVAS</div>
            <h1 className="mt-2 text-2xl font-black">Entrar</h1>
            <p className="mt-1 text-sm text-stone-500">Acesse sua conta para continuar.</p>
          </div>
          <ErrorBox message={error} />

          <label className="label">E-mail</label>
          <input
            className="input mb-4"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="voce@email.com"
          />

          <label className="label">Senha</label>
          <input
            className="input mb-6"
            type="password"
            required
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            placeholder="••••••••"
          />

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <button type="button" onClick={goCadastro} className="mt-4 w-full text-sm font-semibold text-orange-600 hover:text-orange-700">
            Criar uma conta
          </button>
          <div className="mt-7 rounded-xl bg-stone-50 p-3 text-xs text-stone-500">
            Demo: <b>morador@condominio.com</b> ou <b>zelador@condominio.com</b> · senha <b>senha123</b>
          </div>
        </form>
      </div>
    </div>
  );
}
