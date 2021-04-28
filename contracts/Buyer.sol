// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity 0.5.12;


import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./BMath.sol";
import "./BPool.sol";
import "./IWETH.sol";

contract Buyer is Ownable, ReentrancyGuard, BMath {
    using SafeERC20 for IERC20;

    address private _weth;
    mapping(address => mapping(address => address)) poolByTokenPair;

    constructor(address weth) public {
        require(weth != address(0));
        _weth = weth;
    }

    function setPool(address token1, address token2, address pool) external onlyOwner {
        require(token1 != address(0));
        require(token2 != address(0));
        require(pool != address(0));
        poolByTokenPair[token1][token2] = pool;
        poolByTokenPair[token2][token1] = pool;
    }

    function calcJoinPoolEther(
        address pool,
        uint poolAmountOut,
        uint slippage
    )
        external
        view
        returns (uint)
    {
        require(pool != address(0));
        require(slippage > 0 && slippage < 100);

        address[] memory poolTokens = BPool(pool).getCurrentTokens();
        uint result = 0;

        for (uint i = 0; i < poolTokens.length; i++) {
            uint tokenAmountInTargetPool = _calcTokenAmountIn(pool, poolAmountOut, poolTokens[i]);
            uint maxPrice = _calcMaxPrice(pool, poolTokens[i], slippage);

            result = badd(result, bmul(maxPrice, tokenAmountInTargetPool));
        }

        return result;
    }

    function joinPool(
        address pool,
        uint poolAmountOut,
        uint slippage
    )
        external
        payable
        nonReentrant
    {
        require(pool != address(0));
        require(slippage > 0 && slippage < 100);

        address[] memory poolTokens = BPool(pool).getCurrentTokens();
        uint[] memory maxAmountsIn;

        IWETH(_weth).deposit.value(msg.value)();

        for (uint i = 0; i < poolTokens.length; i++) {
            uint tokenAmountInTargetPool = _calcTokenAmountIn(pool, poolAmountOut, poolTokens[i]);
            uint maxPrice = _calcMaxPrice(pool, poolTokens[i], slippage);

            maxAmountsIn[i] = tokenAmountInTargetPool;
            IERC20(_weth).approve(
                poolByTokenPair[_weth][poolTokens[i]],
                bmul(maxPrice, tokenAmountInTargetPool)
            );
            BPool(poolByTokenPair[_weth][poolTokens[i]]).swapExactAmountOut(
                _weth,
                bmul(maxPrice, tokenAmountInTargetPool),
                poolTokens[i],
                tokenAmountInTargetPool,
                maxPrice
            );
            IERC20(_weth).approve(poolByTokenPair[_weth][poolTokens[i]], 0);
            IERC20(poolTokens[i]).approve(pool, tokenAmountInTargetPool);
        }

        BPool(pool).joinPool(poolAmountOut, maxAmountsIn);
        IERC20(pool).safeTransfer(msg.sender, poolAmountOut);
        IWETH(_weth).withdraw(IERC20(_weth).balanceOf(address(this)));
        msg.sender.transfer(address(this).balance);
    }

    function _calcTokenAmountIn(
        address pool,
        uint poolAmountOut,
        address poolToken
    )
        internal
        view
        returns (uint)
    {
        // Based on the BPool.joinPool
        BPool bPool = BPool(pool);
        uint poolTotal = bPool.totalSupply();
        uint ratio = bdiv(poolAmountOut, poolTotal);

        require(ratio != 0, "ERR_MATH_APPROX");

        return bmul(ratio, bPool.getBalance(poolToken));
    }

    function _calcMaxPrice(
        address pool,
        address poolToken,
        uint slippage
    )
        internal
        view
        returns (uint)
    {
        BPool bPool = BPool(pool);

        // Spot price - how much of tokenIn you have to pay for one of tokenOut.

        return bdiv(
            bmul(bPool.getSpotPrice(_weth, poolToken), badd(100, slippage)),
            100
        );
    }
}
