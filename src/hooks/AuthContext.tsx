import React, { createContext, useContext, useState, ReactNode } from 'react';

// Définition du type utilisateur (vous pouvez adapter selon vos besoins)
interface User {
  userId: number;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

// Définition des types du contexte
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Valeur par défaut du contexte (utile pour l'initialisation)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fournisseur du contexte
interface AuthProviderProps {
  children: ReactNode; // Pour accepter des enfants dans le fournisseur
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);

    const item = {
      value: userData,
      expiry: new Date().getTime() + 7200000, // 2 heure
    };

    localStorage.setItem('user', JSON.stringify(item)); // Sauvegarde locale optionnelle
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Supprime les données locales
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
