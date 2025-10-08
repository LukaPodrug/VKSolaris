import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Promos } from './pages/Promos';
import { useAuth } from './auth/useAuth';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/users">Users</Link>
        <Link to="/promos">Promos</Link>
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


