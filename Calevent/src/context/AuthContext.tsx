import React, { createContext, useState, useContext } from 'react';

interface User {
  city: string | null;
}

interface AuthContextType {
  user: User;
  updateUser: (data: User) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with a default city so Home doesn't start empty
  const [user, setUser] = useState<User>({ city: 'Lawrence, KS' });
  const [loading, setLoading] = useState(false); // No disk to read, so no loading

  const updateUser = async (data: User) => {
    // Just update the RAM, skip the Disk for now
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};