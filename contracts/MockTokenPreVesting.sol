// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./TokenPreVesting.sol";

/**
 * @title MockTokenPreVesting
 * WARNING: use only for testing and debugging purpose
 */
contract MockTokenPreVesting is TokenPreVesting {
    uint256 mockTime = 0;

    constructor(address token_) TokenPreVesting(token_) {}

    function setCurrentTime(uint256 _time) external {
        mockTime = _time;
    }

    function getCurrentTime() public view virtual override returns (uint256) {
        return mockTime;
    }
}
