import { useState } from 'react';
import { verifyAdminPassword } from '@/lib/api';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const isValid = await verifyAdminPassword(password);
      
      if (isValid) {
        setIsAuthenticated(true);
        setAdminPassword(password);
        setError('');
      } else {
        setError('비밀번호가 올바르지 않습니다');
        setPassword('');
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setAdminPassword('');
    setError('');
  };

  return {
    isAuthenticated,
    password,
    adminPassword,
    error,
    isLoading,
    setPassword,
    login,
    logout,
  };
}

