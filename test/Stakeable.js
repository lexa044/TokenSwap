
const truffleAssert = require('truffle-assertions');
const TokenABC = artifacts.require("./TokenABC.sol");
const helper = require("./helpers/truffleTestHelpers");
contract("DevToken", async accounts => {
    it("Staking 100x2", async () => {
        const instance = await TokenABC.deployed();

        // Stake 100 is used to stake 100 tokens twice and see that stake is added correctly and money burned
        let owner = accounts[0];
        // Set owner, user and a stake_amount
        let stake_amount = 100;
        // Add som tokens on account 1 asweel
        //await devToken.mint(accounts[1], 1000);
        // need to buy tokenABC
        await instance.buyTokens(1000, {
            from: accounts[0],
            value: 1000 * 1000 + 2000,
        });
        // Get init balance of user
        balance = await instance.balanceOf(owner)

        // Stake the amount, notice the FROM parameter which specifes what the msg.sender address will be
        stakeID = await instance.stake(stake_amount, { from: owner });
        // Assert on the emittedevent using truffleassert
        // This will capture the event and inside the event callback we can use assert on the values returned
        truffleAssert.eventEmitted(
            stakeID,
            "Staked",
            (ev) => {
                // In here we can do our assertion on the ev variable (its the event and will contain the values we emitted)
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index, 1, "Stake index was not correct");
                return true;
            },
            "Stake event should have triggered");

        // Stake again on owner because we want hasStake test to assert summary
        stakeID = await instance.stake(stake_amount, { from: owner });
        // Assert on the emittedevent using truffleassert
        // This will capture the event and inside the event callback we can use assert on the values returned
        truffleAssert.eventEmitted(
            stakeID,
            "Staked",
            (ev) => {
                // In here we can do our assertion on the ev variable (its the event and will contain the values we emitted)
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index, 1, "Stake index was not correct");
                return true;
            },
            "Stake event should have triggered");
    });

    it("new stakeholder should have increased index", async () => {
        const instance = await TokenABC.deployed();
        let stake_amount = 100;
        // need to buy tokenABC
        await instance.buyTokens(1000, {
            from: accounts[1],
            value: 1000 * 1000 + 2000,
        });
        stakeID = await instance.stake(stake_amount, { from: accounts[1] });
        // Assert on the emittedevent using truffleassert
        // This will capture the event and inside the event callback we can use assert on the values returned
        truffleAssert.eventEmitted(
            stakeID,
            "Staked",
            (ev) => {
                // In here we can do our assertion on the ev variable (its the event and will contain the values we emitted)
                assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
                assert.equal(ev.index, 2, "Stake index was not correct");
                return true;
            },
            "Stake event should have triggered");
    });

    it("cannot stake more than owning", async () => {
        const instance = await TokenABC.deployed();
        // Stake too much on accounts[2]
        try {
            await instance.stake(1000000000, { from: accounts[2] });
        } catch (error) {
            assert.equal(error.reason, "TokenABC: Cannot stake more than you own");
        }
    });

    it("cant withdraw bigger amount than current stake", async() => {
        const instance = await TokenABC.deployed();

        let owner = accounts[0];
        // Try withdrawing 200 from first stake
        try {
            await instance.withdrawStake(200, 0, {from:owner});
        }catch(error){
            assert.equal(error.reason, "Staking: Cannot withdraw more than you have staked", "Failed to notice a too big withdrawal from stake");
        }
    });

});