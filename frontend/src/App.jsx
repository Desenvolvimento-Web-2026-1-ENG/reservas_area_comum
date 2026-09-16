import { useEffect, useState } from "react";
import { usuariosApi } from "./services/api";
import { useToast, ToastContainer } from "./hooks/useToast";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Espacos from "./pages/Espacos";
import EspacoDetalhe from "./pages/EspacoDetalhe";
import MinhasReservas from "./pages/MinhasReservas";
import Aprovacoes from "./pages/Aprovacoes";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";

export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [page, setPage] = useState("espacos");
  const [selected, setSelected] = useState(null);
  const [booting, setBooting] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("condoreservas_token")) {
        try {
          setUser(await usuariosApi.me());
        } catch {
          localStorage.removeItem("condoreservas_token");
        }
      }

      setBooting(false);
    })();
  }, []);

  function logout() {
    localStorage.removeItem("condoreservas_token");
    setUser(null);
    setPage("espacos");
  }

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-stone-500">
        Carregando CondoReservas...
      </div>
    );
  }

  if (!user) {
    return authPage === "login" ? (
      <Login
        onLogin={setUser}
        goCadastro={() => setAuthPage("cadastro")}
      />
    ) : (
      <Cadastro
        onLogin={setUser}
        goLogin={() => setAuthPage("login")}
      />
    );
  }

  let content;

  if (page === "detalhe" && selected) {
    content = (
      <EspacoDetalhe
        id={selected}
        user={user}
        onBack={() => {
          setSelected(null);
          setPage("espacos");
        }}
        toast={toast}
      />
    );
  } else if (page === "espacos") {
    content = (
      <Espacos
        user={user}
        onOpen={(id) => {
          setSelected(id);
          setPage("detalhe");
        }}
        toast={toast}
      />
    );
  } else if (page === "minhas") {
    content = <MinhasReservas toast={toast} />;
  } else if (page === "aprovacoes") {
    content = <Aprovacoes toast={toast} />;
  } else if (page === "usuarios") {
    content = <Usuarios toast={toast} />;
  } else {
    content = (
      <Perfil
        user={user}
        setUser={setUser}
        toast={toast}
        onLogout={logout}
      />
    );
  }

  return (
    <>
      <Layout
        user={user}
        page={page}
        setPage={setPage}
        onLogout={logout}
      >
        {content}
      </Layout>
      <ToastContainer toasts={toast.toasts} />
    </>
  );
}
