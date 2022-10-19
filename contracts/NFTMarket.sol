// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NFT.sol";

// interface INft {
//     function royaltyFee() external returns (uint256);
// }

/*  NFT Marketplace
    List NFT, 
    Buy NFT, 
    Offer NFT, 
    Accept offer, 
    Create auction, 
    Bid place,
    & service fee
*/

contract NFTMarketplace is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    address private feeRecipient;
    uint256 marketplaceServiceFee = 1;

    struct ItemStruct {
        uint256 itemId;
        string tokenURI;
        uint256 tokenId;
        address nftAddress;
        uint256 price;
        address payable seller;
        address payable owner;
        string category;
        string genre;
        bool sold;
        address createdBy;
        uint256 updatedAt;
        uint256 createdAt;
    }

    struct ListStruct {
        uint256 itemId;
        uint256 price;
        bool completed;
        address updatedBy;
        address createdBy;
        uint256 updatedAt;
        uint256 createdAt;
    }

    struct UserOfferStruct {
        uint256 itemId;
        address offerer;
        uint256 offerPrice;
        uint256 offerFrom;
        uint256 offerTo;
        uint256 createdAt;
    }

    struct OfferStruct {
        uint256 itemId;
        bool accepted;
        address[] offerers;
        uint256 offerPrice;
        address createdBy;
        uint256 updatedAt;
        uint256 createdAt;
    }

    struct AuctionStruct {
        uint256 itemId;
        uint256 intialPrice;
        uint256 lastBidPrice;
        uint256 currentBidPrice;
        uint256 startTime;
        uint256 endTime;
        address winner;
        bool completed;
        address createdBy;
        uint256 updatedAt;
        uint256 createdAt;
    }

    mapping(uint256 => ItemStruct) private Items;
    mapping(uint256 => ListStruct) private Lists;
    mapping(uint256 => OfferStruct) private Offers;
    mapping(address => UserOfferStruct) private UserOffers;
    mapping(uint256 => AuctionStruct) private Auctions;

    // events
    event ItemEvent(
        uint256 indexed itemId,
        string tokenUri,
        uint256 indexed tokenId,
        uint256 price,
        address indexed nftAddress,
        address seller,
        address owner,
        string category,
        string genre,
        bool sold,
        address createdBy,
        uint256 createdAt
    );

    event ListEvent(
        uint256 indexed itemId,
        uint256 price,
        address seller,
        address owner,
        string status,
        bool completed,
        uint256 createdAt
    );

    event OfferEvent(
        uint256 indexed itemId,
        address seller,
        address owner,
        address offerer,
        uint256 offerPrice,
        uint256 offerFrom,
        uint256 offerTo,
        string status,
        bool accepted,
        uint256 createdAt
    );

    event AuctionEvent(
        uint256 indexed itemId,
        address seller,
        address owner,
        uint256 intialPrice,
        uint256 lastBidPrice,
        uint256 currentBidPrice,
        address winner,
        string status,
        bool completed,
        address createdBy,
        uint256 createdAt
    );


    function createItem(
        address _nftAddress,
        string memory _tokenUri,
        string memory _category,
        string memory _genre
    ) public payable  returns (uint256, uint256) {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        NFT _nftContract = NFT(_nftAddress);
 
        // calling createToken function from NFT.sol contract
        uint256 tokenId = _nftContract.createToken(_tokenUri);

        // transferring nft to msg.sender from address(this)
        _nftContract.transferFrom(address(this), msg.sender, tokenId);

        Items[itemId] = ItemStruct({
            itemId: itemId,
            tokenURI: _tokenUri,
            tokenId: tokenId,
            nftAddress: _nftAddress,
            price: 0,
            seller: payable(address(this)),
            owner: payable(msg.sender),
            category: _category,
            genre: _genre,
            sold: false,
            createdBy: msg.sender,
            updatedAt: block.timestamp,
            createdAt: block.timestamp
        });

        emit ItemEvent(
            itemId,
            _tokenUri,
            tokenId,
            0,
            _nftAddress,
            address(this),
            msg.sender,
            _category,
            _genre,
            false,
            msg.sender,
            block.timestamp
        );
        return (itemId, tokenId);
    }

    // @notice List NFT on Marketplace
    function listItem(
        uint256 _itemId,
        uint256 _price,
        string memory _type,
        uint256 _startTime,
        uint256 _endTime
    ) external {
        NFT nft = NFT(Items[_itemId].nftAddress);
        if (
            keccak256(abi.encodePacked(_type)) == 
            keccak256(abi.encodePacked("timed_auction"))
        ) {
            require(
                _endTime > _startTime,
                "End time should be greater than start time"
            );
            createAuction(_itemId, _price, _startTime, _endTime);
        } else if (
            keccak256(abi.encodePacked(_type)) ==
            keccak256(abi.encodePacked("fixed_price"))
        ) {                
            require(_price > 0, "Price should be greater than zero");
            require(nft.ownerOf(Items[_itemId].tokenId) == msg.sender, "not nft owner");

            Lists[_itemId] = ListStruct({
                itemId: _itemId,
                price: _price,
                completed: false,
                updatedBy: msg.sender,
                createdBy: msg.sender,
                updatedAt: block.timestamp,
                createdAt: block.timestamp
            });

            emit ListEvent(
                _itemId,
                _price,
                msg.sender,
                Items[_itemId].owner,
                "created",
                false,
                block.timestamp
            );
        } else if (
            keccak256(abi.encodePacked(_type)) == 
            keccak256(abi.encodePacked("open_for_bids"))
        ) {                
            createOfferForSale(_itemId);
        } else {
            revert("Enter correct type");
        }
    }

    // @notice Cancel listed NFT
    function cancelListedItem(uint256 _itemId) external  {
        NFT nft = NFT(Items[_itemId].nftAddress);

        require(nft.ownerOf(Items[_itemId].tokenId) == msg.sender, "not listed owner");
        ListStruct memory list = Lists[Items[_itemId].itemId];
        delete Lists[Items[_itemId].itemId]; //delete the storage in the mapping

        emit ListEvent(
            Items[_itemId].itemId,
            list.price,
            msg.sender,
            Items[_itemId].owner,
            "canceled",
            false,
            block.timestamp
        );
    }

    // @notice Buy listed NFT
    function buyItem(uint256 _itemId) external payable  {
        NFT nft = NFT(Items[_itemId].nftAddress);
        require(Items[_itemId].itemId > 0, "Item not found");
        require(msg.value == Lists[_itemId].price, "Invalid price");
        require(!Lists[_itemId].completed, "Item already sold");

        uint256 royaltyFeeValue = nft.royaltyFee();
        require(
            royaltyFeeValue <= 10,
            "Royality fees should be equal or less than 10%! Please contact to collection owner"
        );

        uint256 serviceFee = 0;
        // Transfering service fees to marketplace recipient
        if (marketplaceServiceFee > 0) {
            serviceFee = (Lists[_itemId].price * marketplaceServiceFee) / 100; // MarketPlace Fee 1%
        }

        // Transfering royality fees to NFT owner
        uint256 royaltyFee = 0;
        if (royaltyFeeValue > 0) {
            royaltyFee = (Lists[_itemId].price * royaltyFeeValue) / 100;
        }
        if(royaltyFee > 0) {
            (bool isPaidRoyaltyFee, ) = payable(Items[_itemId].createdBy).call{
                value: royaltyFee
            }("");
            require(isPaidRoyaltyFee, "Royality fee not send to item owner!");
        }

        uint256 remaingPrice = Lists[_itemId].price - serviceFee - royaltyFee; // Remaing balance after sending 10%
        // Sending remainingPrice to NFT seller
        (bool isPaidItemActualAmount, ) = payable(Items[_itemId].owner).call{
            value: remaingPrice
        }("");
        require(isPaidItemActualAmount, "Amount not send to owner!");

        // Transfer NFT to buyer
        nft.transferFrom(Items[_itemId].owner, msg.sender, Items[_itemId].tokenId);
        // calling listItem struct and Event from callListFunction
        callListItem(_itemId);
        // calling Item struct and Event form callItemFunction
        callItem(_itemId, msg.sender, Lists[_itemId].price);
    }

    function createOfferForSale(uint256 _itemId) public {
        require(Items[_itemId].itemId > 0, "Item not created yet!");

        Offers[_itemId].itemId = _itemId;
        Offers[_itemId].accepted = false;
        Offers[_itemId].createdBy = msg.sender;
        Offers[_itemId].updatedAt = block.timestamp;
        Offers[_itemId].createdAt = block.timestamp;

        emit OfferEvent(
            _itemId,
            msg.sender,
            Items[_itemId].owner,
            address(0),
            0,
            0,
            0,
            "initiate",
            false,
            block.timestamp
        );
    }

    // @notice Offer listed NFT
    function createOfferForItem(
        uint256 _itemId,
        uint256 _offerPrice,
        uint256 _offerFrom,
        uint256 _offerTo
    ) public payable {
        require(_offerPrice > 0 && msg.value == _offerPrice, "Offer price should be equal to msg.value and greater than zero");
        require(_offerFrom >= block.timestamp, "Time should be equal and greater than current time!");
        require(_offerTo > _offerFrom, "Offer To should be greater than Offer From");

        UserOffers[msg.sender] = UserOfferStruct({
            itemId: _itemId,
            offerer: msg.sender,
            offerPrice: _offerPrice,
            offerFrom: _offerFrom,
            offerTo: _offerTo,
            createdAt: block.timestamp
        });
        Offers[_itemId].offerers.push(msg.sender);

        emit OfferEvent(
            _itemId,
            Items[_itemId].seller,
            Items[_itemId].owner,
            msg.sender,
            _offerPrice,
            _offerFrom,
            _offerTo,
            "created",
            false,
            block.timestamp
        );
    }

    // @notice Offerer cancel offerring
    function cancelItemFromOffer(uint256 _itemId)
        external
    {
        NFT nft = NFT(Items[_itemId].nftAddress);

        require(nft.ownerOf(Items[_itemId].tokenId) == msg.sender, "not nft owner");
        require(!Offers[_itemId].accepted, "offer already accepted");

        for (uint i = 0; i < Offers[_itemId].offerers.length; i++ ){  
            address offerer = Offers[_itemId].offerers[i];
            if(UserOffers[offerer].itemId > 0) {
                (bool isTransferToOfferes, ) = payable(offerer).call{
                    value: UserOffers[offerer].offerPrice
                }("");
                require(isTransferToOfferes, "Amount not send to the offerers");
            }            
            delete Offers[_itemId].offerers[i];
        }
        delete Offers[_itemId];


        emit OfferEvent(
            _itemId,
            msg.sender,
            Items[_itemId].owner,
            address(0),
            0,
            0,
            0,
            "canceled",
            false,
            block.timestamp
        );
    }

    // @notice listed NFT owner accept offerring
    function acceptOfferForItem(uint256 _itemId, address _offerer)
        external payable
    { 
        NFT nft = NFT(Items[_itemId].nftAddress);

        require(nft.ownerOf(Items[_itemId].tokenId) == msg.sender, "not listed owner");
        require(UserOffers[_offerer].itemId > 0, "Offer is not exist for given offerer!");
        require(!Offers[_itemId].accepted, "offer already accepted");
        uint256 offerPrice = UserOffers[_offerer].offerPrice;

        uint256 royaltyFeeValue = nft.royaltyFee();
        require(royaltyFeeValue <= 10, "Royality fees should be equal or less than 10%!");
        
        // Transfering service fees to marketplace recipient
        uint256 serviceFee = 0; 
        if (marketplaceServiceFee > 0) {
            serviceFee = (offerPrice * marketplaceServiceFee) / 100; // MarketPlace Fee 1%
        }
        uint256 royaltyFee = 0;
        if (royaltyFeeValue > 0) {
            royaltyFee = (offerPrice * royaltyFeeValue) / 100;
        }
        if(royaltyFee > 0) {
            (bool isPaidRoyaltyFee, ) = payable(Items[_itemId].createdBy).call{
                value: royaltyFee
            }("");
            require(isPaidRoyaltyFee, "Royality fee not send to item owner!");
        }
        // Sending remainingPrice to NFT seller
        uint256 remainingPrice = offerPrice - serviceFee - royaltyFee; // Remaing balance after sending 10%
        (bool isPaidItemActualAmount, ) = payable(Items[_itemId].owner).call{
            value: remainingPrice
        }("");
        require(isPaidItemActualAmount, "Amount not send to owner!");
        // Transfer NFT to buyer
        nft.transferFrom(Items[_itemId].owner, _offerer, Items[_itemId].tokenId);


        callItem(_itemId, _offerer, offerPrice); // callItem function
        for (uint i = 0; i < Offers[_itemId].offerers.length; i++ ){
            address offerer = Offers[_itemId].offerers[i];
            // UserOfferStruct memory refundOffer = UserOffers[offerer];            
            if (offerer != _offerer && UserOffers[offerer].itemId > 0) {
                (bool isTransferToOfferes, ) = payable(offerer).call{
                    value: UserOffers[offerer].offerPrice
                }("");
                require(isTransferToOfferes, "Amount not send to the offerer");
            }
            delete Offers[_itemId].offerers[i];      
        }
        uint _offerFrom = UserOffers[_offerer].offerFrom;
        uint _offerTo = UserOffers[_offerer].offerTo;
        uint _createdAt = Offers[_itemId].createdAt;
        Offers[_itemId].accepted = true;
        emit OfferEvent (
            _itemId,
            Items[_itemId].owner,
            _offerer,
            _offerer,
            offerPrice,
            _offerFrom,
            _offerTo,
            "accepted",
            true,
            _createdAt

        );
    }

    // @notice Create autcion
    function createAuction(
        uint256 _itemId,
        uint256 _minBid,
        uint256 _startTime,
        uint256 _endTime
    ) internal {
        NFT nft = NFT(Items[_itemId].nftAddress);
        require(nft.ownerOf(Items[_itemId].tokenId) == msg.sender, "not nft owner");
        require(
            _startTime <= block.timestamp && _endTime > _startTime,
            " End time should be greater than start time"
        );

        Auctions[_itemId] = AuctionStruct({
            itemId: _itemId,
            intialPrice: _minBid,
            lastBidPrice: _minBid,
            currentBidPrice: _minBid,
            startTime: _startTime,
            endTime: _endTime,
            winner: address(this),
            completed: false,
            createdBy: msg.sender,
            updatedAt: block.timestamp,
            createdAt: block.timestamp
        });

        emit AuctionEvent(
            Items[_itemId].itemId,
            Items[_itemId].seller,
            Items[_itemId].owner,
            _minBid,
            _minBid,
            _minBid,
            address(this),
            "created",
            false,
            msg.sender,
            block.timestamp
        );
    }

    // @notice Cancel auction
    function cancelAuction(uint256 _itemId) external  {
        NFT nft = NFT(Items[_itemId].nftAddress);
        require(nft.ownerOf(Items[_itemId].tokenId) == msg.sender, "not nft owner");
        require(Auctions[_itemId].itemId > 0, "Auction not found!");
        require(block.timestamp <= Auctions[_itemId].endTime, "Auction is already stop!");
        require(!Auctions[_itemId].completed, "Auction already completed!");

        emit AuctionEvent(
            Items[_itemId].itemId,
            msg.sender,
            Items[_itemId].owner,
            Auctions[_itemId].intialPrice,
            Auctions[_itemId].lastBidPrice,
            Auctions[_itemId].currentBidPrice,
            address(0),
            "canceled",
            false,
            msg.sender,
            block.timestamp
        );
        delete Auctions[_itemId];
    }

    // @notice Bid place auction
    function bidPlace(uint256 _itemId, uint256 _bidPrice)
        external payable
    {
        NFT nft = NFT(Items[_itemId].nftAddress);
        require(Auctions[_itemId].itemId > 0, "Auction not found!");
        require(nft.ownerOf(Items[_itemId].tokenId) != msg.sender, "You are aleady a owner of this item");
        require(block.timestamp <= Auctions[_itemId].endTime, "Auction time expired!");
        require(msg.value == _bidPrice, "Invalid price");
        
        require(_bidPrice > Auctions[_itemId].currentBidPrice, "Bid price should be greater than current price!");
        require(!Auctions[_itemId].completed, "Auction already completed!");
        require(Auctions[_itemId].winner != msg.sender, "You are already a higer bidder!");

        // return amount to last bidder
        if (Auctions[_itemId].winner != address(this)) {
            (bool isPaidMPFee, ) = payable(Auctions[_itemId].winner).call{
                value: Auctions[_itemId].currentBidPrice
            }("");
            require(isPaidMPFee, "Amount not returned to lastBidder");
        }

        Auctions[_itemId].lastBidPrice = Auctions[_itemId].currentBidPrice;
        Auctions[_itemId].currentBidPrice = _bidPrice;
        Auctions[_itemId].updatedAt = block.timestamp;
        Auctions[_itemId].winner = msg.sender;

        emit AuctionEvent(
            _itemId,
            Items[_itemId].seller,
            Items[_itemId].owner,
            Auctions[_itemId].intialPrice,
            Auctions[_itemId].lastBidPrice,
            _bidPrice,
            msg.sender,
            "place_bid",
            false,
            msg.sender,
            block.timestamp
        );
    }

    // @notice Result auction, can call by auction creator, heighest bidder, or marketplace owner only!
    function transferItemAuction(uint256 _itemId)
        external payable
    {
        NFT nft = NFT(Items[_itemId].nftAddress);
        require(Auctions[_itemId].itemId > 0, "Auction not found!");
        require(nft.ownerOf(Items[_itemId].tokenId) == msg.sender, "You are not a owner of this item");
        require(block.timestamp > Auctions[_itemId].endTime, "Auction not expired yet!");
        require(!Auctions[_itemId].completed, "Auction already completed!");
        require(Auctions[_itemId].winner != msg.sender, "Sorry! You cannot be the winner of this item");
        
        uint256 royaltyFeeValue = nft.royaltyFee();
        require(royaltyFeeValue <= 10, "Royality fees should be equal or less than 10%!");
        Auctions[_itemId].completed = true;
        uint256 itemPrice = Auctions[_itemId].currentBidPrice;

        // Transfering service fees to marketplace recipient
        uint256 serviceFee = 0;
        if (marketplaceServiceFee > 0) {
            serviceFee = (itemPrice * marketplaceServiceFee) / 100; // MarketPlace Fee 1%            
        }
        // Transfering royality fees to NFT owner
        uint256 royaltyFee = 0;
        if (royaltyFeeValue > 0) {
            royaltyFee = (itemPrice * royaltyFeeValue) / 100;
        }
        if(royaltyFee > 0) {
            (bool isPaidRoyaltyFee, ) = payable(Items[_itemId].createdBy).call{
                value: royaltyFee
            }("");
            require(isPaidRoyaltyFee, "Royality fee not send to item owner!");
        }
        
        uint256 remaingPrice = itemPrice - serviceFee - royaltyFee; // Remaing balance after sending 10%
        // Sending remainingPrice to NFT seller
        (bool isPaidItemActualAmount, ) = payable(Items[_itemId].owner).call{
            value: remaingPrice
        }("");
        require(isPaidItemActualAmount, "Amount not send to owner!");

        // Transfer NFT to buyer
        nft.transferFrom(Items[_itemId].owner, Auctions[_itemId].winner, Items[_itemId].tokenId);

        // calling Item struct and Event form callItemFunction
        callListItem(_itemId);
        callItem(_itemId, Auctions[_itemId].winner, itemPrice);

        uint _intialPrice = Auctions[_itemId].intialPrice;
        uint _lastBidPrice = Auctions[_itemId].lastBidPrice;
        uint _currentBidPrice = Auctions[_itemId].currentBidPrice;
        address _winner = Auctions[_itemId].winner;
        emit AuctionEvent(
            _itemId,
            msg.sender,
            _winner,
            _intialPrice,
            _lastBidPrice,
            _currentBidPrice,
            _winner,
            "completed",
            true,
            msg.sender,
            block.timestamp
        );
    }


    function getListedItem(uint256 _itemId)
        public
        view
        returns (ListStruct memory)
    {
        return Lists[_itemId];
    }

    function getAuctionItem(uint256 _itemId)
        public
        view
        returns (AuctionStruct memory)
    {
        return Auctions[_itemId];
    }

    function getOfferItem(uint256 _itemId)
        public
        view
        returns (OfferStruct memory)
    {
        return Offers[_itemId];
    }

    function getUserOffer(address user) 
        public
        view
        returns(UserOfferStruct memory)
    {
        return UserOffers[user];
    }

    function setMarketplaceRecipient(address _feeRecipient) public onlyOwner {
        require(_feeRecipient != address(0), "can't be 0 address");
        feeRecipient = _feeRecipient;
    }

    // Return marketplace fee
    function getmarketplaceServiceFee() public view returns (uint256) {
        return marketplaceServiceFee;
    }

    // Set marketplace fee
    function setmarketplaceServiceFee(uint256 _fee) public onlyOwner {
        require(_fee >= 0 && _fee <= 10, "Service fee should be equal and less than 10");
        marketplaceServiceFee = _fee;
    }

    function callItem(uint256 _itemId, address _owner, uint _price) private  {
        require(Items[_itemId].itemId > 0, "Item is not found!");

        Items[_itemId] = ItemStruct(
            _itemId,
            Items[_itemId].tokenURI,
            Items[_itemId].tokenId,
            Items[_itemId].nftAddress,
            _price,
            payable(Items[_itemId].owner),
            payable(_owner),
            Items[_itemId].category,
            Items[_itemId].genre,
            true,
            Items[_itemId].createdBy,
            block.timestamp,
            Items[_itemId].createdAt
        );

        emit ItemEvent(
            Items[_itemId].itemId,
            Items[_itemId].tokenURI,
            Items[_itemId].tokenId,
            _price,
            Items[_itemId].nftAddress,
            Items[_itemId].owner,
            _owner,
            Items[_itemId].category,
            Items[_itemId].genre,
            true,
            Items[_itemId].createdBy,
            block.timestamp
        );
    }

    function callListItem(uint256 _itemId) private {
        uint256 itemId = Lists[_itemId].itemId;

        require(_itemId > 0, "Item is not listed!");
        Lists[itemId] = ListStruct(
            itemId,
            Lists[_itemId].price,
            true,
            msg.sender,
            Items[_itemId].createdBy,
            block.timestamp,
            Items[_itemId].createdAt
        );

        emit ListEvent(
            itemId,
            Lists[_itemId].price,
            msg.sender,
            msg.sender,
            "bought",
            true,
            block.timestamp
        );
    }

    function getcontractBalance() public view onlyOwner returns(uint){
        return address(this).balance;
    }

}