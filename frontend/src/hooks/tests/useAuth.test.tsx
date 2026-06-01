import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock do api
vi.mock('../../services/api', () => ({
  api: {
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

import { api } from '../../services/api';

// Componente auxiliar para testar o hook
function TestComponent() {
  const { isAuthenticated, user, role, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</p>
      <p data-testid="email">{user?.email ?? 'none'}</p>
      <p data-testid="role">{role ?? 'none'}</p>
      <button onClick={() => login('test@test.com', '123456')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </MemoryRouter>
  );
}

// JWT com payload { sub: 'test@test.com', role: 'USER', exp: 9999999999 }
const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.' +
  btoa(JSON.stringify({ sub: 'test@test.com', role: 'USER', exp: 9999999999 })) +
  '.signature';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shouldStartUnauthenticatedWhenNoToken', () => {
    renderWithAuth();
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('email').textContent).toBe('none');
  });

  it('shouldAuthenticateAfterLogin', async () => {
    (api.post as any).mockResolvedValue({ data: { token: fakeToken } });
    renderWithAuth();
    await act(async () => {
      screen.getByRole('button', { name: /login/i }).click();
    });
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('email').textContent).toBe('test@test.com');
  });

  it('shouldStoreTokenInLocalStorageAfterLogin', async () => {
    (api.post as any).mockResolvedValue({ data: { token: fakeToken } });
    renderWithAuth();
    await act(async () => {
      screen.getByRole('button', { name: /login/i }).click();
    });
    expect(localStorage.getItem('token')).toBe(fakeToken);
  });

  it('shouldLogoutAndClearState', async () => {
    (api.post as any).mockResolvedValue({ data: { token: fakeToken } });
    renderWithAuth();
    await act(async () => {
      screen.getByRole('button', { name: /login/i }).click();
    });
    await act(async () => {
      screen.getByRole('button', { name: /logout/i }).click();
    });
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('shouldReadRoleFromToken', async () => {
    (api.post as any).mockResolvedValue({ data: { token: fakeToken } });
    renderWithAuth();
    await act(async () => {
      screen.getByRole('button', { name: /login/i }).click();
    });
    expect(screen.getByTestId('role').textContent).toBe('USER');
  });
});