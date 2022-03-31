/* eslint-disable */
const initialState = {
  loading: false,
  allTokens:[],
  myTokens: [],
  createdTokens: [],
  sellingTokens: [],
  winTokens: [],
  error: false,
  errorMsg: "",
  number: 1,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        allTokens: action.payload.allTokens,
        myTokens: action.payload.myTokens,
        createdTokens: action.payload.createdTokens,
        number: action.payload.number,
        winTokens: action.payload.winTokens,
        sellingTokens: action.payload.sellingTokens
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
