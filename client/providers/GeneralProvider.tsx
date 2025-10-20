import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface LoginState {
  email: string;
  password: string;
}

interface GeneralProps {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  userLoginState: LoginState;
  setUserLoginState: Dispatch<SetStateAction<LoginState>>;
}

const GeneralContext = createContext<GeneralProps | undefined>(undefined);

export function GeneralProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userLoginState, setUserLoginState] = useState({
    email: "",
    password: "",
  });
  return (
    <GeneralContext.Provider
      value={{ user, setUser, userLoginState, setUserLoginState }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

export const useGen = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("useGen must be used within a GeneralProvider");
  }
  return context;
};
