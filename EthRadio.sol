// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthRadio {

    constructor() {
        // set owner of contract to msg.sender once contract is being deployed
    }
    fallback() external {
        revert();
    }

    function deposit(uint _amount) public payable {
        // subscribers can deposit eth to the contract to receive episodes
    }

    function withdraw(uint _amount) public payable {
        // subscribers are able to withdraw thier funds from the contract
    }

    function publishEpisode(string memory _link, uint _pledge) public {
        // contract owner is able to publish a new episode
    }

    function totalSubscribers() public view returns(uint) {
        // return number of total subscribers ever depoisted to the contract
    }
    function activeSubscribers() public view returns(uint) {
        // return number of subscribers with sufficient balance for further episodes
    }
    function closePodcast() public {
        // contract owner can close the podcast
        // when closed, no deposits will be accepted and any tx calling deposit function will revert
    }
}