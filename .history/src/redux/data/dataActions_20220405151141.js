/* eslint-disable */
// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {        
      let allTokens = await store
        .getState()
        .blockchain.MarketPlace.methods.getAllTokens()
        .call();
        
      let myTokens = await store
        .getState()
        .blockchain.MarketPlace.methods.getMyTokens(account)
        .call();
      
      let createdTokens = await store
        .getState()
        .blockchain.MarketPlace.methods.fetchItemsCreated(account)
        .call();

      let number = await store
        .getState()
        .blockchain.nft.methods.getNumber()
        .call();
      
      let winTokens = await store
        .getState()
        .blockchain.MarketPlace.methods.getWinTokens(account)
        .call();
      
      let sellingTokens = await store
        .getState()
        .blockchain.MarketPlace.methods.getSellingTokens(account)
        .call();

      dispatch(
        fetchDataSuccess({
          allTokens,
          myTokens,
          createdTokens,
          number,
          winTokens,
          sellingTokens
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };

  
};
