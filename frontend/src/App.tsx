import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Promos } from './pages/Promos';
import { useAuth } from './auth/useAuth';
import { setAuthToken } from './api/client';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export function App() {
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();

  function logout() {
    clearToken();
    setAuthToken(null);
    navigate('/login');
  }
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/users">Users</Link>
        <Link to="/promos">Promos</Link>
        <div style={{ marginLeft: 'auto' }}>
          {token && <button onClick={logout}>Logout</button>}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/promos" element={<PrivateRoute><Promos /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </div>
  );
}


