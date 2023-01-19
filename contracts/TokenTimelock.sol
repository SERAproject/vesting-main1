// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TokenTimeLock Contract
 */

contract TokenTimelock is Ownable {
    // boolean to prevent reentrancy
    bool internal locked;
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    // address of the MEI token
    IERC20 private immutable _token;

    // Contract owner access
    bool public allIncomingDepositsFinalised;

    // Timestamp related variables
    uint256 public initialTimestamp;
    bool public timestampSet;
    uint256 public timePeriod;

    // Token amount variables
    mapping(address => uint256) public alreadyWithdrawn;
    mapping(address => uint256) public balances;
    uint256 public contractBalance;

    // Events
    event TokensDeposited(address from, uint256 amount);
    event AllocationPerformed(address recipient, uint256 amount);
    event TokensUnlocked(address recipient, uint256 amount);

    constructor(address token_) {
        require(token_ != address(0x0), "_erc20_contract_address address can not be zero");
        _token = IERC20(token_);
        allIncomingDepositsFinalised = false;
        timestampSet = false;
        locked = false;
    }

    // Modifier
    /**
     * @dev Prevents reentrancy
     */
    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    // Modifier
    /**
     * @dev Throws if allIncomingDepositsFinalised is true.
     */
    modifier incomingDepositsStillAllowed() {
        require(allIncomingDepositsFinalised == false, "Incoming deposits have been finalised.");
        _;
    }

    // Modifier
    /**
     * @dev Throws if timestamp already set.
     */
    modifier timestampNotSet() {
        require(timestampSet == false, "The time stamp has already been set.");
        _;
    }

    // Modifier
    /**
     * @dev Throws if timestamp not set.
     */
    modifier timestampIsSet() {
        require(timestampSet == true, "Please set the time stamp first, then try again.");
        _;
    }

    receive() external payable incomingDepositsStillAllowed {
        contractBalance = contractBalance.add(msg.value);
        emit TokensDeposited(msg.sender, msg.value);
    }

    // @dev Takes away any ability (for the contract owner) to assign any tokens to any recipients. This function is only to be called by the contract owner. Calling this function can not be undone. Calling this function must only be performed when all of the addresses and amounts are allocated (to the recipients). This function finalizes the contract owners involvement and at this point the contract's timelock functionality is non-custodial
    function finalizeAllIncomingDeposits() public timestampIsSet incomingDepositsStillAllowed {
        allIncomingDepositsFinalised = true;
    }

    /// @dev Sets the initial timestamp and calculates locking period variables i.e. twelveMonths etc.
    /// @param _timePeriodInSeconds amount of seconds to add to the initial timestamp i.e. we are essemtially creating the lockup period here
    function setTimestamp(uint256 _timePeriodInSeconds) public onlyOwner timestampNotSet {
        timestampSet = true;
        initialTimestamp = block.timestamp;
        timePeriod = initialTimestamp.add(_timePeriodInSeconds);
    }

    /// @dev Function to withdraw Eth in case Eth is accidently sent to this contract.
    /// @param amount of network tokens to withdraw (in wei).
    function withdrawEth(uint256 amount) public onlyOwner noReentrant {
        require(amount <= contractBalance, "Insufficient funds");
        contractBalance = contractBalance.sub(amount);
        // Transfer the specified amount of Eth to the owner of this contract
        payable(msg.sender).transfer(amount);
    }

    /// @dev Allows the contract owner to allocate official ERC20 tokens to each future recipient (only one at a time).
    /// @param recipient, address of recipient.
    /// @param amount to allocate to recipient.
    function depositTokens(address recipient, uint256 amount)
        public
        onlyOwner
        timestampIsSet
        incomingDepositsStillAllowed
    {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        balances[recipient] = balances[recipient].add(amount);
        emit AllocationPerformed(recipient, amount);
    }

    /// @dev Allows the contract owner to allocate official ERC20 tokens to multiple future recipient in bulk.
    /// @param recipients, an array of addresses of the many recipient.
    /// @param amounts to allocate to each of the many recipient.
    function bulkDepositTokens(address[] calldata recipients, uint256[] calldata amounts)
        external
        onlyOwner
        timestampIsSet
        incomingDepositsStillAllowed
    {
        require(
            recipients.length == amounts.length,
            "The recipients and amounts arrays must be the same size in length"
        );
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "ERC20: transfer to the zero address");
            balances[recipients[i]] = balances[recipients[i]].add(amounts[i]);
            emit AllocationPerformed(recipients[i], amounts[i]);
        }
    }

    /// @dev Allows recipient to unlock tokens after 24 month period has elapsed
    /// @param token - address of the official ERC20 token which is being unlocked here.
    /// @param to - the recipient's account address.
    /// @param amount - the amount to unlock (in wei)
    function transferTimeLockedTokensAfterTimePeriod(
        IERC20 token,
        address to,
        uint256 amount
    ) public timestampIsSet noReentrant {
        require(to != address(0), "ERC20: transfer to the zero address");
        require(balances[to] >= amount, "Insufficient token balance, try lesser amount");
        require(msg.sender == to, "Only the token recipient can perform the unlock");
        require(
            token == _token,
            "Token parameter must be the same as the erc20 contract address which was passed into the constructor"
        );
        if (block.timestamp >= timePeriod) {
            alreadyWithdrawn[to] = alreadyWithdrawn[to].add(amount);
            balances[to] = balances[to].sub(amount);
            token.safeTransfer(to, amount);
            emit TokensUnlocked(to, amount);
        } else {
            revert("Tokens are only available after correct time period has elapsed");
        }
    }

    /// @dev Transfer accidentally locked ERC20 tokens.
    /// @param token - ERC20 token address.
    /// @param amount of ERC20 tokens to remove.
    function transferAccidentallyLockedTokens(IERC20 token, uint256 amount) public onlyOwner noReentrant {
        require(address(token) != address(0), "Token address can not be zero");
        // This function can not access the official timelocked tokens; just other random ERC20 tokens that may have been accidently sent here
        require(token != _token, "Token address can not be ERC20 address which was passed into the constructor");
        // Transfer the amount of the specified ERC20 tokens, to the owner of this contract
        token.safeTransfer(msg.sender, amount);
    }
}
