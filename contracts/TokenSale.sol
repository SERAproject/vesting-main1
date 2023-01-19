// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { TokenTimelock } from "./TokenTimelock.sol";
import { TokenVesting } from "./TokenVesting.sol";

/**
 * @title TokenSale Contract
 */

contract TokenSale is Ownable {
    using SafeMath for uint256;
    IERC20 public token; // the token being sold

    uint256 public coinsSold;

    address public immutable USDT;
    address public immutable BUSD;

    event Sold(address buyer, uint256 amount);

    uint256 public exchangePriceUSDT = 120000000000000000;
    uint256 public exchangePriceBUSD = 120000000000000000;
    uint256 public cliff = 3 * 30 days;
    uint256 public duration = 18 * 30 days;
    uint256 public minBuyAmountUSDT = 10000000000000000000;
    uint256 public maxBuyAmountUSDT = 10000000000000000000000;
    uint256 public minBuyAmountBUSD = 10000000000000000000;
    uint256 public maxBuyAmountBUSD = 10000000000000000000000;
    TokenVesting public vesting;
    TokenTimelock public timelock;

    uint256 public availableAtTGE = 200; // percentage basis points

    enum SaleStatus {
        Pause,
        Start
    }

    SaleStatus public saleStatus;

    constructor(
        IERC20 _token,
        address _usdt,
        address _busd
    ) {
        token = _token;
        USDT = _usdt;
        BUSD = _busd;
        vesting = new TokenVesting(address(token));
        timelock = new TokenTimelock(address(token));
    }

    modifier onSale() {
        require(saleStatus == SaleStatus.Start, "1");
        _;
    }

    function setExchangePriceUSDT(uint256 _usdtPrice) external onlyOwner {
        exchangePriceUSDT = _usdtPrice;
    }

    function setExchangePriceBUSD(uint256 _busdPrice) external onlyOwner {
        exchangePriceBUSD = _busdPrice;
    }

    function setCliff(uint256 _cliff) external onlyOwner {
        cliff = _cliff;
    }

    function setDuration(uint256 _duration) external onlyOwner {
        duration = _duration;
    }

    function setSaleStatus(SaleStatus _saleStatus) external onlyOwner {
        saleStatus = _saleStatus;
    }

    function setAvailableAtTGE(uint256 _availableAtTGE) external onlyOwner {
        availableAtTGE = _availableAtTGE;
    }

    function setBuyAmountRangeBUSD(uint256 _min, uint256 _max) external onlyOwner {
        minBuyAmountBUSD = _min;
        maxBuyAmountBUSD = _max;
    }

    function setBuyAmountRangeUSDT(uint256 _min, uint256 _max) external onlyOwner {
        minBuyAmountUSDT = _min;
        maxBuyAmountUSDT = _max;
    }

    function buyTokensUsingBUSD(uint256 _busdAmount) external onSale {
        uint256 _balanceBefore = IERC20(BUSD).balanceOf(address(this));
        require(IERC20(BUSD).transferFrom(msg.sender, address(this), _busdAmount), "2");
        uint256 _balanceAfter = IERC20(BUSD).balanceOf(address(this));
        uint256 _actualBUSDAmount = _balanceAfter.sub(_balanceBefore);
        require(_actualBUSDAmount >= minBuyAmountBUSD && _actualBUSDAmount <= maxBuyAmountBUSD, "3");
        uint256 _numberOfTokens = computeTokensForBUSD(_actualBUSDAmount);
        require(token.allowance(owner(), address(this)) >= _numberOfTokens, "4");
        emit Sold(msg.sender, _numberOfTokens);
        coinsSold += _numberOfTokens;
        uint256 _nonVestedTokenAmount = _numberOfTokens.mul(availableAtTGE).div(10000);
        uint256 _vestedTokenAmount = _numberOfTokens.sub(_nonVestedTokenAmount);
        // send some pct of tokens to buyer right away
        if (_nonVestedTokenAmount > 0) {
            //require(token.transferFrom(owner(), msg.sender, _nonVestedTokenAmount), "5");
            require(token.transferFrom(owner(), address(timelock), _nonVestedTokenAmount));
            timelock.depositTokens(msg.sender, _nonVestedTokenAmount);
        } // vest rest of the tokens
        require(token.transferFrom(owner(), address(vesting), _vestedTokenAmount), "6");

        vesting.createVestingSchedule(msg.sender, block.timestamp, cliff, duration, 1, false, _vestedTokenAmount);
    }

    function buyTokensUsingUSDT(uint256 _usdtAmount) external onSale {
        uint256 _balanceBefore = IERC20(USDT).balanceOf(address(this));
        require(IERC20(USDT).transferFrom(msg.sender, address(this), _usdtAmount), "2");
        uint256 _balanceAfter = IERC20(USDT).balanceOf(address(this));
        uint256 _actualUSDTAmount = _balanceAfter.sub(_balanceBefore);
        require(_actualUSDTAmount >= minBuyAmountUSDT && _actualUSDTAmount <= maxBuyAmountUSDT, "3"); // BUSD has 18 ethers
        uint256 _numberOfTokens = computeTokensForUSDT(_actualUSDTAmount);
        require(token.allowance(owner(), address(this)) >= _numberOfTokens, "4");
        emit Sold(msg.sender, _numberOfTokens);
        coinsSold += _numberOfTokens;
        uint256 _nonVestedTokenAmount = _numberOfTokens.mul(availableAtTGE).div(10000);
        uint256 _vestedTokenAmount = _numberOfTokens.sub(_nonVestedTokenAmount);
        // send some pct of tokens to buyer right away
        if (_nonVestedTokenAmount > 0) {
            //require(token.transferFrom(owner(), msg.sender, _nonVestedTokenAmount), "5");
            require(token.transferFrom(owner(), address(timelock), _nonVestedTokenAmount));
            timelock.depositTokens(msg.sender, _nonVestedTokenAmount);
        } // vest rest of the tokens
        require(token.transferFrom(owner(), address(vesting), _vestedTokenAmount), "6");

        vesting.createVestingSchedule(msg.sender, block.timestamp, cliff, duration, 1, false, _vestedTokenAmount);
    }

    function computeTokensForBUSD(uint256 _busdAmount) public view returns (uint256) {
        uint256 _tokenDecimals = ERC20(address(token)).decimals();
        return (_busdAmount * 10**_tokenDecimals) / exchangePriceBUSD;
    }

    function computeTokensForUSDT(uint256 _usdtAmount) public view returns (uint256) {
        uint256 _tokenDecimals = ERC20(address(token)).decimals();
        return (_usdtAmount * 10**_tokenDecimals) / exchangePriceUSDT;
    }

    function createVestingSchedule(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        uint256 _slicePeriodSeconds,
        bool _revocable,
        uint256 _amount,
        uint256 _availableAtTGE
    ) external onlyOwner {
        require(token.allowance(owner(), address(this)) >= _amount);
        emit Sold(_beneficiary, _amount);
        coinsSold += _amount;
        uint256 _nonVestedTokenAmount = _amount.mul(_availableAtTGE).div(10000);
        uint256 _vestedTokenAmount = _amount.sub(_nonVestedTokenAmount);
        // send some pct of tokens to buyer right away
        if (_nonVestedTokenAmount > 0) {
            require(token.transferFrom(owner(), _beneficiary, _nonVestedTokenAmount));
        } // vest rest of the tokens
        require(token.transferFrom(owner(), address(vesting), _vestedTokenAmount));
        vesting.createVestingSchedule(
            _beneficiary,
            _start,
            _cliff,
            _duration,
            _slicePeriodSeconds,
            _revocable,
            _vestedTokenAmount
        );
    }

    function withdrawBUSD() public onlyOwner {
        uint256 _busdBalance = IERC20(BUSD).balanceOf(address(this));
        if (_busdBalance > 0) {
            IERC20(BUSD).transfer(owner(), _busdBalance);
        }
    }

    function withdrawUSDT() public onlyOwner {
        uint256 _usdtBalance = IERC20(USDT).balanceOf(address(this));
        if (_usdtBalance > 0) {
            IERC20(USDT).transfer(owner(), _usdtBalance);
        }
    }

    function withdraw(uint256 _amount) public onlyOwner {
        vesting.withdraw(_amount);
        token.transfer(owner(), _amount);
    }

    function revoke(bytes32 vestingScheduleId) external onlyOwner {
        vesting.revoke(vestingScheduleId);
    }

    function endSale() external onlyOwner {
        // Send unsold tokens to owner.
        // require(tokenContract.transfer(ow, tokenContract.balanceOf(address(this))));
        // payable(address(vesting)).transfer(address(this).balance);
        saleStatus = SaleStatus.Pause;
        uint256 _withdrawableAmount = vesting.getWithdrawableAmount();
        if (_withdrawableAmount > 0) {
            withdraw(vesting.getWithdrawableAmount());
        }
        withdrawBUSD();
        withdrawUSDT();
    }
}
