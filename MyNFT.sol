// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AI Nexus NFT Collection
 * @dev عقد ذكي متكامل لصناعة الـ NFTs مع ميزات التحكم والندرة
 */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NexusNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 public constant MAX_SUPPLY = 10000; // الحد الأقصى للمجموعة
    uint256 public mintPrice = 0.05 ether; // سعر الصك (Mint Price)

    // أحداث لتتبع العمليات
    event NFTMinted(uint256 indexed tokenId, string tokenURI, address owner);

    constructor() ERC721("AI Nexus Collection", "NEXUS") Ownable(msg.sender) {}

    /**
     * @dev وظيفة صك (Mint) NFT جديد
     * @param player عنوان المحفظة التي ستستلم الـ NFT
     * @param tokenURI رابط البيانات الوصفية (JSON) المخزن على IPFS
     */
    function mintNFT(address player, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(_tokenIds < MAX_SUPPLY, "Reached maximum supply");
        require(msg.value >= mintPrice, "Not enough ETH sent");

        _tokenIds++;
        uint256 newItemId = _tokenIds;
        
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTMinted(newItemId, tokenURI, player);

        return newItemId;
    }

    /**
     * @dev تغيير سعر الصك (للمالك فقط)
     */
    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }

    /**
     * @dev سحب الأرباح من العقد (للمالك فقط)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    // وظائف إضافية للحصول على إجمالي العدد
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }
}