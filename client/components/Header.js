import Head from "next/head";
import { useContext, useEffect } from "react";
import { AccountCard, PublishForm, PublishersForm } from "./index";
import {
  NotificationContext,
  ThemeContext,
  WalletContext,
  FormContext,
  PublisherContext,
} from "../contexts";
import ConnectContract from "../hooks/connectContract";
import { requestChainId } from "../hooks/connectWallet";
import detectEthereumProvider from "@metamask/detect-provider";

export default function Header({ title }) {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const {
    isAdmin,
    setIsAdmin,
    isPublisher,
    setIsPublisher,
    isSubscriber,
    setIsSubscriber,
    isCardOpen,
    setIsCardOpen,
    currentWallet,
    isWalletConnected,
  } = useContext(WalletContext);
  const { setIsNotificationOpen, setNotificationMessage } =
    useContext(NotificationContext);
  const { isFormOpen, setIsFormOpen } = useContext(FormContext);
  const { isPublishersOpen, setIsPublishersOpen } =
    useContext(PublisherContext);

  // check if connected wallet has an admin role defined inside the contract instance
  const hasAdminRole = async () => {
    if (
      typeof window.ethereum !== "undefined" &&
      localStorage.getItem("connectedWallet")
    ) {
      await ConnectContract.connect().then(
        await ConnectContract.hasRole("DEFAULT_ADMIN_ROLE").then((res) =>
          setIsAdmin(res)
        )
      );
    }
  };

  // check if connected wallet has a publisher role defined inside the contract instance
  const hasPublisherRole = async () => {
    if (
      typeof window.ethereum !== "undefined" &&
      localStorage.getItem("connectedWallet")
    ) {
      await ConnectContract.connect().then(
        await ConnectContract.hasRole("PUBLISHER_ROLE").then((res) =>
          setIsPublisher(res)
        )
      );
    }
  };

  // check if connected wallet has a sunscriber role defined inside the contract instance
  const hasSubscriberRole = async () => {
    if (
      window.ethereum !== "undefined" &&
      localStorage.getItem("connectedWallet")
    ) {
      await ConnectContract.connect().then(
        await ConnectContract.hasRole("SUBSCRIBER_ROLE").then((res) =>
          setIsSubscriber(res)
        )
      );
    }
  };

  // call the subscription function from contract instance
  const handleSubscription = async () => {
    if (
      typeof window.ethereum !== "undefined" &&
      localStorage.getItem("connectedWallet")
    ) {
      await ConnectContract.connect().then(
        await ConnectContract.subscribeToPodcast().then((res) =>
          setIsSubscriber(res)
        )
      );
    }
  };

  // force update DOM after user subscription is successful
  useEffect(() => {}, [isSubscriber]);

  // get user roles once the wallet is connected
  useEffect(async () => {
    if (window.ethereum !== "undefined" && isWalletConnected) {
      await detectEthereumProvider().then(
        async (provider) => {
          if (provider.isConnected()) {
            hasAdminRole();
            hasPublisherRole();
            hasSubscriberRole();
          }
        }
      );
    }
  }, [isWalletConnected]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {currentWallet && (
        <AccountCard isOpen={isCardOpen} address={currentWallet} />
      )}

      {currentWallet && (
        <PublishForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} />
      )}

      {currentWallet && (
        <PublishersForm
          isOpen={isPublishersOpen}
          setIsOpen={setIsPublishersOpen}
        />
      )}

      <header className="flex flex-row bg-white dark:bg-indigo-700 bg-opacity-40 dark:bg-opacity-60 p-4 justify-between w-full fixed top-0 shadow-sm transition-all duration-300 z-20">
        <section className="flex flex-row gap-4">
          <section className="flex justify-between items-center overflow-hidden gap-2 pr-2 bg-gray-800 text-white rounded-md cursor-pointer">
            <span className="bg-gray-700 text-white p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
            </span>
            {!isWalletConnected && (
              <span
                className="p-1"
                onClick={() => {
                  setNotificationMessage("Connect to MetaMask first!");
                  setIsNotificationOpen(true);
                }}
              >
                Wallet not connected
              </span>
            )}
            {isWalletConnected && (
              <>
                <span
                  className="select-none"
                  onClick={() => {
                    if (isFormOpen) setIsFormOpen(false);
                    if (isPublishersOpen) setIsPublishersOpen(false);
                    setIsCardOpen(!isCardOpen);
                  }}
                >
                  {` ${currentWallet.substring(
                    0,
                    4
                  )}...${currentWallet.substring(38)} `}
                </span>
              </>
            )}
          </section>

          {isWalletConnected && isPublisher && (
            <section className="flex items-center overflow-hidden gap-2 pr-2 bg-gray-800 text-white rounded-md cursor-pointer">
              <span className="bg-gray-700 text-white p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </span>
              <button
                onClick={() => {
                  if (isCardOpen) setIsCardOpen(false);
                  if (isPublishersOpen) setIsPublishersOpen(false);
                  setIsFormOpen(!isFormOpen);
                }}
              >
                Publish episode
              </button>
            </section>
          )}
          {isWalletConnected && isAdmin && (
            <section className="flex items-center overflow-hidden gap-2 pr-2 bg-gray-800 text-white rounded-md cursor-pointer">
              <span className="bg-gray-700 text-white p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </span>
              <button
                onClick={() => {
                  if (isCardOpen) setIsCardOpen(false);
                  if (isFormOpen) setIsFormOpen(false);
                  setIsPublishersOpen(!isPublishersOpen);
                }}
              >
                Publishers
              </button>
            </section>
          )}
        </section>

        <section className="flex flex-row gap-4">
          <section
            className={`flex flex-row items-center overflow-hidden gap-2 pr-2 bg-green-500 text-white rounded-md cursor-pointer ${
              isSubscriber || isAdmin ? "grayscale" : ""
            }`}
          >
            <span className="bg-green-600 text-white p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            {!isSubscriber && !isAdmin && (
              <button onClick={handleSubscription}>
                Subscribe
              </button>
            )}
            {isSubscriber && <button disabled={true}>Subscribed!</button>}
            {!isSubscriber && isAdmin && <button disabled className="cursor-not-allowed">You're admin</button>}
          </section>

          <section
            className="bg-gray-800 text-white rounded-full p-1 cursor-pointer"
            onClick={() => {
              localStorage.setItem("isDarkMode", isDarkMode ? 0 : 1);
              setIsDarkMode(!isDarkMode);
            }}
          >
            {!isDarkMode && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
            {isDarkMode && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </section>
        </section>
      </header>
    </>
  );
}
