import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface LoggedInEntity {
  id: string;
  name: string;
  location?: string;
  role: string;
  loggedIn: boolean;
}

interface LoggedInEntityContextValue {
  entity: LoggedInEntity | null;
  setEntity: (entity: LoggedInEntity | null) => void;
}

const LoggedInEntityContext = createContext<
  LoggedInEntityContextValue | undefined
>(undefined);

interface LoggedInEntityProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = "nirmaya-entity";

export const LoggedInEntityProvider: React.FC<LoggedInEntityProviderProps> = ({
  children,
}) => {
  const [entity, _setEntity] = useState<LoggedInEntity | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          _setEntity(parsed);
        }
      } catch (err) {
        console.error("Failed to parse entity from localStorage:", err);
      }
    }
  }, []);

  const setEntity = (newEntity: LoggedInEntity | null) => {
    _setEntity(newEntity);

    if (newEntity === null) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEntity));
    }
  };

  return (
    <LoggedInEntityContext.Provider value={{ entity, setEntity }}>
      {children}
    </LoggedInEntityContext.Provider>
  );
};

export const useLoggedInEntity = (): LoggedInEntityContextValue => {
  const context = useContext(LoggedInEntityContext);
  if (!context) {
    throw new Error(
      "useLoggedInEntity must be used within a LoggedInEntityProvider"
    );
  }
  return context;
};
