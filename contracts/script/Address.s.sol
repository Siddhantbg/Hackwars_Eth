// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {AddressTag} from "../src/Address.sol";

contract AddressTagManager is Script {
    AddressTag private immutable tagContract = AddressTag(0xa6a59514Fa27E6eFc1138f64E1F95EE5207FAB84);

    function execute() external {
        bytes32 privKey = bytes32(vm.envUint("PRIVATE_KEY"));
        _executeWithBroadcast(privKey);
    }

    function _executeWithBroadcast(bytes32 key) internal {
        vm.startBroadcast(uint256(key));

        address recipient = 0xbA46528317d2E3Df7cF612AA8b31cd9Aad7900D3;
        uint256 tokenType = 3;
        tagContract.assignTag(recipient, tokenType);

        vm.stopBroadcast();
    }
}
