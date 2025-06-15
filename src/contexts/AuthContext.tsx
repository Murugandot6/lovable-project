
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  nickname: string;
  partnerEmail: string;
  userIcon: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("=== AUTH CONTEXT DEBUG ===");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed. User:", user ? user.email : "null");
      setCurrentUser(user);
      
      if (user) {
        console.log("User authenticated, fetching user data for UID:", user.uid);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          console.log("User document exists:", userDoc.exists());
          if (userDoc.exists()) {
            const userData = { uid: user.uid, ...userDoc.data() } as UserData;
            console.log("User data loaded:", userData);
            setUserData(userData);
          } else {
            console.log("No user document found in Firestore");
            setUserData(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        console.log("No user authenticated");
        setUserData(null);
      }
      
      console.log("Setting loading to false");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    console.log("Logging out user");
    await signOut(auth);
  };

  const value = {
    currentUser,
    userData,
    loading,
    logout
  };

  console.log("AuthContext render - loading:", loading, "currentUser:", !!currentUser, "userData:", !!userData);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
