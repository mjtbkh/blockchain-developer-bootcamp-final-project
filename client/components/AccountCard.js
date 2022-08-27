import { useContext, useEffect, useState } from "react";
import ConnectContract from "../hooks/connectContract";
import { WalletContext, NotificationContext } from "../contexts";
import { requestBalance, requestAccount } from "../hooks/connectWallet";
import { ethers, FixedNumber } from "ethers";

export default function AccountCard() {
  const { currentWallet, isCardOpen, setIsCardOpen } =
    useContext(WalletContext);
  const { setIsNotificationOpen, notificationMessage, setNotificationMessage } =
    useContext(NotificationContext);
  const [walletBalance, setWalletBalance] = useState("");
  const [userBalance, setUserBalance] = useState("");
  const [amountToDeposit, setAmountToDeposit] = useState("");

  useEffect(async () => {
    if (window.ethereum !== "undefined" && currentWallet) {
      await requestAccount().then(() => {
        getWalletBalance();
        getUserBalance();
      });
    }
  }, [isCardOpen]);

  // get user balance held in the connected wallet
  const getWalletBalance = async () => {
    await requestBalance().then((res) =>
      setWalletBalance(
        Number(FixedNumber.fromValue(res, 18)).toFixed(4).toString()
      )
    );
  };

  // get user balance deposited to the contract
  const getUserBalance = async () => {
    await ConnectContract.connect().then(
      await ConnectContract.hasRole("SUBSCRIBER_ROLE").then(async (res) => {
        if (res)
          await ConnectContract.getBalance().then((balance) =>
            setUserBalance(ethers.utils.formatEther(balance))
          );
        else setUserBalance("0");
      })
    );
  };

  // handle ETH deposition to contract from subscribers
  const handleEthDeposit = async () => {
    await ConnectContract.connect().then(
      await ConnectContract.hasRole("SUBSCRIBER_ROLE").then(async (res) => {
        if (res) await ConnectContract.depositToEthRadio(amountToDeposit);
        else {
          setNotificationMessage("ETH deposit failed...");
          setIsNotificationOpen(true);
        }
      })
    );
  };

  // clean-up unnecessary data after wallet is disconnected and reload the page
  const handleCloseProvider = async () => {
    localStorage.removeItem("connectedWallet");
    window.location.reload();
  };

  // copy current wallet address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentWallet);
  };

  return (
    <>
      {isCardOpen && (
        <dialog className="flex flex-row justify-between top-1/3 ring-2 ring-gray-300 dark:ring-gray-600 bg-gray-200 border z-20 text-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:border-0 text-center p-0 rounded-md shadow-lg">
          <section className="shadow-inner px-4 py-6 align-middle flex flex-col gap-4 justify-around">
            <span className="flex gap-1 text-gray-400 dark:text-gray-500 font-bold items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Your account
            </span>

            <span className="flex gap-1 text-gray-400 dark:text-gray-500 font-bold items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 cursor-pointer text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => setIsCardOpen(!isCardOpen)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              Close
            </span>

            <span className="flex gap-1 text-gray-400 dark:text-gray-500 font-bold items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 cursor-pointer text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={handleCloseProvider}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Disconnect
            </span>
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
                {walletBalance && walletBalance}
                {!walletBalance && (
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
              ETH balance in your wallet
            </span>
            <span>
              You have{" "}
              <b className="text-blue-500 dark:text-blue-200 inline-flex items-center bg-gray-200 shadow-inner rounded-sm p-2 dark:bg-gray-500">
                {userBalance && userBalance}
                {!userBalance && (
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
              ETH balance in EthRadio
            </span>
            <section className="flex flex-row gap-1 justify-between items-center bg-gray-200 dark:bg-gray-800 rounded-md p-2 shadow-md ring-1 ring-gray-200 dark:ring-gray-900">
              <span>Deposit to EthRadio</span>
              <input
                type="text"
                placeholder="ΞETH to deposit"
                className="p-1 ring-1 ring-gray-300 dark:bg-gray-200 dark:text-gray-800 rounded-sm h-8 focus:border-0"
                onChange={(e) => setAmountToDeposit(String(e.target.value))}
              />
              <button
                className="bg-blue-500 text-white rounded-md py-1 px-2 h-8"
                onClick={handleEthDeposit}
              >
                Deposit
              </button>
            </section>
          </section>
        </dialog>
      )}
    </>
  );
}
