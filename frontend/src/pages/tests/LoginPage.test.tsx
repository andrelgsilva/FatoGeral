import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Login from '../Login';

// Mock do AuthContext
const mockLogin = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

// Método auxiliar para evitar repetição
function renderLoginPage() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login Page', () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it('shouldRenderLoginForm — renderiza campos de e-mail, senha e botão', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('shouldShowErrorWhenFieldsAreEmpty — exibe erros ao submeter sem preencher', async () => {
    renderLoginPage();
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
  });

  it('shouldShowEmailFormatError — exibe erro para e-mail inválido', async () => {
  renderLoginPage();
  await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'emailinvalido');
  await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
  expect(screen.getByText(/formato de e-mail inválido/i)).toBeInTheDocument();
  });

  it('shouldCallLoginWhenFormIsValid — chama login com dados corretos', async () => {
    mockLogin.mockResolvedValue(undefined);
    renderLoginPage();
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
    await userEvent.type(screen.getByLabelText(/senha/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(mockLogin).toHaveBeenCalledWith('user@test.com', '123456');
  });

  it('shouldShowErrorToastWhenCredentialsAreInvalid — 401 exibe toast de erro', async () => {
    const toast = await import('react-hot-toast');
    mockLogin.mockRejectedValue({ response: { status: 401 } });
    renderLoginPage();
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'senhaerrada');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(toast.default.error).toHaveBeenCalledWith('E-mail ou senha inválidos.');
  });
});