import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Promos } from './pages/Promos';
import { useAuth } from './auth/useAuth';
import { setAuthToken } from './api/client';
import { AppBar, Toolbar, Button, Container } from '@mui/material';

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
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/users">Users</Button>
          <Button color="inherit" component={Link} to="/promos">Promos</Button>
          <div style={{ marginLeft: 'auto' }}>
            {token && <Button color="inherit" onClick={logout}>Logout</Button>}
          </div>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path="/promos" element={<PrivateRoute><Promos /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </Container>
    </div>
  );
}


