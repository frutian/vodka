import { createSlice } from '@reduxjs/toolkit';

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState: {
    loading: 'idle',
    tokens: []
  },
  reducers: {
    tokensLoading(state, action) {
      if (state.loading === 'idle') {
        state.loading = 'pending'
      }
    },
    tokensReceived(state, action) {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.tokens = action.payload
      }
    }
  },
});

export const { tokensLoading, tokensReceived } = tokensSlice.actions;

export const fetchTokens = adr => async dispatch => {
  dispatch(tokensLoading())
  const response = await fetch(`https://api.ethplorer.io/getAddressInfo/${adr}?apiKey=EK-4zPcj-sCovfbu-CLCWo`)
  const data = await response.json()

  const itemsWithoutPrice = data.tokens.filter(item => item.tokenInfo.price == false)
  const contractAddresses = itemsWithoutPrice.map(item => item.tokenInfo.address)

  const contractAddressesJoined = contractAddresses.join(',')
  const coingeckoAPI = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddressesJoined}&vs_currencies=usd`
  const pricesFetch = await fetch(coingeckoAPI).then(response => response.json());

  const prices = Object.keys(pricesFetch).map(item => {
    return {
      address: item,
      price: pricesFetch[item].usd
    };
  });

  const updatedData = data.tokens.map(item => {
    if (item.tokenInfo.price != false) {
      return item
    }
    else {
      const priceItem = prices.find(p => p.address === item.tokenInfo.address)
      if (priceItem != undefined) {
        let price = priceItem.price
        item.tokenInfo.price = { rate: price }
      }
      return item
    }
  })
  //console.log(data.tokens)
  //console.log(updatedData)
  dispatch(tokensReceived(updatedData))
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const tokens = state => state.tokens.tokens;

export default tokensSlice.reducer;