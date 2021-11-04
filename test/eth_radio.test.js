const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const EthRadio = artifacts.require("EthRadio");
const { items: EpisodeStruct, isDefined, isType } = require("./helper");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("EthRadio", function (accounts) {
  const [_owner, jack, angelina] = accounts;
  let instance;

  let PUBLISHER_ROLE = web3.utils.toHex;

  beforeEach(async () => {
    instance = await deployProxy(EthRadio, [], { kind: "uups" });
  });

  describe("Contract initialization", () => {
    it("Should deploy an instance of contract using `uups` proxy pattern", async function () {
      assert.isTrue(instance.address !== null);
    });
  });

  /// Checks if needed variables are defined
  describe("Variables", () => {
    it("Should define `PAUSER_ROLE`", async () => {
      assert.equal(
        typeof instance.PAUSER_ROLE,
        "function",
        "The contract has no `PAUSER_ROLE`"
      );
    });

    it("Should define `UPGRADER_ROLE`", async () => {
      assert.equal(
        typeof instance.UPGRADER_ROLE,
        "function",
        "The contract has no `UPGRADER_ROLE`"
      );
    });

    it("Should define `PUBLISHER_ROLE`", async () => {
      assert.equal(
        typeof instance.PUBLISHER_ROLE,
        "function",
        "The contract has no PUBLISHER_ROLE`"
      );
    });

    it("Should define `SUBSCRIBER_ROLE`", async () => {
      assert.equal(
        typeof instance.SUBSCRIBER_ROLE,
        "function",
        "The contract has no `SUBSCRIBER_ROLE`"
      );
    });
  });

  describe("Episode struct", () => {
    let episodeStruct;

    before(() => {
      episodeStruct = EpisodeStruct(EthRadio);
      assert(
        episodeStruct !== null,
        "The contract should have an `Episode` struct defined"
      );
    });

    it("Should have an `id`", () => {
      assert(
        isDefined(episodeStruct)("id"),
        "Episode struct should have an `id` member"
      );
      assert(
        isType(episodeStruct)("uint256"),
        "`id` should be of type uint256"
      );
    });

    it("Should have a `title`", () => {
      assert(
        isDefined(episodeStruct)("title"),
        "Episode struct should have a `title` member"
      );
      assert(isType(episodeStruct)("string"), "`id` should be of type string");
    });

    it("Should have a `link`", () => {
      assert(
        isDefined(episodeStruct)("link"),
        "Episode struct should have a `link` member"
      );
      assert(
        isType(episodeStruct)("string"),
        "`link` should be of type string"
      );
    });

    it("Should have an `pledge`", () => {
      assert(
        isDefined(episodeStruct)("pledge"),
        "Episode struct should have an `pledge` member"
      );
      assert(
        isType(episodeStruct)("uint256"),
        "`pledge` should be of type uint256"
      );
    });
  });

  describe("Use cases", () => {
    it("Should specify provided address as `PUBLISHER_ROLE`", async () => {
      await instance.invitePublisher(jack, { from: _owner });
      const result = await instance.hasRole(
        await instance.PUBLISHER_ROLE.call(),
        jack
      );
      assert(result, "Provided address did not receive publisher role");
    });

    it("Should revoke `PUBLISHER_ROLE` for provided address", async () => {
      await instance.revokePublisher(jack, { from: _owner });
      const result = await instance.hasRole(
        await instance.PUBLISHER_ROLE.call(),
        jack
      );
      assert(!result, "Publisher role not revoked");
    });

    it("Should subscribe the `msg.sender` to the contract as a subscriber", async () => {
      var eventEmitted;

      const tx = await instance.subscribe({ from: jack });
      const result = await instance.hasRole(
        await instance.SUBSCRIBER_ROLE.call(),
        jack
      );

      assert(result, "`msg.sender` did not receive subscriber role");

      if (
        tx.logs[0].event == "RoleGranted" &&
        tx.logs[1].event == "logNewSubscription"
      ) {
        eventEmitted = true;
      }

      assert.equal(eventEmitted, true, "New subscription should emit an event");
    });

    it("Should deposit `msg.value` from `msg.sender` and add it to `Balances` mapping", async () => {
      var eventEmitted;
      await instance.subscribe({ from: jack });
      const isSubscriber = await instance.hasRole(
        await instance.SUBSCRIBER_ROLE.call(),
        jack
      );

      assert.equal(
        isSubscriber,
        true,
        "`msg.sender` doesn't have subscriber role"
      );

      const tx = await instance.deposit({
        value: web3.utils.toWei("0.0005"),
        from: jack,
      });
      const balanceAfterTx = await instance.getBalance(jack, { from: _owner });

      assert.equal(
        balanceAfterTx.toString(),
        web3.utils.toWei("0.0005"),
        "User balance in `Balances` should equal to last balance + new deposit"
      );

      if (tx.logs[0].event == "logDeposit") eventEmitted = true;

      assert.equal(eventEmitted, true, "Deposits should emit an event");
    });

    it("Should publish new episode if `msg.sender` has `PUBLISHER_ROLE`", async () => {
      var eventEmitted;

      const tx = await instance.publishEpisode(
        "https://virgool.io/@mjtbkh",
        "Episode 1: Hello, world!",
        web3.utils.toWei("0.0005"),
        { from: _owner }
      );

      if (tx.logs[0].event == "logEpisodePublished") eventEmitted = true;

      assert.equal(
        eventEmitted,
        true,
        "New episode publishing should emit an event"
      );
    });

    it("Should remove episode with provided `_episodeId` and emit proper event", async () => {
      var eventEmitted;

      await instance.publishEpisode(
        "string_url",
        "string_title",
        5 * 10 ** 12,
        { from: _owner }
      );
      const removeTx = await instance.removeEpisode(0);

      const totalEpisodes = await instance
        .getTotalEpisodeCount()
        .then((res) => res.toString());

      assert.equal(
        await totalEpisodes,
        0,
        "Total episodes number was not updated properly"
      );

      if (removeTx.logs[0].event == "logEpisodeDeleted") eventEmitted = true;

      assert.equal(eventEmitted, true, "Episode removal should emit an event");
    });

    it("Should get number of total subscribers inside the contract", async () => {
      await instance.subscribe({ from: jack });
      const tx = await instance.getTotalSubscribers();

      assert(1, tx, "Not showing total subscribers");
    });

    it("Should return true, indicating user is active", async () => {
      await instance.subscribe({ from: jack });
      await instance.deposit({
        from: jack,
        value: web3.utils.toWei("0.0005"),
      });

      const tx = await instance.isActiveSubscriber(jack, { from: angelina });

      assert.equal(
        tx,
        true,
        "User was not considered active whereas balance was not 0"
      );
    });

    it("Should return proper number of episodes", async () => {
      await instance.publishEpisode(
        "link",
        "title",
        web3.utils.toWei("0.0005"),
        { from: _owner }
      );
      const getEpisodeCountTx = await instance
        .getTotalEpisodeCount()
        .then((res) => res.toString());

      assert.equal(
        await getEpisodeCountTx,
        1,
        "Did not return proper count for published episodes"
      );
    });
  });
});
