// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title EthRadio, a premium-membership podcast on blockchain
/// @author Mojtaba Khodami
/// @notice This is an experimental contract and needs lots of work to be production-ready
/// @custom:security-contact mojtabakh@hotmail.com
/// @custom:experimental This is an experimental contract
contract EthRadio is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    // extra roles for access control
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE");
    bytes32 public constant SUBSCRIBER_ROLE = keccak256("SUBSCRIBER_ROLE");

    uint16 private episodeCount;
    uint64 private totalSubscribers;

    mapping(address => Subscriber) private Subscribers;
    mapping(uint16 => Episode) public PublishedEpisodes;
    mapping(address => uint256) private Balances;
    mapping(uint16 => mapping(address => bool)) private HasSubscriber;

    /// @notice Episode struct defining how an episode is structured
    struct Episode {
        uint16 id;
        string title;
        string cid;
        string desc;
        uint256 pledge;
    }

    /// @notice Subscriber struct defining how a user is stuctured
    struct Subscriber {
        uint64 id;
        bool isActive;
    }

    /// @notice Initialize values for contract deployment
    /// @dev Contract initializer calls initializer of inherited openzeppelin contracts
    /// @dev Modifier `initializer` allows contract creation only to be done once
    function initialize() public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        // set admin of contract to msg.sender once contract is being deployed
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PUBLISHER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
    }

    /// @notice Pause contract in case there is an emergency situation
    /// @dev `pause` function calls _pause method under @openzeppelin/PausableUpgradeable
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /// @notice Unpause the contract after a pause, once everything is clear
    /// @dev `unpause` function calls _unpause method under @openzeppelin/PausableUpgradeable
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @notice Enable UUPS upgrade method
    /// @dev Only `UPGRADER_ROLE` should be able to upgrade to the new implementation of contract
    /// @dev Each new implemetation should inherit or extend the previous version of contract
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    /// @notice Revert the transaction if it's failing
    /// @dev `fallback` will fully revert the tx if there is no proper input or call
    fallback() external {
        revert();
    }

    /*
     * Events
     */

    /// @notice event for subscription of a new account
    /// @param _subscriberId The ethereum address as user id
    event logNewSubscription(address _subscriberId);

    /// @notice event for new deposit into contract
    /// @param _subscriberId The ethereum address as user id
    /// @param _amount The amount of ether deposited, in wei 
    event logDeposit(address _subscriberId, uint256 _amount);

    /// @notice event for user withdrawals from contract
    /// @param _subscriberId The ethereum address as user id
    /// @param _amount The amount of ether withdrawn, in wei
    event logWithdraw(address _subscriberId, uint256 _amount);

    /// @notice event for subscription of user to an episode
    /// @param _episodeId The Id of subscribed episode
    event logEpisodeSubscribed(uint16 _episodeId);

    /// @notice event for propagating errors to the end user
    /// @dev The error message returned from .call() as a `bytes` type
    /// @param _message The messages returned in bytes format
    event logError(bytes _message);

    /// @notice event for punlishment of a new episeode
    /// @param _episodeId The id of newly published episode
    event logEpisodePublished(uint16 _episodeId);

    /// @notice event for deletion of an episode
    /// @param _episodeId The id of deleted episode
    event logEpisodeDeleted(uint16 _episodeId);

    /// @notice event for closure of podcast
    event logClosure();

    /// @notice Invite a new publisher to the podcast
    /// @dev Adds new publisher and sets up proper role for provided address
    /// @param _newPublisher The public ethreum address going to be registered as a pulisher in the contract
    function invitePublisher(address _newPublisher) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(PUBLISHER_ROLE, _newPublisher);
    }

    /// @notice Revoke a publsiher access
    /// @dev Removes publisher and revokes publisher role for provided address
    /// @param _publisher The public ethereum address of the publisher fired out of contract
    function revokePublisher(address _publisher) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(PUBLISHER_ROLE, _publisher);
    }

    /// @notice Subscribe a new user to the podcast
    /// @dev Subscripting to the contract adds SUBSCRIBER_ROLE to the msg.sender
    function subscribe() public {
        require(!hasRole(SUBSCRIBER_ROLE, msg.sender));
        
        Subscribers[msg.sender] = Subscriber({
            id: totalSubscribers,
            isActive: false
        });
        _setupRole(SUBSCRIBER_ROLE, msg.sender);
        totalSubscribers++;

        emit logNewSubscription(msg.sender);
    }

    /// @notice Deposit eth by a subscriber
    /// @dev Subscribers can deposit `ETH` to the contract to receive episodes
    function deposit() public payable onlyRole(SUBSCRIBER_ROLE) {
        require(msg.value > 0);
        Balances[msg.sender] += msg.value;
        Subscribers[msg.sender].isActive = true;

        emit logDeposit(msg.sender, msg.value);
    }

    /// @notice Get user balance deposited to EthRadio contract
    function getBalance() public view onlyRole(SUBSCRIBER_ROLE) returns (uint256) {
        return Balances[msg.sender];
    }

    /// @notice Subscriber can choose to subscribe an episode
    /// @dev Subscriber needs to have balance and can then subscribe to a specific episode they want
    function subscribeToEpisode(uint16 _episodeId) public onlyRole(SUBSCRIBER_ROLE) {
        require(Balances[msg.sender] >= PublishedEpisodes[_episodeId].pledge);
        HasSubscriber[_episodeId][msg.sender] = true;

        emit logEpisodeSubscribed(_episodeId);
    }

    /// @notice Subscribers are able to withdraw thier funds from the contract
    /// @param _amount The amount of ether in wei going to be withdrawn from contract
    function withdraw(uint256 _amount) public payable onlyRole(SUBSCRIBER_ROLE) {
        require(Balances[msg.sender] > 0);    
        Balances[msg.sender] -= _amount;
        (bool result, bytes memory error) = msg.sender.call{value: _amount}("");
        if(!result) {
            emit logError(error);
        }
        require(result);


        if(Balances[msg.sender] == 0) {
            Subscribers[msg.sender].isActive = false;
        }

        emit logWithdraw(msg.sender, _amount);

    }

    function getBalanceByAdmin(address _userId) public view onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256 Balance) {
        Balance = Balances[_userId];
    }

    /// @notice publishers are able to publish a new episode
    function publishEpisode(string memory _cid, string memory _title, string memory _desc, uint256 _pledge) public onlyRole(PUBLISHER_ROLE) {
        PublishedEpisodes[episodeCount] = Episode({
            id: episodeCount,
            title: _title,
            cid: _cid,
            desc: _desc,
            pledge: _pledge
        });

        emit logEpisodePublished(episodeCount);
        episodeCount++;
    }

    /// @notice `removeEpisode` removes the episode with provided ID from `PublishedEpisodes`
    /// @dev only `DEFAULT_ADMIN_ROLE` is able to remove an episode
    /// @param _episodeId ID of the existing episode to be delted
    function removeEpisode(uint16 _episodeId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        delete PublishedEpisodes[_episodeId];
        episodeCount--;

        emit logEpisodeDeleted(_episodeId);
    }

    /// @notice return number of total subscribers ever depoisted to the contract.
    /// @return `uint64` number of total subscribers
    function getTotalSubscribers() public view returns (uint64) {
        return totalSubscribers;
    }

    /// @notice check if subscriber has sufficient balance for further episodes.
    /// @param _subscriberId is the address of subscriber to be checked
    /// @return `bool` is user considerd as active users
    function isActiveSubscriber(address _subscriberId) public view returns (bool) {
        return Subscribers[_subscriberId].isActive;
    }

    /// @notice `getTotalEpisode` function reads value of private `episodeCount` and returns it.
    /// @return `uint16` number of total episodes
    function getTotalEpisodeCount() public view returns (uint16) {
        return episodeCount;
    }

    function getEpisodes() public view returns (Episode[] memory){
        Episode[] memory Episodes = new Episode[](episodeCount);
        for (uint16 index = 0; index < episodeCount; index++) {
            Episodes[index] = PublishedEpisodes[index];

            if(!HasSubscriber[index][msg.sender]) {
                Episodes[index].cid = "";
            }
        }

        return Episodes;
    }
}
