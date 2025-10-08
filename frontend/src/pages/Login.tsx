import { FormEvent, useState } from 'react';
import { api, setAuthToken } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveToken(data.token);
      setAuthToken(data.token);
      navigate('/users');
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: '40px auto', display: 'grid', gap: 12 }}>
      <h2>Admin Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}


