// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GardenStrategyRegistry} from "../src/GardenStrategyRegistry.sol";

import "forge-std/Test.sol";

contract GardenStrategyRegistryTest is Test {
    GardenStrategyRegistry public registry;
    address user1 = address(0x1);
    address user2 = address(0x2);

    function setUp() public {
        registry = new GardenStrategyRegistry();
    }

    function test_createStrategy() public {
        vm.prank(user1);
        uint256 id = registry.createStrategy(
            "eth-usdc",
            3000e6,  // lowerBound scaled
            3500e6,  // upperBound scaled
            GardenStrategyRegistry.RiskLevel.Medium,
            "deploy"
        );
        assertEq(id, 1);

        GardenStrategyRegistry.Strategy memory s = registry.getStrategy(id);
        assertEq(s.owner, user1);
        assertEq(keccak256(bytes(s.poolId)), keccak256(bytes("eth-usdc")));
        assertEq(s.lowerBound, 3000e6);
        assertEq(s.upperBound, 3500e6);
        assertEq(uint(s.status), uint(GardenStrategyRegistry.Status.Active));
    }

    function test_closeStrategy() public {
        vm.prank(user1);
        uint256 id = registry.createStrategy("eth-usdc", 3000e6, 3500e6, GardenStrategyRegistry.RiskLevel.Low, "deploy");

        vm.prank(user1);
        registry.closeStrategy(id);

        GardenStrategyRegistry.Strategy memory s = registry.getStrategy(id);
        assertEq(uint(s.status), uint(GardenStrategyRegistry.Status.Closed));
    }

    function test_closeStrategy_revert_notOwner() public {
        vm.prank(user1);
        uint256 id = registry.createStrategy("eth-usdc", 3000e6, 3500e6, GardenStrategyRegistry.RiskLevel.Low, "deploy");

        vm.prank(user2);
        vm.expectRevert("Not strategy owner");
        registry.closeStrategy(id);
    }

    function test_updateStrategy() public {
        vm.prank(user1);
        uint256 id = registry.createStrategy("wbtc-eth", 17e6, 20e6, GardenStrategyRegistry.RiskLevel.High, "deploy");

        vm.prank(user1);
        registry.updateStrategy(id, 16e6, 21e6, "widen", GardenStrategyRegistry.Status.Active);

        GardenStrategyRegistry.Strategy memory s = registry.getStrategy(id);
        assertEq(s.lowerBound, 16e6);
        assertEq(s.upperBound, 21e6);
        assertEq(keccak256(bytes(s.recommendedAction)), keccak256(bytes("widen")));
    }

    function test_getStrategiesByOwner() public {
        vm.startPrank(user1);
        registry.createStrategy("eth-usdc", 3000e6, 3500e6, GardenStrategyRegistry.RiskLevel.Medium, "deploy");
        registry.createStrategy("okb-usdc", 50e6, 55e6, GardenStrategyRegistry.RiskLevel.Medium, "deploy");
        vm.stopPrank();

        uint256[] memory ids = registry.getStrategiesByOwner(user1);
        assertEq(ids.length, 2);
        assertEq(ids[0], 1);
        assertEq(ids[1], 2);
    }

    function test_getStrategy_revert_nonexistent() public {
        vm.expectRevert("Strategy does not exist");
        registry.getStrategy(999);
    }

    function test_updateStrategy_revert_closed() public {
        vm.prank(user1);
        uint256 id = registry.createStrategy("eth-usdc", 3000e6, 3500e6, GardenStrategyRegistry.RiskLevel.Low, "deploy");

        vm.prank(user1);
        registry.closeStrategy(id);

        vm.prank(user1);
        vm.expectRevert("Strategy already closed");
        registry.updateStrategy(id, 2900e6, 3600e6, "rebalance", GardenStrategyRegistry.Status.Active);
    }
}
