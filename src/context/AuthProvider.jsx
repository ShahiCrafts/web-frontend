import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // <-- NEW: Add token to state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // <-- Renamed for clarity
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) { // Use storedToken here
      setUser(JSON.parse(storedUser));
      setToken(storedToken); // <-- NEW: Set token state from localStorage
      setIsAuthenticated(true);
    } else {
      signOut(); // If token or user is missing, ensure signed out state
    }
    setLoading(false);
  }, []);

  const signIn = async (userData, newToken) => { // <-- Renamed parameter for clarity
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", newToken); // <-- Use newToken here
    setUser(userData);
    setToken(newToken); // <-- NEW: Update token state on sign-in
    setIsAuthenticated(true);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null); // <-- NEW: Clear token state on sign-out
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // <-- NEW: Expose token through context
        isAuthenticated,
        loading,
        signIn,
        signOut,
        // Removed `useAuth` from value - you usually don't pass the hook itself
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;