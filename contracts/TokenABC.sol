// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Ownable.sol";
import "./Stakeable.sol";

contract TokenABC is ERC20, Ownable, Stakeable {
    uint256 public tokenPrice;
    uint256 public tokensSold;

    constructor(uint256 initialSupply, uint256 _tokenPrice)
        ERC20("TokenABC", "ABC")
    {
        tokenPrice = _tokenPrice;
        _mint(address(this), initialSupply * 10**decimals());
    }

    function buyTokens(uint256 numberOfTokens) external payable {
        // keep track of number of tokens sold
        // require that a contract have enough tokens
        // require tha value sent is equal to token price
        // trigger sell event
        require(msg.value >= _mul(numberOfTokens, tokenPrice));
        require(this.balanceOf(address(this)) >= numberOfTokens);
        require(this.transfer(msg.sender, numberOfTokens));

        tokensSold += numberOfTokens;
    }

    function stake(uint256 _amount) public {
        // Make sure staker actually is good for it
        require(
            this.totalSupply() < 108000000000000000000000000,
            "TokenABC: Cannot stake more"
        );
        require(
            _amount <= this.balanceOf(address(msg.sender)),
            "TokenABC: Cannot stake more than you own"
        );

        _stake(_amount);
        // Burn the amount of tokens on the sender
        _burn(msg.sender, _amount);
    }

    function withdrawStake(uint256 amount, uint256 stake_index) public {
        uint256 amount_to_mint = _withdrawStake(amount, stake_index);
        // Return staked tokens to user
        _mint(msg.sender, amount_to_mint);
    }
}
