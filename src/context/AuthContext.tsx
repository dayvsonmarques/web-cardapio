"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.user);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      // TODO: Implementar API call para atualizar no backend
    }
  };

  const addAddress = async (address: Omit<Address, "id">) => {
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.id}/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(address),
        });

        if (response.ok) {
          const newAddress = await response.json();
          const updatedUser = {
            ...user,
            addresses: [...user.addresses, newAddress],
          };
          setUser(updatedUser);
        }
      } catch (error) {
        console.error('Error adding address:', error);
      }
    }
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.id}/addresses/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(address),
        });

        if (response.ok) {
          const updatedAddress = await response.json();
          const updatedAddresses = user.addresses.map(addr => 
            addr.id === id ? updatedAddress : addr
          );
          setUser({ ...user, addresses: updatedAddresses });
        }
      } catch (error) {
        console.error('Error updating address:', error);
      }
    }
  };

  const deleteAddress = async (id: string) => {
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.id}/addresses/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          const updatedAddresses = user.addresses.filter(addr => addr.id !== id);
          setUser({ ...user, addresses: updatedAddresses });
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const setDefaultAddress = (id: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      setUser({ ...user, addresses: updatedAddresses });
      // TODO: Implementar API call para atualizar no backend
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        updateUser,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
