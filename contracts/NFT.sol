//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    //auto-increment field for each token
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public artist; // Address to whom royalty will be transfer
    uint256 public royaltyFee; // Royalty fee

    constructor(
        string memory name,
        string memory symbol,
        uint256 _royaltyFee,
        address _artist
    ) ERC721(name, symbol) {
        royaltyFee = _royaltyFee;
        artist = _artist;
    }

    /// @notice create a new token
    /// @param tokenURI : Nft Token Url
    function createToken(string memory tokenURI) public returns (uint256) {
        //sets a new token id for the token to be minted
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        //Change contract on approval for all
        _mint(msg.sender, newItemId); //mints the token
        _setTokenURI(newItemId, tokenURI); //generates the URI

        //retun token iD
        return newItemId;
    }

    function setRoyalityFee(uint256 _royaltyFee) public onlyOwner {
        royaltyFee = _royaltyFee;
    }

    function getRoyalityFee() public view returns (uint256) {
        return royaltyFee;
    }

    function setArtist(address _artist) public onlyOwner {
        artist = _artist;
    }
}
