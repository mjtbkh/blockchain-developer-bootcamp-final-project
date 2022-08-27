/**
 * Utitlity functions to handle interactions between client and ethereum network
 */

import { ethers } from "ethers";

export const requestAccount = async () => {
  let accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
};

export const initProvider = async () => {
  if (typeof window.ethereum !== "undefined") {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts');
    let signer = provider.getSigner();
    return await signer.getAddress();
  }
};

export const requestChainId = async () => {
  if (typeof window.ethereum !== "undefined") {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    return (await provider.getNetwork()).chainId;
  }
};

export const requestBalance = async () => {
  if (typeof window.ethereum !== "undefined") {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getBalance(localStorage.getItem("connectedWallet"));
  }

  ethereum.on("disconnect", () => {
    localStorage.removeItem("connectedWallet");
  });
};
