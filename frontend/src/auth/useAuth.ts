import { useEffect, useState } from 'react';

const TOKEN_KEY = 'admin_token';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

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


