import { createContext, useEffect, useState } from "react";
import { requestChainId } from "../hooks/connectWallet";

export const ChainIdContext = createContext({});

export default function ChainIdContextProvider(props) {
  const [chainId, setChainId] = useState(4);
  useEffect(async () => {
    if (typeof window.ethereum !== undefined) {
      await requestChainId().then(res => setChainId(res))
      window.ethereum.on("chainChanged", (currentChainId) => {
        setChainId(parseInt(currentChainId));
      });
    }
  });

  return (
    <ChainIdContext.Provider value={{ chainId, setChainId }}>
      {props.children}
    </ChainIdContext.Provider>
  );
}
