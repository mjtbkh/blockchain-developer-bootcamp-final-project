import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../contexts/WalletContext";
import { requestBalance } from "../hooks/connectWallet";
import { FixedNumber } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

export default function AccountCard() {
  const { currentWallet, isCardOpen, setIsCardOpen } =
    useContext(WalletContext);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (window.ethereum !== undefined && currentWallet) handleFetch();
  }, [isCardOpen]);

  const handleFetch = async () => {
    await requestBalance().then((res) =>
      setBalance(Number(FixedNumber.fromValue(res, 18)).toFixed(4))
    );
  };

  const handleCloseProvider = async () => {
    localStorage.removeItem('connectedWallet');
    window.location.reload()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentWallet);
  };

  return (
    <>
      {isCardOpen && (
        <dialog
          // onClick={() => setIsCardOpen(false)}
          className="flex flex-row justify-between top-1/3 ring-2 ring-gray-300 dark:ring-gray-600 bg-gray-200 border z-20 text-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:border-0 text-center p-0 rounded-md shadow-lg"
        >
          <section className="shadow-inner px-4 py-6 align-middle justify-center">
            ETH
          </section>
          <section className="flex flex-col gap-4 px-4 py-6 bg-white dark:bg-gray-700 dark:text-white align-middle justify-center rounded-md">
            <span
              onClick={copyToClipboard}
              className="flex cursor-pointer items-center bg-gray-200 shadow-inner rounded-sm p-2 dark:bg-gray-500"
            >
              Wallet:&nbsp;{" "}
              <b className="text-blue-500 dark:text-blue-200 px-2">
                {currentWallet}
              </b>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </span>
            <span>
              You have{" "}
              <b className="text-blue-500 dark:text-blue-200 inline-flex items-center bg-gray-200 shadow-inner rounded-sm p-2 dark:bg-gray-500">
                {balance && balance}
                {!balance && (
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
              </b>{" "}
              ETH balance
            </span>
            <button className="bg-red-500 shadow-inner rounded-md text-white w-1/2 mx-auto py-2" onClick={handleCloseProvider}>Disconnect</button>
          </section>
        </dialog>
      )}
    </>
  );
}
