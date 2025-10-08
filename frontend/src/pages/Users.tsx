import { useEffect, useState } from 'react';
import { api } from '../api/client';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  member_id: string;
  status: string;
};

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (_e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id: number) {
    await api.post(`/users/${id}/approve`);
    load();
  }
  async function suspend(id: number) {
    await api.post(`/users/${id}/suspend`);
    load();
  }
  async function applyPromo(id: number, discountPercent: number) {
    await api.post(`/users/${id}/apply-promo`, { discountPercent });
    load();
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <table cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Member ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.member_id}</td>
              <td>{u.status}</td>
              <td>
                <button onClick={() => approve(u.id)}>Approve</button>{' '}
                <button onClick={() => suspend(u.id)}>Suspend</button>{' '}
                <button onClick={() => applyPromo(u.id, 100)}>Youth Free</button>{' '}
                <button onClick={() => applyPromo(u.id, 50)}>50% Off</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


