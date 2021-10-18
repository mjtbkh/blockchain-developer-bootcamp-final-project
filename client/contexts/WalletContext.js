import { useState, createContext } from "react";

export const WalletContext = createContext({});

export default function WalletContextProvider(props) {
  const [currentWallet, setCurrentWallet] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <WalletContext.Provider
      value={{
        isCardOpen,
        setIsCardOpen,
        currentWallet,
        setCurrentWallet,
        isWalletConnected,
        setIsWalletConnected,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}
