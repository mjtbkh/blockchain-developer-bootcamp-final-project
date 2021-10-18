import { useContext, useEffect, useState } from "react";
import {
  requestAccount,
  requestChainId,
  initProvider,
} from "../hooks/connectWallet";
import { Cast, Footer, Header, Notification } from "../components";
import {
  ChainIdContext,
  NotificationContext,
  ThemeContext,
  WalletContext,
} from "../contexts";
import detectEthereumProvider from "@metamask/detect-provider";
import ConnectWallet from "../components/ConnectWallet";

export default function Home() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { currentWallet ,setCurrentWallet, isCardOpen, setIsCardOpen, setIsWalletConnected } =
    useContext(WalletContext);
  const { setIsNotificationOpen, notificationMessage, setNotificationMessage } =
    useContext(NotificationContext);
  const { chainId, setChainId } = useContext(ChainIdContext);
  const fetchProvider = async () => {
    return await detectEthereumProvider();
  };

  useEffect(() => {
    if (localStorage.getItem("connectedWallet") && chainId !== 4) {
      setNotificationMessage("Please switch your MetaMask to rinkeby network!");
      setIsNotificationOpen(true);
    }
  }, [chainId]);

  useEffect(async () => {
    if (
      typeof localStorage !== undefined &&
      localStorage.getItem("connectedWallet") &&
      window.ethereum === (await fetchProvider()) &&
      window.ethereum.isConnected()
    ) {
      setCurrentWallet(localStorage.getItem("connectedWallet"));
      setIsWalletConnected(true);
    } else {
      localStorage.removeItem("connectedWallet");
    }

    if (typeof window !== undefined && localStorage.getItem("isDarkMode")) {
      setIsDarkMode(Boolean(Number(localStorage.getItem("isDarkMode"))));
    }
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    if (typeof window.ethereum === undefined || !window.ethereum.isMetaMask) {
      console.log(typeof window.ethereum);
      setNotificationMessage(
        "MetaMask not detected! install from: https://metamask.io/"
      );
      setIsNotificationOpen(true);
      setIsConnecting(false);
      return 0;
    }
    try {
      await requestAccount().then(async () => {
        await initProvider().then(async (address) => {
          setCurrentWallet(address);
          setIsWalletConnected(true);
          localStorage.setItem("connectedWallet", address);
          setIsConnecting(false);

          await requestChainId().then((chainId) => {
            if (chainId !== 4) {
              setNotificationMessage(
                "Please switch your MetaMask to rinkeby network!"
              );
              setIsNotificationOpen(true);
              setChainId(chainId);
            }
          });
        });
      });
    }
    catch(e) {
      console.log(`error cached: ${e}`)
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-full min-h-screen ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <Header setIsNotificationOpen={setIsNotificationOpen} title="EthRadio" />

      <main
        className={`dark:bg-gray-700 dark:text-white flex flex-col items-center justify-center w-full flex-1 px-20 py-32 text-center transition-all duration-300 z-10 ${
          isCardOpen ? "blur-md" : ""
        }`}
        onClick={() => {
          if (isCardOpen) setIsCardOpen(false);
        }}
      >
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a
            className="text-blue-600 dark:text-blue-200"
            href="https://nextjs.org"
          >
            EthRadio!
          </a>
        </h1>

        <ConnectWallet
          handleConnectWallet={handleConnectWallet}
          isConnecting={isConnecting}
        />

        <h2 className="text-2xl font-black text-left mt-10">Episodes</h2>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Cast
            link="https://nextjs.org/docs"
            title="Documentation"
            desc="Find in-depth information about Next.js features and API."
          />

          <Cast
            link="https://nextjs.org/learn"
            title="Learn"
            desc="Learn about Next.js in an interactive course with quizzes!"
          />

          <Cast
            link="https://github.com/vercel/next.js/tree/master/example"
            title="Examples"
            desc="Discover and deploy boilerplate example Next.js projects."
          />

          <Cast
            link="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            title="Deploy"
            desc="Instantly deploy your Next.js site to a public URL with Vercel."
          />
        </div>
      </main>

      <Footer />
      <Notification
        setIsNotificationOpen={setIsNotificationOpen}
        message={notificationMessage}
        setNotificationMessage={setNotificationMessage}
      />
    </div>
  );
}
