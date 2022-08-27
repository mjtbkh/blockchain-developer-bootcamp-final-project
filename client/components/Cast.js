import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import ConnectContract from "../hooks/connectContract";
import { WalletContext } from "../contexts";

export default function Cast({ episodeId, cid, title, desc, pledge }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { isSubscriber } = useContext(WalletContext);

  // force update DOM after user unlocks metamask
  useEffect(() => {}, [isUnlocked]);

  const handleUnlock = async (episodeId) => {
    await ConnectContract.connect().then(async () => {
      await ConnectContract.subscribeToEpisode(episodeId).then((res) => {
        if (res) setIsUnlocked(true);
      });
    });
  };

  return (
    <section
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="bg-white dark:bg-gray-700 dark:border-gray-800 dark:hover:text-blue-300 dark:bg-opacity-50 bg-opacity-30 p-6 mt-6 text-left border border-gray-50 w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 shadow-lg backdrop-blur-md"
    >
      <h3 className="text-2xl font-bold">{title} &rarr;</h3>
      <p className="mt-4 text-xl">{desc}</p>
      {cid && (
        <a href={`https://ipfs.io/ipfs/${cid}/`}>
          Get Episode{" "}
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
        </a>
      )}
      {!cid && (
        <button
          disabled={isSubscriber ? false : true}
          onClick={() => handleUnlock(episodeId)}
          className={`bg-green-500 ring-2 ring-green-400 hover:bg-green-700 dark:hover:bg-green-700 text-white font-bold p-2 my-4 rounded-md mx-auto backdrop-blur-xl transition-all duration-150 ${
            isSubscriber ? "" : "grayscale cursor-not-allowed"
          }`}
        >
          {isSubscriber && `Unlock for ${ethers.utils.formatEther(pledge)}!`}
          {!isSubscriber && "Subscribe first"}
        </button>
      )}
    </section>
  );
}
