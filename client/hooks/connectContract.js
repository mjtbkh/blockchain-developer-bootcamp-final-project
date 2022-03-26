/**
 * Utitlity functions to handle interactions between client and contract instance
 */

import { abi } from "./abi";
import { ethers } from "ethers";

class ConnectContract {
  static contract;

  static async connect() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    this.contract = new ethers.Contract(
      "0xa9D5B75aDc45e5586e0cD45623Ef6D38b0246E35",
      abi,
      provider
    );

    if (this.contract) return new Promise((resolve, reject) => resolve());
  }

  static async getBalance() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    let getBalanceTx = await signer.getBalance();

    return await getBalanceTx;
  }

  static async publishEpisode(link, title, desc, pledge) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    const publishTx = await signer.publishEpisode(
      link,
      title,
      desc,
      ethers.utils.parseEther(pledge)
    );

    return await publishTx;
  }

  static async getEpisodes() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    const getEpisodesTx = await signer.getEpisodes();
    return await getEpisodesTx;
  }

  static async invitePublisher(address) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    const inviteTx = await signer.invitePublisher(address);
  }

  static async revokePublisher(address) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    const revokeTx = await signer.revokePublisher(address);
  }

  static async hasRole(role) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    let hasRoleTx;

    switch (role) {
      case "DEFAULT_ADMIN_ROLE":
        hasRoleTx = await signer.hasRole(
          await signer.DEFAULT_ADMIN_ROLE.call(),
          provider.getSigner().getAddress()
        );
        return hasRoleTx;
      case "PUBLISHER_ROLE":
        hasRoleTx = await signer.hasRole(
          await signer.PUBLISHER_ROLE.call(),
          provider.getSigner().getAddress()
        );
        return hasRoleTx;
      case "SUBSCRIBER_ROLE":
        hasRoleTx = await signer.hasRole(
          await signer.SUBSCRIBER_ROLE.call(),
          provider.getSigner().getAddress()
        );
        return hasRoleTx;
    }
    return false;
  }

  static async subscribeToPodcast() {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    let subscribeToPodcastTx = await signer.subscribe();

    if (
      subscribeToPodcastTx.logs &&
      subscribeToPodcastTx.logs[0].event === "logNewSubscription"
    )
      return true;
    return false;
  }

  static async depositToEthRadio(valueInEth) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    let depositTx = await signer.deposit({
      value: ethers.utils.parseUnits(valueInEth, "ether"),
    });

    if (depositTx.logs && depositTx.logs[0].event === "logDeposit") return true;
    return false;
  }

  static async subscribeToEpisode(episodeId) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    let subscribeToEpisodeTx = await signer.subscribeToEpisode(episodeId);

    if (subscribeToEpisodeTx.logs[0].event === "logEpisodeSubscribed")
      return true;
    return false;
  }
}

export default ConnectContract;
