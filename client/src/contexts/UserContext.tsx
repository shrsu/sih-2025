import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface UserContextType {
  loggedIn: boolean;
  name: string;
  email: string;
  role: string;
}

interface UserContextValue {
  user: UserContextType;
  setUser: (user: UserContextType) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = "nirmaya-user";

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, _setUser] = useState<UserContextType>({
    loggedIn: false,
    name: "",
    email: "",
    role: "",
  });

  // Load user from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          _setUser(parsed);
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

  // Wrap setUser to persist only when explicitly called
  const setUser = (newUser: UserContextType) => {
    _setUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
