import { useEffect, useState } from 'react';

const TOKEN_KEY = 'admin_token';

export function useAuth() {
  const initialToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const [token, setToken] = useState<string | null>(initialToken);

  function saveToken(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  return { token, saveToken, clearToken };
}


