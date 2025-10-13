import { FormEvent, useState } from 'react';
import { api, setAuthToken } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

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
      navigate('/users', { replace: true });
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Admin Login</Typography>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Typography color="error" variant="body2">{error}</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>Login</Button>
      </Paper>
    </Box>
  );
}


