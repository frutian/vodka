import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTokens, tokens } from './tokensSlice';
import Web3 from 'web3'

const img = {
  width: "25px",
  height: "25px"
}

export function Tokens() {
  const dispatch = useDispatch();
  const data = useSelector(tokens)
  const filteredTokens = data.filter(t => t.tokenInfo.symbol)
  const filteredByPriceTokens = filteredTokens.filter(t => t.tokenInfo.price != false)
  filteredByPriceTokens.sort((b, a) => {
    return (a.balance / (10 ** a.tokenInfo.decimals) * a.tokenInfo.price.rate) - (b.balance / (10 ** b.tokenInfo.decimals) * b.tokenInfo.price.rate)
  })
  console.log(filteredTokens)
  const tokenList = filteredByPriceTokens.map((t) =>
    <tr>
      <td><img className="rounded-circle" style={img} src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${Web3.utils.toChecksumAddress(t.tokenInfo.address)}/logo.png`} alt="" />{t.tokenInfo.symbol}</td>
      <td>{t.tokenInfo.name}</td>
      <td>{t.tokenInfo.holdersCount}</td>
      <td>{(t.balance / (10 ** t.tokenInfo.decimals)).toFixed(4)}</td>
      <td>${t.tokenInfo.price.rate.toFixed(4)}</td>
      <td>{(t.balance / (10 ** t.tokenInfo.decimals) * t.tokenInfo.price.rate).toFixed(2)}</td>
    </tr>
  )

  const [adr, setAdr] = useState('0xf1A1602C90D8E510bC583EABb53667e3AFae4b52');

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">DeFi.vodka</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home
          <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Pricing</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <a className="dropdown-item" href="#">Something else here</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Separated link</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <div className="input-group input-group-sm mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroup-sizing-sm">Address</span>
        </div>
        <input
          type="text"
          className="form-control"
          aria-label="Small"
          aria-describedby="inputGroup-sizing-sm"
          value={adr}
          onChange={e => setAdr(e.target.value)}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => dispatch(fetchTokens(adr))}>
            Load data
            </button>
        </div>
      </div>
      <table className="table table-sm table-hover" data-height="100">
        <thead>
          <tr>
            <th scope="col">Asset</th>
            <th scope="col">Name</th>
            <th scope="col">Holders</th>
            <th scope="col">Balance</th>
            <th scope="col">Price</th>
            <th scope="col">Value</th>

          </tr>
        </thead>
        <tbody>
          {tokenList}
        </tbody>
      </table>
    </div>
  );
}
