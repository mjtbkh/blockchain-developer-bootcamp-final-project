import { useContext, useEffect, useState } from "react";
import ConnectContract from "../hooks/connectContract";
import {
  requestAccount,
  initProvider,
  requestChainId,
} from "../hooks/connectWallet";
import { Cast, Footer, Header, Notification } from "../components";
import {
  ChainIdContext,
  NotificationContext,
  ThemeContext,
  WalletContext,
  FormContext,
  PublisherContext,
} from "../contexts";
import detectEthereumProvider from "@metamask/detect-provider";
import ConnectWallet from "../components/ConnectWallet";

export default function Home() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const {
    setCurrentWallet,
    isCardOpen,
    setIsCardOpen,
    isWalletConnected,
    setIsWalletConnected,
  } = useContext(WalletContext);
  const { setIsNotificationOpen, notificationMessage, setNotificationMessage } =
    useContext(NotificationContext);
  const { chainId, setChainId } = useContext(ChainIdContext);
  const { isFormOpen, setIsFormOpen } = useContext(FormContext);
  const { isPublishersOpen, setIsPublishersOpen } =
    useContext(PublisherContext);

  const fetchProvider = async () => {
    return await detectEthereumProvider();
  };

  // check eth_chain_id after metamask is connected
  useEffect(() => {
    if (localStorage.getItem("connectedWallet") && chainId !== 4) {
      setNotificationMessage("Please switch your MetaMask to rinkeby network!");
      setIsNotificationOpen(true);
    }
  }, [chainId]);

  // fetch published episodes after metamask is connected
  useEffect(async () => {
    if (
      typeof window.ethereum !== "undefined" &&
      localStorage.getItem("connectedWallet")
    ) {
      await ConnectContract.connect().then(async () => {
        await ConnectContract.getEpisodes().then((episodeArray) => {
          setEpisodes(episodeArray);
          setIsFetching(false);
        });
      });
    } else {
      setIsFetching(false);
    }
  }, [isWalletConnected]);

  // initializing after client is first loaded
  useEffect(async () => {
    if (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("connectedWallet") &&
      window.ethereum === (await fetchProvider()) &&
      window.ethereum.isConnected()
    ) {
      await requestAccount().then((account) => {
        localStorage.setItem("connectedWallet", account);
        setCurrentWallet(account);
        setIsWalletConnected(true);
      });
    } else {
      localStorage.removeItem("connectedWallet");
    }

    if (typeof window !== "undefined" && localStorage.getItem("isDarkMode")) {
      setIsDarkMode(Boolean(Number(localStorage.getItem("isDarkMode"))));
    }
  }, []);

  // function to handle metamask connection
  const handleConnectWallet = async () => {
    setIsConnecting(true);

    if (typeof window.ethereum === "undefined") {
      console.log(typeof window.ethereum);
      setNotificationMessage(
        "MetaMask not detected! install from: https://metamask.io/"
      );
      setIsNotificationOpen(true);
      setIsConnecting(false);
      return 0;
    }

    if (!window.ethereum.isMetaMask) {
      setNotificationMessage(
        "MetaMask not detected! install from: https://metamask.io/"
      );
      setIsNotificationOpen(true);
      setIsConnecting(false);
      return 0;
    }

    try {
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
    } catch (e) {
      console.log(`error cached: ${e}`);
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
          isCardOpen || isFormOpen || isPublishersOpen ? "blur-[3px]" : ""
        }`}
        onClick={() => {
          if (isCardOpen) setIsCardOpen(false);
          if (isFormOpen) setIsFormOpen(false);
          if (isPublishersOpen) setIsPublishersOpen(false);
        }}
      >
        {(isCardOpen || isFormOpen || isPublishersOpen) && (
          <div className="z-10 w-full h-full absolute"></div>
        )}
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

        <h2 className="text-2xl font-black text-left mt-10 flex items-center">
          Published Episodes
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 17l-4 4m0 0l-4-4m4 4V3"
            />
          </svg>
        </h2>
        <div className="flex flex-wrap mx-auto items-center justify-around max-w-4xl mt-6 sm:w-full">
          {isFetching && episodes.length === 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 animate-spin mx-auto"
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
          {!isFetching && episodes.length === 0 && (
            <h3 className="flex gap-2 mx-auto">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Please connect your wallet first, then we can grab the episodes
              for you =)
            </h3>
          )}
          <section className="flex flex-wrap-reverse justify-center gap-4">
            {episodes.length !== 0 &&
              episodes.map((episode, index) => {
                return (
                  <Cast
                    key={index}
                    episodeId={index}
                    link={episode.link}
                    title={episode.title}
                    desc={episode.desc}
                    pledge={episode.pledge}
                  />
                );
              })}
          </section>
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
