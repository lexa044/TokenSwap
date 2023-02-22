const TokenABC = artifacts.require("./TokenABC.sol");

contract("TokenABC", (accounts) => {
  it("Testing the initial supply", async () => {
    const instance = await TokenABC.deployed();
    const result = await instance.totalSupply.call();
    assert.equal(1000000 * 10 ** 18, result);
  });

  it("transfering tokens", async() => {
    const instance = await TokenABC.deployed();

    // Grab initial balance
    let initial_balance = await instance.balanceOf(accounts[1]);

    // need to buy tokenABC
    await instance.buyTokens(100, {
      from: accounts[1],
      value: 1000 * 1000 + 2000,
    });

    let after_balance = await instance.balanceOf(accounts[1]);
    assert.equal(after_balance.toNumber(), initial_balance.toNumber()+100, "Balance should have increased on receiver")
  });

  it ("allow account some allowance", async() => {
    const instance = await TokenABC.deployed();
    //accounts[0] => msg.sender
    try{
        // Give account 1 access too 100 tokens on zero account
        await instance.approve(accounts[1], 100);    
    }catch(error){
        assert.fail(error); // shold not fail
    }

    // Verify by checking allowance
    let allowance = await instance.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 100, "Allowance was not correctly inserted");
  });
});
