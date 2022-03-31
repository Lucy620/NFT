/* eslint-disable */
import React from 'react';
import { useEffect, useState, useRef } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";
// import { Table } from 'reactstrap';
import { useParams } from "react-router-dom";
import moment from 'moment';
import Countdown from 'react-countdown';
import { Link } from "react-router-dom";
import amountIcon from '../images/amount.png'
import ehtIcon from '../images/eht.png'
import { Button , Table, Modal ,InputNumber ,Form } from 'antd';

const DetailPage = () => {;
    const [record, setRecord] = useState([]);
    const [auction, setAuction] = useState([]);
    const [nft, setNFT] = useState([]);
    const blockchain = useSelector((state) => state.blockchain);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { tokenId, tradeId } = useParams();  
    const endDate = moment(parseInt(auction.biddingTime)).format("YYYY-MM-DD HH:mm:ss");
    const [auctionButton, setButton1] = useState(false);
    const [refundButton, setButton2] = useState(false);
	const [bidButton, setBidButton] = useState(true);
 
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose1 = () => {
	 form.resetFields();
	 setShow1(false);
  };
  const handleShow1 = () => setShow1(true);

  const handleClose2 = () => {
	  form.resetFields();
	  setShow2(false)
  };
  const handleShow2 = () => setShow2(true);
  const [processingID, setID] = useState(0);
  const [processingPrice, setPrice] = useState(0);

 const [form] = Form.useForm();
 const formItemLayout = {
 	labelCol: {
 	   xs: { span: 24 },
 	   sm: { span: 8 },
 	},
 	wrapperCol: {
 	   xs: { span: 24 },
 	   sm: { span: 14 },
 	},
 };
		
	const columns = [
	  {
	    title: '#',
	    dataIndex: 'key',
	    key: 'key',
	  },
	  {
	    title: 'From',
	    dataIndex: 'seller',
	    key: 'seller',
	  },
	  {
	    title: 'To',
	    dataIndex: 'buyer',
	    key: 'buyer',
	  },
	  {
	    title: 'Description',
	    dataIndex: 'des',
	    key: 'des',
	  },
	  {
	    title: 'Price',
	    dataIndex: 'price',
	    key: 'price',
	  },
	  {
	    title: 'Amount',
	    dataIndex: 'amount',
	    key: 'amount',
	  },
	  {
	    title: 'Time',
	    dataIndex: 'time',
	    key: 'time',
	  }
	];

// Random component
const Completionist = () => <span>Auction end!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
	setBidButton(false);
    if(blockchain.web3.utils.toChecksumAddress(blockchain.account) == auction.highestBidder){
      setButton1(true);
    }
    
    if(blockchain.web3.utils.toChecksumAddress(blockchain.account) == auction.beneficiary && auction.highestBidder == 0){
      setButton2(true);
    }   

    return <Completionist />;
  } else {
    // Render a countdown
    return <span>{hours} Hours : {minutes} Minutes : {seconds} Seconds</span>;
  }
};

    const fetchNFT = async () => {
        setRecord([]);
        // setNFT([]);
        setLoading(true);
        setError(false);
        try {
          const nftInfo = await blockchain.MarketPlace.methods.getInfo(tradeId).call();
    
          await fetch(nftInfo.uri).then((response) => response.json()).then((metaData) => {
			var ether_price = blockchain.web3.utils.fromWei(nftInfo.price,'ether');
            setNFT([
              { id:nftInfo._tradeId, metaData:metaData, poster:nftInfo.poster, price:ether_price, amount:nftInfo.amount, auctionType:nftInfo.auction}
            ]);
          }).catch((err) => {
            console.log(err);
          });
          console.log(nftInfo.auction);

          const result = await blockchain.MarketPlace.methods.getHistory(tokenId).call();
		  const newArray = result.map((item ,index)=> {
		    return Object.assign({}, item, { key: index + 1 },{price : blockchain.web3.utils.fromWei(item['price'],'ether') + ' ETH'});
		  });
		  console.log(newArray)
          await setRecord(newArray);
          
        } catch (error) {
          console.log(error);
          setError(true);
        }
        setLoading(false);
       
        
      };

    const fetchAuction = async () => {            
        setAuction([]);         
        try {             
            const auctionInfo = await blockchain.MarketPlace.methods.getAuction(tradeId).call();
            setAuction(auctionInfo);
            console.log(auctionInfo); 
            console.log(Date.now());   

            if(Date.now() > auctionInfo.biddingTime){

            if(blockchain.web3.utils.toChecksumAddress(blockchain.account) == auctionInfo.highestBidder){
              setButton1(true);
            }
            
            if(blockchain.web3.utils.toChecksumAddress(blockchain.account) == auctionInfo.beneficiary && auctionInfo.highestBidder == 0){
              setButton2(true);
            }   
          }

        } catch (error) {
          console.log(error);         
        }

      
    };

    const auctionEnd = (_tradeId, _highestBidder, _highestBid) =>{
      let time = moment().format('YYYY-MM-DD HH:mm:ss');
      blockchain.MarketPlace.methods.auctionEnd(_tradeId, time)
     .send({from: blockchain.account, value: _highestBid})
     .once("error", (err) => {
	  alert('failed!')	
      console.log(err);
      setButton1(true);
     }).then(() => {
	  alert('success!')	 
      fetchAuction();
      console.log('Auction End!');
    })
    };

    const refund = (_tradeId) =>{
      let time = moment().format('YYYY-MM-DD HH:mm:ss');
      blockchain.MarketPlace.methods.refund(_tradeId, time)
     .send({from: blockchain.account})
     .once("error", (err) => {
	  alert('failed!');
      console.log(err);
      setButton2(true);
     }).then(() => {
	  alert('success!')	; 
      fetchAuction();
      console.log('Refund!');
    })

    };

    const buyToken = async(tradeId, price,amount) => {  
      let time = moment().format('YYYY-MM-DD HH:mm:ss');  
      if(blockchain.web3.utils.fromWei(balance,'ether') > blockchain.web3.utils.fromWei(price,'ether')){

		blockchain.MarketPlace.methods.buy(tradeId, time, amount)
		 .send({from: blockchain.account, value: price*amount})
		 .once("error", (err) => {
			alert('failed!');
		  console.log(err);
		 }).then(() => {
		  console.log('Token sold!');
		  dispatch(fetchData(blockchain.account));
		  alert('Success!');	  
		  fetchMetaDataForNFTS();
		})
	
		}else{
			alert("Not enough balance")
		}  
	
      
     
     };
  
     const bidToken = async(tradeId, price) => {  
      let time = moment().format('YYYY-MM-DD HH:mm:ss');  
	  var balance = await blockchain.web3.eth.getBalance(blockchain.account);
      if(price > blockchain.web3.utils.toWei(processingPrice.toString(),'ether')){	
		  	
		if(blockchain.web3.utils.fromWei(balance,'ether') > blockchain.web3.utils.fromWei(price,'ether')){
			blockchain.MarketPlace.methods.bid(tradeId, time, price)
			.send({from: blockchain.account})
			.once("error", (err) => {
				alert('failed!');
				console.log(err);
			   }).then(() => {
				console.log('Place Bid!');
				alert('success!');	
			  })
     
		}else{
			alert("Not enough balance")
		}
	 

	} else{
		alert("The price not over current highest bid ")
	}
      
     
    };
  


    useEffect(() => {
      console.log(tokenId);
      console.log(tradeId);   
      fetchNFT();  
    }, []);

    useEffect(()=>{
      fetchAuction();    
    },[blockchain.account]);
    
    return (  
    <s.Screen>
      {blockchain.account === "" || blockchain.nft === null || blockchain.MarketPlace === null  ? 
      (<></>)
      :
      (
        <>
     
        {nft.map((item,index) =>(
           <s.Container key={index}>
           <div style={{minHeight:'600px'}}>
			   <div className="border" style={{marginLeft:"25px",marginTop:"24px"}}>
				   <s.img style={{width:'500px'}} src={item.metaData.image}></s.img>           
			   </div>  
           </div>
           <s.rightBox className="top24" ai={"right"}>
			<div style={{width:'500px'}}>
				<div className="title">{item.metaData.name}</div>
				<div className="top8 size12 italic">#{item.id}</div>
				<div className="top12 size12 color5">Owned by <span className="color-blue bold">{item.poster}</span></div>
				<div className="top8 flex">
					<img src={amountIcon} className="icon16"/>
					<div className="left8">{item.amount}</div>
				</div>
				<div className="description-box top24">
					{(auction.beneficiary != 0 && auction.highestBid) ? (
						<>
						<div className="size12 italic color5">current highest bid:</div>
							<div className="top8 flex italic ">
								<img src={ehtIcon} className="icon16"/>
								<div className="size18 bold"><div className="size18 italic bold">{blockchain.web3.utils.fromWei(auction.highestBid,'ether')} ETH</div></div>
							</div>
						<div className="size12 top8 italic color5">Auction Information:</div>
						<div className="top8 size12">
							<Countdown
							  date={moment(parseInt(auction.biddingTime)).format("YYYY-MM-DD HH:mm:ss")}
							  renderer={renderer}
							/>
						</div>
						{auctionButton ? (
							<div className="top8">
								<Button type="primary" id="btn1" onClick={(e)=>{
								  auctionEnd(auction._tradeId, auction.highestBidder, auction.highestBid);             
								}}> Pay bid</Button>
							</div>
						) : (<>
							
						</>)}
						{refundButton ? (
							<div className="top8">
								<Button type="primary" id="btn1" onClick={(e)=>{
									refund(auction._tradeId);                 
								}}> Refund</Button>
							</div>
						) : (<>
							
						</>)}
						<div className="top8 size12 italic color5">Current Highest Bidder:</div>
						<div className="top8 size12 bold">{auction.highestBidder}</div>
						<div className="top8">
						{bidButton ? (
							<Button type="primary" onClick={(e) => {
								e.preventDefault();
								handleShow1();
								setID(item.id);
								setPrice(item.price);
							  }}>Bid now</Button>
							
						) : (
							<></>
						)}
						</div>
						</>
					) : (
						<>	
						   <div className="size12 italic color5">current price:</div>
							<div className="top8 flex italic ">
								<img src={ehtIcon} className="icon16"/>
								<div className="size18 bold"><div className="size18 italic bold">{item.price} ETH</div></div>
							</div>
							<div className="top8">
							
								<Button type="primary" onClick={(e) => {
								  e.preventDefault();
								  handleShow2();
								  setID(item.id);
								  setPrice(item.price);
								}}>Buy now</Button>
								
							</div>
						</>
					)}	
					
				</div>
				<div className="top24 size12 color5 description-box">
					<div className="size12 italic color5">description:</div>
					<div className="top8 size18 bold">{item.metaData.description}</div>
				</div>
			</div>
           </s.rightBox>
           </s.Container>
        ))}
       

     
      
      <s.SpacerMedium/>
         
        {loading && (
          <div style={{ color: `green`,marginLeft:'24px' }}>
            loading token detail for token ID: <strong>{tokenId}</strong>
          </div>
        )}
        {error && (
          <div style={{ color: `red`,marginLeft:'24px' }}>
            some error occurred
          </div>
        )}
      

        <s.Container style={{marginLeft:"0",marginRight:"25px",marginBottom:"100px"}}>
			<div className="item-title">Transaction History</div>
			<div className="left24 top24">
				<Table dataSource={record} columns={columns} pagination={false}/>
			</div>
			
			<Modal
			  okText="Bid"
			  title={`Input Bidding Price ${processingID}`}
			  visible={show1}
			  onOk={(e) => {
			         form
			           .validateFields()
			           .then(values => {
							handleClose1();
							var wei_price = blockchain.web3.utils.toWei(values.price.toString(),'ether');
							bidToken(processingID, wei_price);
			           })
			           .catch(info => {
			             console.log('Validate Failed:', info);
			           });
			       }}
			  onCancel={handleClose1}
				>
				 <Form {...formItemLayout} form={form}>
					<Form.Item label="Price" name="price" rules={[{ required: true }]}>
					     <InputNumber style={{ width: 200 }} min="1"  name="price" id="price"   placeholder="Enter your price"/>
					</Form.Item>
				</Form> 
			</Modal>

			<Modal
			  okText="Buy"
			  title={`Input Amount ${processingID}`}
			  visible={show2}
			  onOk={(e) => {
			         form
			           .validateFields()
			           .then(values => {
						   console.log(processingPrice)
						   console.log(values.amount)
							handleClose2();
							var wei_price = blockchain.web3.utils.toWei(processingPrice.toString(),'ether');
							buyToken(processingID, wei_price,values.amount);
			           })
			           .catch(info => {
			             console.log('Validate Failed:', info);
			           });
			       }}
			  onCancel={handleClose2}
				>
				 <Form {...formItemLayout} form={form}>
					<Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
					     <InputNumber style={{ width: 200 }} min="1"  name="amount"  placeholder="Enter amount"/>
					</Form.Item>
				</Form> 
			</Modal>
        </s.Container>
       </>)}
    </s.Screen>
  );
}
export default DetailPage;

