import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { ProtectedRoute, AdminRoute } from '../../components/ProtectedRoute';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../contexts/AuthContext';

function renderWithAuth(ui: React.ReactNode, { isAuthenticated = false, role = 'USER' } = {}) {
  (useAuth as any).mockReturnValue({ isAuthenticated, role, user: null, token: null, login: vi.fn(), logout: vi.fn() });
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route element={ui}>
          <Route path="/protected" element={<div>Protected Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('shouldRedirectToLoginWhenUserIsNotAuthenticated', () => {
    renderWithAuth(<ProtectedRoute />, { isAuthenticated: false });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('shouldRenderPageWhenUserIsAuthenticated', () => {
    renderWithAuth(<ProtectedRoute />, { isAuthenticated: true });
    expect(screen.getByText('Protected Page')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  it('shouldRedirectToHomeWhenUserIsNotAdmin', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true, role: 'USER', user: null, token: null, login: vi.fn(), logout: vi.fn() });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('shouldRenderAdminPageWhenUserHasAdminRole', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true, role: 'ADMIN', user: null, token: null, login: vi.fn(), logout: vi.fn() });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });
});
