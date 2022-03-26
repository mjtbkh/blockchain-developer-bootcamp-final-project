import { useState, createContext } from "react";

export const WalletContext = createContext({});

export default function WalletContextProvider(props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [currentWallet, setCurrentWallet] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  return (
    <WalletContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        isPublisher,
        setIsPublisher,
        isSubscriber, setIsSubscriber,
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
