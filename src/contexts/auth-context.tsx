import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface AuthState {
  username: string | null;
  role: string | null;
}

interface AuthContextType extends AuthState {
  login: (data: AuthState) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    username: null,
    role: null,
  });

  const login = (data: AuthState) => {
    setAuth(data);
  };

  const logout = () => {
    setAuth({ username: null, role: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        isAuthenticated: !!auth.username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};