const Ownable  = artifacts.require("./TokenABC.sol");

contract("Ownable", async accounts => {

    it("transfer ownership", async () => {
        const instance = await Ownable.deployed();

        let owner = await instance.owner();

        // Make sure account 0 is owner
        assert.equal(owner, accounts[0], "The owner was not properly assigned");
        // Transfer it to acconts 1 
        await instance.transferOwnership(accounts[1]);

        // Verify that accounts 1 is now the new owner
        let new_owner = await instance.owner();
        assert.equal(new_owner, accounts[1], "The ownership was not transferred correctly");
    });
  
    it("onlyOwner modifier", async () => {
        const instance = await Ownable.deployed();
        // Try executing a Transfer from accounts 2 
        try {
            await instance.transferOwnership(accounts[2], { from: accounts[2]});
        }catch(error){
            assert.equal(error.reason, "Ownable: only owner can call this function", "Failed to stop non-owner from calling onlyOwner protected function");
        }
    });

    it("renounce ownership", async () => {
        const instance = await Ownable.deployed();
        // renounce from accounts 1 as it is the new owner
        await instance.renounceOwnership({ from: accounts[1]});
        let owner = await instance.owner();
        assert.equal(owner, '0x0000000000000000000000000000000000000000', 'Renouncing owner was not correctly done')
    });    
});
