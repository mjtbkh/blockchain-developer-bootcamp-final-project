import { ethers } from "ethers";

export const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

export const initProvider = async () => {
  if (typeof window.ethereum !== undefined) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    console.log(provider.getNetwork());
    return await signer.getAddress();
  }
};

export const requestChainId = async () => {
  if (typeof window.ethereum !== undefined) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    return (await provider.getNetwork()).chainId;
  }
};

export const requestBalance = async () => {
  if (typeof window.ethereum !== undefined) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getBalance(localStorage.getItem("connectedWallet"));
  }

  ethereum.on("disconnect", () => {
    localStorage.removeItem("connectedWallet");
  });
};
