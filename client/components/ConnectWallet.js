import { useContext } from "react";
import { WalletContext } from "../contexts";

export default function ConnectWallet({ handleConnectWallet, isConnecting }) {
  const { isWalletConnected } = useContext(WalletContext);
  return (
    <>
      {!isWalletConnected && (
        <p className="mt-3 text-2xl">
          Get started by{" "}
          <button
            className="p-3 font-mono text-lg text-white bg-blue-600 rounded-md hover:bg-blue-400 hover:shadow-lg transition duration-150"
            onClick={() => handleConnectWallet()}
          >
            {isConnecting && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            {!isConnecting && "Connecting your wallet"}
          </button>
        </p>
      )}
    </>
  );
}
