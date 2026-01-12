// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Nexus Lazy Minting Contract
 * @dev عقد يتيح للمبدع توقيع الـ NFT دون دف غاز، والمشتري هو من يدفع عند الصك
 */
contract LazyNFT is ERC721URIStorage, EIP712, Ownable {
    using ECDSA for bytes32;

    string private constant SIGNING_DOMAIN = "Nexus-LazyMint";
    string private constant SIGNATURE_VERSION = "1";

    constructor() 
        ERC721("Nexus Lazy Assets", "LAZY") 
        EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) 
        Ownable(msg.sender)
    {}

    struct NFTVoucher {
        uint256 minPrice;
        string uri;
        bytes signature;
    }

    /**
     * @dev وظيفة الشراء والصك الفعلي (يدفعها المشتري)
     */
    function redeem(address redeemer, NFTVoucher calldata voucher) public payable returns (uint256) {
        address signer = _verify(voucher);

        // التأكد من أن الموقع هو مالك العقد (أو مسموح له)
        require(signer == owner(), "Signature invalid or unauthorized");
        require(msg.value >= voucher.minPrice, "Insufficient funds sent");

        uint256 tokenId = uint256(keccak256(abi.encodePacked(voucher.uri)));
        
        _mint(redeemer, tokenId);
        _setTokenURI(tokenId, voucher.uri);

        // تحويل الأموال للمبدع
        payable(signer).transfer(msg.value);

        return tokenId;
    }

    function _verify(NFTVoucher calldata voucher) internal view returns (address) {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("NFTVoucher(uint256 minPrice,string uri)"),
            voucher.minPrice,
            keccak256(bytes(voucher.uri))
        )));
        return digest.recover(voucher.signature);
    }
}