/* eslint-disable */
const fs = require('fs');
const marketContract = artifacts.require("MarketPlace");
const nftContract = artifacts.require("NFT");


module.exports = async function (deployer) {
  await deployer.deploy(marketContract);
  const MarketPlace = await marketContract.deployed();

  
  await deployer.deploy(nftContract, MarketPlace.address);
  const NFT = await nftContract.deployed();

  let config = `
  export const nftmarketaddress = "${MarketPlace.address}"
  export const nftaddress = "${NFT.address}"
    `;
  
    let data = JSON.stringify(config);
    fs.writeFileSync('./src/config.js', JSON.parse(data))
  
};
