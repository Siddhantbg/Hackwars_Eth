// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {AddressTag} from "../src/Address.sol";

contract TokenTest is Test {
    AddressTag private token;
    address constant OWNER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address constant USER = 0xde90ee371137764d8Ff0D3F98E8D5605D4A646e2;

    bytes32[] private tagLabels;
    uint256[] private tagIds;

    function setUp() public {
        vm.prank(OWNER);
        token = new AddressTag();
        _initializeTagArrays();
    }

    function _initializeTagArrays() private {
        tagIds = new uint256[](4);
        tagLabels = new bytes32[](4);

        string[4] memory labels = [
            "whale trader",
            "malicious actor",
            "arbitrage trader",
            "nft collector"
        ];

        for (uint i = 0; i < 4; i++) {
            tagIds[i] = i;
            tagLabels[i] = keccak256(bytes(labels[i]));
        }
    }

    function testTagTypeRegistry() public {
        vm.startPrank(OWNER);
        token.registerTagTypes(tagIds, tagLabels);
        // assertEq(token.tagRegistry(0), tagLabels[0]);
        vm.stopPrank();
    }

    function testMinting() public {
        testTagTypeRegistry();
        vm.startPrank(OWNER);
        token.assignTag(USER, 0);
        token.assignTag(USER, 1);
        vm.stopPrank();
    }

    function testRevocation() public {
        testMinting();
        vm.startPrank(OWNER);
        token.invalidateTag(USER, 0);
        token.invalidateTag(USER, 1);
        vm.stopPrank();
    }

    function testTransfer() public {
        testMinting();
        vm.prank(USER);
        vm.expectRevert("Transfer restricted");
        token.safeTransferFrom(USER, OWNER, 0, 1, "");
    }
}
