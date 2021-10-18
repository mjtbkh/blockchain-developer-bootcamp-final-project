import Head from "next/head";
import { useContext } from "react";
import { AccountCard } from "./index";
import { NotificationContext, ThemeContext, WalletContext } from "../contexts";

export default function Header({ title }) {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { isCardOpen, setIsCardOpen, currentWallet, isWalletConnected } =
    useContext(WalletContext);
    const { setIsNotificationOpen, setNotificationMessage} = useContext(NotificationContext)
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <AccountCard
        isOpen={isCardOpen}
        setIsOpen={setIsCardOpen}
        address={currentWallet}
      />

      <header className="flex flex-row bg-white dark:bg-indigo-700 bg-opacity-40 dark:bg-opacity-60 p-4 justify-between w-full fixed top-0 shadow-sm transition-all duration-300 z-20">
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
            <span
              className="select-none"
              onClick={() => setIsCardOpen(!isCardOpen)}
            >
              {" "}
              {currentWallet}{" "}
            </span>
          )}
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
      </header>
    </>
  );
}