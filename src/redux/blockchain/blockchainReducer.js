/* eslint-disable */
const initialState = {
  loading: false,
  account: null,
  MarketPlace: null,
  nft: null,
  web3: null,
  errorMsg: "",
  number: 0,
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        MarketPlace: action.payload.MarketPlace,
        nft: action.payload.nft,
        web3: action.payload.web3,
        number: action.payload.number,
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
      };
    default:
      return state;
  }
};

export default blockchainReducer;
