import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AuthenticatedLayout() {
  const { user, role, logout } = useAuth();
  // controla se o menu mobile está aberto ou fechado
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // função para saber se o link está ativo (destaca no menu)
  function isActive(path: string) {
    return location.pathname === path;
  }

  const linkClass = (path: string) =>
    `text-sm font-medium transition hover:text-blue-600 ${
      isActive(path) ? 'text-blue-600' : 'text-gray-600'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ===== NAVBAR ===== */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-lg font-bold text-blue-600 tracking-tight">
            FatoGeral
          </Link>

          {/* Links — desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass('/')}>Analisar</Link>
            <Link to="/history" className={linkClass('/history')}>Histórico</Link>
            <Link to="/trends" className={linkClass('/trends')}>Tendências</Link>
            {/* Link admin — só aparece para ADMIN */}
            {role === 'ADMIN' && (
              <Link to="/admin" className={linkClass('/admin')}>
                Admin
              </Link>
            )}
          </div>

          {/* Usuário + logout — desktop */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-gray-400">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition"
            >
              Sair
            </button>
          </div>

          {/* Botão hamburguer — mobile */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>

        {/* Menu mobile — aparece quando hamburguer é clicado */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-3 bg-white">
            <Link to="/" className={linkClass('/')} onClick={() => setMenuOpen(false)}>Analisar</Link>
            <Link to="/history" className={linkClass('/history')} onClick={() => setMenuOpen(false)}>Histórico</Link>
            <Link to="/trends" className={linkClass('/trends')} onClick={() => setMenuOpen(false)}>Tendências</Link>
            {role === 'ADMIN' && (
              <Link to="/admin" className={linkClass('/admin')} onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            <hr className="border-gray-100" />
            <span className="text-xs text-gray-400">{user?.email}</span>
            <button
              onClick={logout}
              className="text-left text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Sair
            </button>
          </div>
        )}
      </nav>

      {/* ===== CONTEÚDO DA PÁGINA ===== */}
      {/* O Outlet renderiza a página atual (Home, History, Admin...) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

    </div>
  );
}