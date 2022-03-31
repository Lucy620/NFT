/* eslint-disable */
import React from "react";
import './App.css';
import Navbar from "./components/Navbar";
// import { withRouter } from 'react-router';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages';
import CreateNFT from './pages/CreateNFT';
import MyNFT from './pages/MyNFT';
import DetailPage from './pages/detailPage'

// import SignIn from './pages/signin';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/CreateNFT" element={<CreateNFT/>} />
        <Route path="/MyNFT" element={<MyNFT/>} />
        <Route path="/detail/:tokenId/:tradeId" element={<DetailPage/>}/>     
        {/* <Route path="/signin" element={SignIn} />
        <Route path="/sign-up" element={SignUp} /> */}
      </Routes>
    </Router>
    
  );
}

export default App;