/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";
import { ImageUpload } from 'react-ipfs-uploader'
import {nftaddress, nftmarketaddress} from "../config";
import moment from "moment";

import { Button ,Form ,Input ,InputNumber ,Checkbox,Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");
const actionUrl = "https://ipfs.infura.io:5001/api/v0/add?stream-channels=true&progress=false"

function CreateNFT() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [formStatus,setForm] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName]= useState("");
  const [description,setDes] = useState("");
  const [amount, setAmount]= useState();
  const elementRef = useRef();
  const ipfsBaseUrl = "https://ipfs.infura.io/ipfs/";
  const [form] = Form.useForm();	
  const formItemLayout = {
  	labelCol: {
  	   xs: { span: 24 },
  	   sm: { span: 8 },
  	},
  	wrapperCol: {
  	   xs: { span: 24 },
  	   sm: { span: 16 },
  	},
  };

  async function mint(nftaddress, _uri, _amount) {
    let _tokenId = await data.number;
    console.log(_tokenId);
    await blockchain.nft.methods.mint(_uri, _amount).send({from: blockchain.account})
       .once("error", (err) => {
         console.log(err);
         setStatus("Error");
       }).then((receipt) => {
         console.log(receipt);
         console.log("mint ok!")
       })

    let time = moment().format('YYYY-MM-DD HH:mm:ss');  

    await blockchain.MarketPlace.methods.listToken(nftaddress, _tokenId,_amount,_uri,time)
    .send({from: blockchain.account})
    .once("error", (err) => {
      console.log(err);
      setLoading(false);
      setStatus("Error");
    }).then((receipt) => {
	  form.resetFields();
      console.log(receipt);
      console.log("list ok!");
      setLoading(false);
      setStatus("Successfully minting your NFT");
      clear();
      dispatch(fetchData(blockchain.account));
    })

  };


  const createMetaDataAndMint = async (_name, _des, _imgBuffer,_amount) => {
    setLoading(true);
    setStatus("Uploading to ipfs");
    try{
      //const addedImage = await ipfsClient.add(_imgBuffer);
      const metaDataObj = {
        name: _name,
        description: _des,
        image: ipfsBaseUrl + _imgBuffer,
      }
	  console.log(metaDataObj)
      const addedMetaData = await ipfsClient.add(JSON.stringify(metaDataObj));
      console.log(ipfsBaseUrl + addedMetaData.path);
      mint(nftaddress, ipfsBaseUrl + addedMetaData.path,_amount);
      

    } catch (err) {
      console.log(err);
      setLoading(false);
      setStatus("Error");
      clear();
    }
  };


  const onFinish = (values) => {
	  if ( values.upload[0].response && values.upload[0].response.Hash != undefined) {
		  createMetaDataAndMint(values.name, values.Description, values.upload[0].response.Hash,values.Amount);
	  } else {
		  alert("upload error!");
	  }
  };	
  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const clear = () => {
    setDes("");
    setName("");
    setImageUrl("");
    setAmount();
    setForm(false);
  }

  useEffect(() => { 
    dispatch(connect());
  }, []);
  
  useEffect(() => { 
	  console.log('dispatch')
    dispatch(fetchData(blockchain.account));
  }, [blockchain.nft]);

  

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
        <s.Container flex={1} style={{ padding: 24 }} className="top24 createForm">
         <Form  {...formItemLayout} form={form}  name="userForm" onFinish={onFinish}>
			 <Form.Item name="name" label="Name"  rules={[{ required: true, message: 'Please input your name!' }]}>
			   <Input style={{ width: 380 }} type="text" name="name" id="name" placeholder="Enter name:"/>
			 </Form.Item>
			 <Form.Item name="Description" label="Description" rules={[{ required: true, message: 'Please input your description!' }]}>
				<TextArea style={{ width: 380 }} rows={4} placeholder="Enter description:" name="des" id="des"/>
			 </Form.Item>
			 <Form.Item name="Amount" label="Supply" rules={[{ required: true, message: 'Please input your supply!' }]}>
			   <InputNumber style={{ width: 380 }} min="1"  name="amount"  placeholder="Enter supply"/>
			 </Form.Item>
			
			<Form.Item
				name="upload"
				label="Upload"
				valuePropName="fileList"
				getValueFromEvent={normFile}
				rules={[{ required: true, message: 'Please upload your image' }]}
			  >
				<Upload style={{width:'400px'}} maxCount={1} name="logo" action={actionUrl} listType="picture">
				  <Button icon={<UploadOutlined />}>Click to upload</Button>
				</Upload>
			  </Form.Item>
			  <Form.Item name="remember" valuePropName="checked" rules={[{ required: true, message: 'Please select the chebox!' }]} wrapperCol={{ offset: 8, span: 16 }}>
			  		<Checkbox>Approve the system to manage your NFTs</Checkbox>
			  </Form.Item>
		   <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
			 <Button type="primary" htmlType="submit">
			   Submit
			 </Button>
		   </Form.Item>
			
         </Form>
      </s.Container>
     
    )}
    </s.Screen>
  );
          

       
      
}

export default CreateNFT;
