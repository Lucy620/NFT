// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";



contract MarketPlace{
   
    uint256 private itemId = 0;
    uint256 private recordId = 0;
    uint256 private tradeId = 0;
    address payable platformOwner;
    uint256 private restValue = 0;


    struct TradeItem {
        uint256 _itemId;
        uint256 _tokenId;
        uint256 initialSupply;
        uint256 publicSupply;
        address token;    
        address creator;
        uint256 price;
        string uri;
    }

    struct Trade {
        uint256 _tradeId;
        uint256 _tokenId;
        address poster;
        address token;  
        uint256 price;
        uint256 amount;
        string uri;
        bool auction;
    }

    struct History{
        uint256 _recordId;
        uint256 _tokenId;
        address seller;
        address buyer;
        uint256 price;
        uint256 amount;
        string time;
        string des;
    }

    struct Auction{
        uint256 _tradeId;
        address beneficiary;
        uint256 auctionStart;
        uint256 biddingTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    mapping(uint256 => TradeItem) public TradeItems;
    mapping(uint256 => Trade) public trades;
    mapping(uint256 => History) public history;
    mapping(uint256 => Auction) public auctions;


    //event NftBought(address _seller, address _buyer, uint256 _price);
    //event TradeStatusChange(uint256 _tradeId, bytes32 _status);

    constructor () {
        platformOwner = payable(msg.sender);
    }

    function getAllTokens() public view returns (Trade[] memory) {
        uint itemCount = tradeId;
        uint unsoldItemCount = 0;
        for(uint256 i = 0;i < itemCount;i++){
            if(trades[i + 1].amount > 0){               
                 unsoldItemCount += 1;                            
            }
        }
        
        Trade[] memory res = new Trade[](unsoldItemCount);
        uint256 counter = 0;
        for (uint256 i = 0; i < itemCount; i++) { 
            if(trades[i + 1].amount > 0){
                
                res[counter] = trades[i+1];
                counter++; 
                
                
            }                                   
        }
        
        return res;
    }

    function getWinTokens(address sender) public view returns (Trade[] memory){
        uint itemCount = tradeId;
        uint Count = 0;

        for(uint256 i = 0;i < itemCount;i++){
            if(trades[i + 1].auction == true && auctions[i+1].ended == false ){
                if(auctions[i+1].highestBidder == sender){
                    Count += 1;
                }
                if(auctions[i+1].highestBidder == address(0) && auctions[i+1].beneficiary == sender){
                    Count += 1;
                }
            }  
  
        }
        
        Trade[] memory res = new Trade[](Count);
        uint256 counter = 0;
        for (uint256 i = 0; i < itemCount; i++) { 
            if(trades[i + 1].auction == true && auctions[i+1].ended == false){
                if(auctions[i+1].highestBidder == sender){
                    res[counter] = trades[i+1];
                    counter++; 
                }
                if(auctions[i+1].highestBidder == address(0) && auctions[i+1].beneficiary == sender){
                    res[counter] = trades[i+1];
                    counter++; 
                }
            }                                          
        }
        
        return res;

    }


    function getSellingTokens(address sender) public view returns (Trade[] memory) {
        uint itemCount = tradeId;
        uint Count = 0;
        for(uint256 i = 0;i < itemCount;i++){
            if(trades[i + 1].poster == sender){
                Count += 1;
            }
        }
        
        Trade[] memory res = new Trade[](Count);
        uint256 counter = 0;
        for (uint256 i = 0; i < itemCount; i++) { 
            if(trades[i + 1].poster == sender){
                res[counter] = trades[i+1];
                counter++;  
            }                                   
        }
        
        return res;
    }

    function changePrice(uint256 _tradeId, uint256 _price, string memory time) public {
        Trade memory trade = trades[_tradeId];
        require(msg.sender == trade.poster, "Not the owner");
        trades[_tradeId].price = _price;
        recordId+=1;
        history[recordId]= History({
            _recordId: recordId,
            _tokenId: trade._tokenId,
            seller: trade.poster,
            buyer: address(0),
            price: _price,
            amount: trade.amount,
            time: time,
            des: "change price"
        });    
        
    }

    /* Returns onlyl items that a user has purchased */
    function getMyTokens(address sender)
        public
        view
        returns (TradeItem[] memory)
    {
        uint256 totalItemCount = itemId;
        uint itemCount = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            uint256 balance = IERC1155(TradeItems[i+1].token).balanceOf(sender,i+1);
            if(balance>0){           
                itemCount += 1;
              
            }
        }
        
        TradeItem[] memory result = new TradeItem[](itemCount);

        uint256 resultIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {    
                uint256 balance = IERC1155(TradeItems[i+1].token).balanceOf(sender,i+1);
                if (balance>0) {        
                    result[resultIndex] = TradeItems[i+1];
                    resultIndex++;
                                      
                }           
        }
        return result;
    }

    /* Returns only items a user has created */
    function fetchItemsCreated(address sender) public view returns (TradeItem[] memory) {
        uint totalItemCount = itemId;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (TradeItems[i + 1].creator == sender ) 
            {  
                itemCount += 1;
            }
        }

        TradeItem[] memory items = new TradeItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (TradeItems[i + 1].creator == sender ) 
            { 
                items[currentIndex] = TradeItems[i+1];
                currentIndex += 1;                            
            }
        }
        
        return items;
    }

    
    function getNumber() public view returns (uint256){
        return itemId;
    }


    function listToken(address token, uint256 _tokenId, uint256 amount, string memory uri, string memory time) public returns(uint256){

        itemId += 1 ;

        TradeItems[itemId] = TradeItem({
          _itemId: itemId,
          _tokenId: _tokenId,
          initialSupply: amount,
          publicSupply: 0,
          token: token,
          creator: msg.sender,
          price: 0,
          uri: uri
        });

        recordId+=1;
        history[recordId]= History({
            _recordId: recordId,
            _tokenId: itemId,
            seller: msg.sender,
            buyer: address(0),
            price: 0,
            amount: amount,
            time: time,
            des: "created"
        });
     
        
        return itemId;

    }

    function getHistory(uint256 id) public view returns (History[] memory){
        uint itemCount = recordId;
        uint count = 0;
        for(uint256 i = 0;i < itemCount;i++){
            if(history[i + 1]._tokenId == id){
                count += 1;
            }
        }
        
        History[] memory res = new History[](count);
        uint256 counter = 0;
        for (uint256 i = 0; i < itemCount; i++) { 
            if(history[i + 1]._tokenId == id){
                res[counter] = history[i+1];
                counter++;  
            }                                   
        }
        return res;
    }

    function getAuction(uint256 id) public view returns (Auction memory){  
        
        return auctions[id];
        
    }

    function getInfo(uint256 id) public view returns (Trade memory){
       
        return trades[id];
    }

    function publicToAll(uint256 _itemId, uint256 _price, uint256 amount, bool _auction, uint256 _bidTime) public {
        TradeItem memory token = TradeItems[_itemId];
        uint256 balance = IERC1155(TradeItems[_itemId].token).balanceOf(msg.sender,_itemId);
        require(amount <= balance, "Not enough supply");

        
        tradeId += 1;
        trades[tradeId] = Trade({
          _tradeId: tradeId,
          _tokenId: token._tokenId,
          poster: msg.sender,
          token: token.token,
          price: _price * 1 ether,
          amount: amount,
          uri: token.uri,
          auction: _auction
        });

        if(_auction == true){
            auctions[tradeId] = Auction({
            _tradeId: tradeId,
            beneficiary: msg.sender,
            auctionStart: block.timestamp,
            biddingTime: _bidTime,
            highestBidder: address(0),
            highestBid: 0,
            ended: false
          });
               
        }

        IERC1155(token.token).safeTransferFrom(msg.sender, address(this), token._tokenId, amount,"");
        
    }


    function buy(uint256 _tradeId, string memory time, uint256 _amount) public payable {
       
        Trade memory trade = trades[_tradeId];
        
        require(_amount <= trade.amount, "Not enough supply");
        //require(trade.poster != msg.sender, "Seller not to be buyer");

        recordId+=1;
        history[recordId]= History({
            _recordId: recordId,
            _tokenId: trade._tokenId,
            seller: trade.poster,
            buyer: msg.sender,
            price: trade.price,
            amount: _amount,
            time: time,
            des: "transaction"
        });
           
        IERC1155(trade.token).safeTransferFrom(address(this), msg.sender, trade._tokenId, _amount,"");
        trades[_tradeId].amount = trades[_tradeId].amount - _amount;

        payable(trade.poster).transfer(msg.value);

        if(trades[_tradeId].amount == 0){
            trades[_tradeId].poster = address(0);
        }

        
    } 

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }


    function bid(uint256 _tradeId, string memory time) public payable{
        Auction memory auction = auctions[_tradeId];
        Trade memory trade = trades[_tradeId];
        
        require(block.timestamp < auction.biddingTime, "over time");
        require(msg.value * 1 ether > auction.highestBid, "Not enough price");

        recordId+=1;
        history[recordId]= History({
            _recordId: recordId,
            _tokenId: trade._tokenId,
            seller: msg.sender,
            buyer: address(0),
            price: msg.value * 1 ether,
            amount: 1,
            time: time,
            des: "place bid"
        });

        trades[_tradeId].price = msg.value ;
    
        auctions[_tradeId].highestBidder = msg.sender;
        auctions[_tradeId].highestBid = msg.value * 1 ether ;
        
  }

  function auctionEnd(uint256 _tradeId, string memory _time)public payable {
    Auction memory auction = auctions[_tradeId];
    Trade memory trade = trades[_tradeId];
    //require(block.timestamp >= auction.biddingTime, "auction not end");
    require(msg.value == auction.highestBid, "Not correct price");
    require(msg.sender == auction.highestBidder, "correct highestBidder");

    
    IERC1155(trade.token).safeTransferFrom(address(this), auction.highestBidder, trade._tokenId, 1,"");
    payable(auction.beneficiary).transfer(msg.value);
   
    recordId+=1;
    history[recordId]= History({
            _recordId: recordId,
            _tokenId: trade._tokenId,
            seller: trade.poster,
            buyer: msg.sender,
            price: trade.price,
            amount: 1,
            time: _time,
            des: "transaction"
    });
    auctions[_tradeId].ended = true;
    trades[_tradeId].amount = 0;
    trades[_tradeId].poster = address(0);
  }

  function refund(uint256 _tradeId, string memory _time)public {
      Trade memory trade = trades[_tradeId];
      IERC1155(trade.token).safeTransferFrom(address(this), trade.poster, trade._tokenId, 1,"");
      recordId+=1;
    history[recordId]= History({
            _recordId: recordId,
            _tokenId: trade._tokenId,
            seller: address(0),
            buyer: msg.sender,
            price: trade.price,
            amount: 1,
            time: _time,
            des: "refund"
    });
      auctions[_tradeId].ended = true;
      trades[_tradeId].amount = 0;
      trades[_tradeId].poster = address(0);

  }

  //fallback() external payable{}

  function pay()public payable{ }

}

