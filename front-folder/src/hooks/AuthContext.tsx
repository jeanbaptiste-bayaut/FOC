import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

// Definition of the user type (you can adapt according to your needs)
interface User {
  userId: number;
  email: string;
  role: 'admin' | 'user' | 'editor';
}

// Definition of context types
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Default value for the context (useful for initialization)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
interface AuthProviderProps {
  children: ReactNode; // to accept children components
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.expiry > new Date().getTime()) {
          setUser(parsedData.value);
        } else {
          localStorage.removeItem('user'); // Session expired
        }
      } catch (error) {
        console.error('Failed to parse localStorage user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // function to set the user and save it in the local storage
  const login = (userData: User) => {
    setUser(userData);

    const item = {
      value: userData,
      expiry: new Date().getTime() + 7200000, // 2 hours
    };

    localStorage.setItem('user', JSON.stringify(item)); // Local storage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Delete the user from the local storage
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

// Personnalised hook to use the context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
