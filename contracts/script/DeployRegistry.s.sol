// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GardenStrategyRegistry.sol";

contract DeployRegistry is Script {
    function run() external {
        // Retrieve private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Begin sending transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        GardenStrategyRegistry registry = new GardenStrategyRegistry();

        // End transaction broadcasting
        vm.stopBroadcast();

        // Log the deployed address
        console.log("GardenStrategyRegistry deployed at:", address(registry));
    }
}
