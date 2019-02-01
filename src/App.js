import React, { Component } from 'react';
import './App.css';

// Layout
import Header from "./Layout/Header/Header";
import MainLayout from "./Layout/Main/Main";
import Footer from "./Layout/Footer/Footer";

// UIKit
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import '../node_modules/uikit/dist/css/uikit.min.css';

// loads the Icon plugin
UIkit.use(Icons);

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-main">
          <MainLayout />
        </div>
        <Footer />
      </div>
    );
  }
}
