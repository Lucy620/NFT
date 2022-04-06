/* eslint-disable */
import React from 'react';
import { useEffect, useState, useRef } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";
import {nftaddress, nftmarketaddress} from "../config";
import { Link } from "react-router-dom";
import DateTimePicker from 'react-datetime-picker';

import { Button , Card ,Modal ,InputNumber,Radio,DatePicker ,Form} from 'antd';
import ethIcon from '../images/eth.png'
import amountIcon from '../images/amount.png'


export const StyledButton = styled.button`
  padding: 8px;
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

function MyNFT() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [myNFTS, setNFTS] = useState([]);
  const [createNFTS, setNFT] = useState([]);
  const [winNFTS, setWin] = useState([]);
  const [sellNFTS, setSell] = useState([]);
  const [approve, setApprove] = useState(false);
  const inputTime = useRef(null);
  const [processingID, setID] = useState(0);
  const [value, onChange] = useState(new Date());
  
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
  const fetchMyTokens = () => {
    setNFTS([]);
    
	console.log('token',data.myTokens);
    data.myTokens.forEach(async(nft) => { 
		console.log('ntfis',nft)
        fetch(nft.uri)
         .then((response) => response.json())
         .then(async(metaData) => {  
            var _amount = await blockchain.nft.methods.balanceOf(blockchain.account,nft._itemId).call();
				console.log('new-nfts',myNFTS)
				setNFTS((prevState) => [
				  ...prevState,
				  { id: nft._itemId, metaData: metaData, amount: _amount},
				]);
			

          }).catch((err) => {
            console.log(err);
        });
      });
 
    
    console.log(data.myTokens);
    
    
  };

  const fetchCreatedTokens = () =>{
    setNFT([]);
    
     data.createdTokens.forEach(async(token) => {   
        fetch(token.uri)
         .then((response) => response.json())
         .then(async(meta) => {           
           setNFT((prevState) => [
              ...prevState,
              { id: token._itemId, meta: meta, initialSupply: token.initialSupply, publicSupply: token.publicSupply },
            ]);     
            }).catch((err) => {
              console.log(err);
        });
     });
   

    console.log(data.createdTokens);

  }

  const fetchWinTokens = () =>{
    setWin([]);
    
     data.winTokens.forEach(async(auction) => {   
        fetch(auction.uri)
         .then((response) => response.json())
         .then(async(meta) => {           
           setWin((prevState) => [
              ...prevState,
              { id: auction._tradeId, tokenId: auction._tokenId, meta: meta, amount: 1},
            ]);     
            }).catch((err) => {
              console.log(err);
        });
     });
   

    console.log(data.winTokens);

  }

  const fetchSellTokens = () =>{
    setSell([]);
    
     data.sellingTokens.forEach(async(trade) => {   
        fetch(trade.uri)
         .then((response) => response.json())
         .then(async(meta) => {   
		   var ether_price = await blockchain.web3.utils.fromWei(trade.price,'ether')       
           setSell((prevState) => [
              ...prevState,
              { id: trade._tradeId, tokenId: trade._tokenId, meta: meta, amount: trade.amount, price: ether_price},
            ]);     
            }).catch((err) => {
              console.log(err);
        });
     });
   

    console.log(data.sellingTokens);

  }

  const allowBuy = async(id, price, amount, auction, time) => {
    await blockchain.MarketPlace.methods.publicToAll(id, price, amount, auction, time)
    .send({from: blockchain.account})
    .once("error", (err) => {
      console.log(err);
    }).then(() => {
      console.log('Open token')
	  dispatch(fetchData(blockchain.account));  
	  fetchMyTokens(); 
      fetchWinTokens();
      fetchSellTokens();
    })  
    
  }

  const setApproval = ()=>{
    blockchain.nft.methods.setApproval()
    .send({from: blockchain.account})
    .once("error", (err) => {
      console.log(err);
    }).then(() => {
      console.log('Approve Granted For All');
      getApproved();
    })  
   
    
  }

  const getApproved = async()=>{
	if (blockchain.account) {
		let approved = await blockchain.nft.methods.isApprovedForAll(blockchain.account,nftmarketaddress).call();
		setApprove(approved);
	}
  }
   
  const [select, setSelect] = useState("false");

  const handleSelectChange = event => {
    const value = event.target.value;
    setSelect(value);
  };

  

  const [show, setShow] = useState(false);

  const handleClose = () => {
	  form.resetFields();
	  setShow(false);
  }
  
  const handleShow = () => setShow(true);

  useEffect(() => { 
    dispatch(connect());
  }, []);
  useEffect(() => {
    getApproved();  
  }, [blockchain.account]);
  useEffect(() => {
    dispatch(fetchData(blockchain.account));
  }, [blockchain.account]);
  useEffect(() => {
	console.log('fetchMyTokens')
    fetchMyTokens(); 
  }, [data.myTokens]);
  useEffect(() => {
    fetchCreatedTokens();
  }, [data.createdTokens]);
  useEffect(() => {
    fetchWinTokens();
  }, [data.winTokens]);
  useEffect(() => {
    fetchSellTokens();
  }, [data.sellingTokens]);

  
  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.nft === null || blockchain.MarketPlace === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
		   <Button
		   onClick={(e) => {
		     e.preventDefault();
		     dispatch(connect());          
		   }}
		   >
		    CONNECT
		   </Button>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Screen>
        {approve==false ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
        <Button onClick={(e) => {
          e.preventDefault();
          setApproval();
        }}>Approve Market</Button>
        </s.Container>
        ):(
        <s.Container>
        <s.TextTitle className="item-title">My Tokens</s.TextTitle>
        <s.flex_container>
        {
			myNFTS.length == 0 ? (
				<div className="font left24 top24">empty...</div>
			) :(
				myNFTS.map((nft, index) => {
					let id = 0;
					if (index < myNFTS.length - 1) {
						id = myNFTS[index + 1].id
					}
					
				    return (
						nft.id == id ?(<></>) : (			
						<Card
						      bodyStyle={{padding:'12px'}}
						      key={index}
						         hoverable
						         style={{ width: 240,margin:'24px 16px',borderRadius:'12px' }}
						         cover={<img alt={nft.metaData.name} style={{ borderRadius:'12px 12px 0 0 ' }} src={nft.metaData.image} />}
						       >
						       <div className="flex between">
						        <div className="card-name bold">{nft.metaData.name}</div>
						       </div>
						       <div className="flex between">
						        <div className="size12 card-desc">{nft.metaData.description}</div>
						        <div className="size12 italic">
						         <div>Amount</div>
						        </div>
						       </div>
						       <div className="flex end">
						        <div className="size12 flex italic">
						         <img src={amountIcon} className="icon16"/>
						         <div>{nft.amount} </div>
						        </div>
						       </div>
						       <div className="flex top24 end">
						        <Button  size="small"  onClick={(e) => {
						          e.preventDefault();
						          handleShow();
						          console.log(nft.id);
						          setID(nft.id);
						        }}>Public</Button>
						       </div>   
						       </Card>
						)
					);	
				  })
			)
		}
          
          </s.flex_container>

          <s.SpacerSmall></s.SpacerSmall>

          <s.TextTitle className="item-title">Auction Tokens</s.TextTitle>
          <s.flex_container> 
		    {
				winNFTS.length == 0 ? (
					<div className="font left24 top24">empty...</div>
				) : (
				 winNFTS.map((auction, index) => {
					let id = 0;
					if (index < winNFTS.length - 1) {
						id = winNFTS[index + 1].id
					}			
				 	return (
						auction.id == id ? (<></>) : (
						<Link style={{textDecoration: 'none'}} to={`/detail/${auction.tokenId}/${auction.id}`}>
				 		<Card
				 			bodyStyle={{padding:'12px'}}
				 			key={index}
				 		    hoverable
				 		    style={{ width: 240,margin:'24px 16px',borderRadius:'12px' }}
				 		    cover={<img alt={auction.meta.name} style={{ borderRadius:'12px 12px 0 0 ' }} src={auction.meta.image} />}
				 		  >
				 				<div className="flex between">
				 					<div className="card-name bold">{auction.meta.name}</div>
									 <div className="size12 italic">#{auction.id}</div>
				 				</div>
				 				<div className="flex between">
				 					<div className="size12 card-desc">{auction.meta.description}</div>
				 					<div className="size12 italic">
				 						<div>Owned Amount</div>
				 					</div>
				 				</div>
				 				<div className="flex end">
				 					<div className="size12 flex italic">
				 						<img src={amountIcon} className="icon16"/>
				 						<div>{auction.amount} </div>
				 					</div>
				 				</div>
				 				<div className="flex top24 end">
				 					<Button  size="small"><Link style={{textDecoration: 'none'}} to={`/detail/${auction.tokenId}/${auction.id}`}>Process</Link></Button>
				 				</div>			
				 		  </Card>
				 	 </Link>
					 )
					 );	
				   })
			 )
		 }
		  </s.flex_container>

          <s.SpacerSmall></s.SpacerSmall>

          <s.TextTitle className="item-title">Selling Tokens</s.TextTitle>
          <s.flex_container> 
		 {
			 sellNFTS.length == 0 ? (
				<div className="font left24 top24">empty...</div>
			 ) : (
				sellNFTS.map((trade, index) => {
					let id = 0;
					if (index < sellNFTS.length - 1) {
						id = sellNFTS[index + 1].id
					}		
				return (
				    trade.id == id ?(<></>) : (
					<Link style={{textDecoration: 'none'}} to={`/detail/${trade.tokenId}/${trade.id}`}>
					<Card
						bodyStyle={{padding:'12px'}}
						key={index}
						hoverable
						style={{ width: 240,margin:'24px 16px',borderRadius:'12px' }}
						cover={<img alt={trade.meta.name} style={{ borderRadius:'12px 12px 0 0 ' }} src={trade.meta.image} />}
					  >
							<div className="flex between">
								<div className="card-name bold">{trade.meta.name}</div>
								<div className="size12 italic">#{trade.id}</div>
										{/* <div className="size12 italic">
										{trade.auction == true ?(
											<div>For auction</div>
										):(
											<div>Price</div>
										)}
											
										</div> */}
							</div>
									{trade.auction == true ?(
										<div className="flex between">
											<div className="size12 card-desc">{trade.meta.description}</div>
											<div className="flex size12 italic">
												<img src={amountIcon} className="icon16"/>
												<div>{trade.amount} </div>
											</div>
										</div>
									):(
										<>
										<div className="flex between">
											<div className="size12 card-desc">{trade.meta.description}</div>
											<div className="flex size12 italic">
												<div>
												<img src={ethIcon} className="icon16"/>
												</div>
												<div>{trade.price} MATIC</div>
											</div>
										</div>
										<div className="flex end">
											<div className="size12 flex italic">
												<img src={amountIcon} className="icon16"/>
												<div>{trade.amount} </div>
											</div>
										</div>
										</>
									)}	
							<div className="flex top24 end">
								<Button  size="small"><Link style={{textDecoration: 'none'}} to={`/detail/${trade.tokenId}/${trade.id}`}>Detail</Link></Button>
							</div>			
					  </Card>
					  </Link>
				
					)
				);
				})
				
			 )
		 }		  
          </s.flex_container>

        <s.SpacerSmall></s.SpacerSmall>

          <s.TextTitle className="item-title">Created Tokens</s.TextTitle>
          <s.flex_container>  
			{
				createNFTS.length == 0 ? (
					<div className="font left24 top24">empty...</div>
				) : (
					createNFTS.map((token, index) => {
					let id = 0;
					if (index < createNFTS.length - 1) {
						id = createNFTS[index + 1].id
					}
				    return (
					   token.id == id ? (<></>) : (
						<Card
							bodyStyle={{padding:'12px'}}
							key={index}
							hoverable
							style={{ width: 240,margin:'24px 16px',borderRadius:'12px' }}
							cover={<img alt={token.meta.name} style={{ borderRadius:'12px 12px 0 0 ' }} src={token.meta.image} />}
						  >
								<div className="flex between">
									<div className="card-name bold">{token.meta.name}</div>
									<div className="size12 italic">
										<div> Initial Amount: {token.initialSupply}</div>
									</div>
								</div>
								<div className="flex between">
									<div className="size12 card-desc">{token.meta.description}</div>
									<div className="size12 flex italic">
										{/* <div>  Public Amount: {token.publicSupply}</div> */}
									</div>
								</div>
								<div className="flex top24 end">
									<Button  size="small" disabled={true}>Created</Button>
								</div>			
						  </Card>
						)
						);
					  })
				)
			}	 
         </s.flex_container>
		
		<Modal
		  okText="Public"
		  title={`Input Information for Sale `}
		  visible={show}
		  onOk={async(e) => {
		         form
		           .validateFields()
		           .then(async values => {
		             form.resetFields();
					 handleClose();
		             if(select == "true"){
		               allowBuy(processingID, 0, 1, true, value.getTime());
		             }else{
					   console.log(values.price);
					   var wei_price =  await blockchain.web3.utils.toWei(values.price.toString(),'ether');
		               allowBuy(processingID, wei_price, values.amount, false, 0);
		             }
		           })
		           .catch(info => {
		             console.log('Validate Failed:', info);
		           });
		       }}
		  onCancel={handleClose}
			>
			 <Form {...formItemLayout} form={form} initialValues={{amount:1}}>
			   <Form.Item label="Auction">
			        <Radio.Group onChange={handleSelectChange} value={select}>
			            <Radio value="true">Yes</Radio>
			            <Radio value="false">No</Radio>
			        </Radio.Group>
			    </Form.Item>
			 {select == "true" ? (
				<>
				 <Form.Item label="Auction will end at">
				      <DateTimePicker onChange={onChange} value={value} minDate={new Date()}/>
				  </Form.Item>
				 <Form.Item label="Amount" name="amount">
				      <InputNumber style={{ width: 200 }} min="1" disabled  name="amount"  placeholder="Enter amount"/>
				 </Form.Item>
				</>
			 ):(
				<>
				<Form.Item label="Price(MATIC)" name="price" rules={[{ required: true }]}>
				     <InputNumber style={{ width: 200 }} min="0" name="price" id="price"   placeholder="Enter your price"/>
				</Form.Item>
				<Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
				     <InputNumber style={{ width: 200 }} min="1"  name="amount"  placeholder="Enter amount"/>
				</Form.Item>
				</>
			 )}
			</Form> 
		</Modal>
         
        </s.Container>
      )}

      </s.Screen>
      )}
    </s.Screen>
  );

}

export default MyNFT;