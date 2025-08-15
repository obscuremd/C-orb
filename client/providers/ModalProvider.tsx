import { createContext, useContext, useState } from "react";

interface props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  element?: React.ReactNode;
  setElement: (element: React.ReactNode) => void;
}

const ModalContext = createContext<props | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [element, setElement] = useState<React.ReactNode>(null);
  return (
    <ModalContext.Provider
      value={{ modalVisible, setModalVisible, setElement, element }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useGeneralContext must be used within a GeneralProvider");
  }
  return context;
};
