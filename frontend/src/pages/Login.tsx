import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Spinner } from '../components/Spinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  function validate(): boolean {
    let valid = true;
    if (!email) {
      setEmailError('E-mail é obrigatório');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Formato de e-mail inválido');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('Senha é obrigatória');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('E-mail ou senha inválidos.');
      } else {
        toast.error('Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Entrar</h1>
        <p className="text-sm text-gray-500 mb-6">Acesse sua conta no FatoGeral</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="text"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition mt-2"
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}