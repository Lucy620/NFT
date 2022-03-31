/* eslint-disable */
import React from "react";
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import { withRouter } from '../../withRouter.js'

const Navbar = (props) => {
	let current = '/'
	const { params } = props
	current = params.pathname
	//click
	const handleClick = e => {
		 current = e.key
	}
    return (
        <>
		  <div className="logo" style={{ position: 'absolute',left:'50px',fontSize:'16px',fontWeight:'bold',lineHeight:'46px',color:'rgba(0,0,0,0.8)'}}>NFT Market</div>
           <Menu onClick={handleClick}  style={{ paddingLeft : '200px'}} selectedKeys={[current]} mode="horizontal">
			  <Menu.Item key="/">
				<Link style={{textDecoration:'none'}} to="/">Home</Link> 
			  </Menu.Item>
			  <Menu.Item key="/CreateNFT">
				<Link style={{textDecoration:'none'}} to="/CreateNFT">Create NFT</Link> 
			  </Menu.Item>
			  <Menu.Item key="/MyNFT">
				<Link style={{textDecoration:'none'}} to="/MyNFT">My NFT</Link> 
			  </Menu.Item>
		   </Menu>
        </>
    );
};
export default withRouter(Navbar);