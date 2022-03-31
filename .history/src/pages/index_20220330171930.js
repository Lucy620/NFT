/* eslint-disable */
import React from 'react';
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";
// import {CardText, CardBody, CardTitle, CardSubtitle, CardImg} from 'reactstrap';
import {nftaddress, nftmarketaddress} from "../config";
import moment from "moment";
// import Modal from 'react-bootstrap/Modal';

import { Button , Card ,Modal ,InputNumber,Form} from 'antd';
import ehtIcon from '../images/eht.png'
import amountIcon from '../images/amount.png'

//import { Header, Table, Modal } from 'semantic-ui-react';

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

function Home () {
  const { Meta } = Card;
  const [confirmLoading2, setConfirmLoading2] = useState(false);
  
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [NFTS, setNFTS] = useState([]);
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
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
 
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose1 = () => {
  	 form1.resetFields();
  	 setShow1(false);
  };
  const handleShow1 = () => setShow1(true);
  
  const handleClose2 = () => {
  	  form2.resetFields();
  	  setShow2(false)
  };
  const handleShow2 = () => setShow2(true);
  const [processingID, setID] = useState(0);
  const [processingPrice, setPrice] = useState(0);
  
  const  onChange1 = (value) => {
	inputAmount = value
  }
  
  const onChange2 = (value) => {
	inputPrice = value
  }
		   
  const fetchMetaDataForNFTS = () => {
	  console.log('update',data.allTokens);
	  setNFTS([]);  
      data.allTokens.forEach((nft) => {
        fetch(nft.uri)
         .then((response) => response.json())
         .then(async (metaData) => {
			 console.log('update',nft.amount)
			 var ether_price = await blockchain.web3.utils.fromWei(nft.price,'ether');
            setNFTS((prevState) => [
              ...prevState,
              { id: nft._tradeId, tokenId: nft._tokenId, metaData: metaData, price: ether_price, amount:nft.amount, auction:nft.auction },
            ]);
          }).catch((err) => {
            console.log(err);
          });
      });  
    
    console.log(data.allTokens);
  };


  const buyToken = async(tradeId, price,amount) => {  
    let time = moment().format('YYYY-MM-DD HH:mm:ss');  
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

    
   
   };

   const bidToken = async(tradeId, price) => {  
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
	var balance = await blockchain.web3.eth.getBalance(blockchain.account);
	console.log(price);
	console.log(balance);
	
	if(price > blockchain.web3.utils.toWei(processingPrice.toString(),'ether')){
		if(balance > price){
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
    dispatch(fetchData(blockchain.account));
  }, [blockchain.MarketPlace]);
  useEffect(() => { 
    fetchMetaDataForNFTS();
  }, [data.allTokens]);
  

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
       <s.Container>
       <s.flex_container> 
         {NFTS.map((nft, index) => {
            return (
			  <Link style={{textDecoration: 'none'}} to={`/detail/${nft.tokenId}/${nft.id}`}>
				 <Card
					 bodyStyle={{padding:'12px'}}
					 key={index}
				     hoverable
				     style={{ width: 240,margin:'48px 16px',borderRadius:'12px' }}
				     cover={<img alt={nft.metaData.name} style={{ borderRadius:'12px 12px 0 0 ' }} src={nft.metaData.image} />}
				   >
				    <div className="flex between">
						<div className="card-name bold">{nft.metaData.name} </div>
						<div className="size12 italic">#{nft.id}</div>
						{/* {
							nft.auction == true ? (
								<div className="size12 italic">For auction</div>
							) : (
								<div className="size12 italic">price</div>
							)
						} */}
						
					</div>
					{
						nft.auction == true ? (
							<>
							<div className="flex between">
								<div className="size12">{nft.metaData.description}</div>
								<div className="size12 italic">
									<div>amount</div>
								</div>
							</div>
							<div className="flex end">
								<div className="size12 flex italic">
									<img src={amountIcon} className="icon16"/>
									<div>{nft.amount} </div>
								</div>
							</div>
							</>
						) : (
							<>
							<div className="flex between">
								<div className="size12">{nft.metaData.description}</div>
								<div className="size12 flex italic">
									<img src={ehtIcon} className="icon16"/>
									<div>{nft.price} ETH</div>
								</div>
							</div>
							<div className="flex end">
								<div className="size12 flex italic">
									<img src={amountIcon} className="icon16"/>
									<div>{nft.amount} </div>
								</div>
							</div>
							</>
						)
					}
					<div className="flex top24 end">
						<Button size="small"><Link style={{textDecoration: 'none'}} to={`/detail/${nft.tokenId}/${nft.id}`}>Details</Link></Button>
						 {nft.auction == true ? (
							<>
							<Button className="left12" size="small"  onClick={(e) => {
                        e.preventDefault();
                        handleShow1();
                        console.log(nft.id);
                        setID(nft.id);
						setPrice(nft.price);
                      }}>Bid</Button>
							</>
						 ) : (
							<>
							<Button className="left12" size="small"  onClick={(e) => {
                      e.preventDefault();
                      handleShow2();
                      console.log(nft.id);
                      setID(nft.id);
                      setPrice(nft.price);
                    }}>Buy</Button>
							</>
						 )}
					</div>
					
				   </Card>
				 </Link>  
            )
          })}
      
      </s.flex_container>
	  
	  <Modal
	    okText="Bid"
	    title={`Input Bidding Price ${processingID}`}
	    visible={show1}
	    onOk={(e) => {
	           form1
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
	  	 <Form {...formItemLayout} form={form1}>
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
	           form2
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
	  	 <Form {...formItemLayout} form={form2}>
	  		<Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
	  		     <InputNumber style={{ width: 200 }} min="1"  name="amount"  placeholder="Enter amount"/>
	  		</Form.Item>
	  	</Form> 
	  </Modal>
      </s.Container>
    )}
    
    </s.Screen>
  );

}

export default Home;