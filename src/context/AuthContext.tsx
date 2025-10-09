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

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
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

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login - em produção, fazer chamada à API
    // Por enquanto, vamos aceitar qualquer combinação e criar um usuário de teste
    
    // Buscar usuários do localStorage (simulação de banco de dados)
    const usersData = localStorage.getItem("users");
    const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
    
    const foundUser = users.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Buscar usuários existentes
      const usersData = localStorage.getItem("users");
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
      
      // Verificar se o email já existe
      if (users.some((u) => u.email === data.email)) {
        return false;
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password, // Em produção, deve ser hasheado
        addresses: [],
      };
      
      // Adicionar aos usuários
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Fazer login automaticamente
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Atualizar também no "banco de dados" simulado
      const usersData = localStorage.getItem("users");
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data };
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
  };

  const addAddress = (address: Omit<Address, "id">) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: Date.now().toString(),
      };
      
      const updatedAddresses = [...user.addresses, newAddress];
      updateUser({ addresses: updatedAddresses });
    }
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    if (user) {
      const updatedAddresses = user.addresses.map((addr) =>
        addr.id === id ? { ...addr, ...addressData } : addr
      );
      updateUser({ addresses: updatedAddresses });
    }
  };

  const deleteAddress = (id: string) => {
    if (user) {
      const updatedAddresses = user.addresses.filter((addr) => addr.id !== id);
      updateUser({ addresses: updatedAddresses });
    }
  };

  const setDefaultAddress = (id: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      updateUser({ addresses: updatedAddresses });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        updateUser,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
