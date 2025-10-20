// providers/ModalProvider.tsx
import { createContext, useContext, useState } from "react";

interface ModalContextProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  element?: React.ReactNode;
  setElement: (element: React.ReactNode) => void;
  position: "center" | "start" | "end";
  setPosition: (pos: "center" | "start" | "end") => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [element, setElement] = useState<React.ReactNode>(null);
  const [position, setPosition] = useState<"center" | "start" | "end">(
    "center"
  );

  return (
    <ModalContext.Provider
      value={{
        modalVisible,
        setModalVisible,
        element,
        setElement,
        position,
        setPosition,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
