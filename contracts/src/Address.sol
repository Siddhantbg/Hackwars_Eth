// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AddressTag is ERC1155, ReentrancyGuard, Ownable {
    struct TagStatus {
        bool isAssigned;
        bool isInvalidated;
    }

    mapping(address => mapping(address => mapping(uint256 => TagStatus))) private tagRecords;
    mapping(uint256 => bytes32) private tagRegistry;

    constructor() ERC1155("Identity") Ownable(msg.sender) {}

    function registerTagTypes(uint256[] calldata identifiers, bytes32[] calldata labels) external onlyOwner {
        uint256 len = identifiers.length;
        for (uint256 i = 0; i < len;) {
            tagRegistry[identifiers[i]] = labels[i];
            unchecked {
                ++i;
            }
        }
    }

    function assignTag(address recipient, uint256 tagId) external nonReentrant {
        TagStatus storage status = tagRecords[msg.sender][recipient][tagId];
        require(!status.isAssigned, "Tag already exists");
        require(tagRegistry[tagId] != 0, "Invalid tag type");

        _mint(recipient, tagId, 1, "");
        status.isAssigned = true;
    }

    function invalidateTag(address recipient, uint256 tagId) external nonReentrant {
        TagStatus storage status = tagRecords[msg.sender][recipient][tagId];
        require(status.isAssigned, "Tag not found");
        require(!status.isInvalidated, "Tag already invalidated");

        _burn(recipient, tagId, 1);
        status.isInvalidated = true;
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data)
        public
        virtual
        override
    {
        require(false, "Transfer restricted");
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(false, "Transfer restricted");
    }
}
