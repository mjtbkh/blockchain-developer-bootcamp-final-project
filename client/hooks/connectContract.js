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
      "0x8E11dC9D74B8913E16e13171D0F3a219fd13e486",
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
    console.log("subscribing...");

    if (
      subscribeToPodcastTx.logs &&
      subscribeToPodcastTx.logs[0].event === "logNewSubscription"
    ) {
      console.log("subscription failed!");
      return false;
    }
    console.log("subscription sucessful");
    return true;
  }

  static async depositToEthRadio(valueInEth) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    let depositTx = await signer.deposit({
      value: ethers.utils.parseUnits(valueInEth, "ether"),
    });
    console.log("depositing...");

    if (depositTx.logs && depositTx.logs[0].event === "logDeposit") {
      console.log("deposition failed!");
      return true;
    }
    console.log("deposition sucessful!");
    return false;
  }

  static async subscribeToEpisode(episodeId) {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = this.contract.connect(provider.getSigner());
    let subscribeToEpisodeTx = await signer.subscribeToEpisode(episodeId);
    console.log("subscribing to episode...");
    if (subscribeToEpisodeTx.logs[0].event === "logEpisodeSubscribed") {
      console.log("subscription failed!");
      return true;
    }
    console.log("subscription successful!");
    return false;
  }
}

export default ConnectContract;
