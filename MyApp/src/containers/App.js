import React, { Component } from 'react';
//import logo from 'images/logo.svg';
import './App.css';
import {WhiteSpace,SearchBar, Icon, Carousel, ActivityIndicator,Button} from 'antd-mobile';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <SearchBar placeholder="搜索" maxLength={8} />
          <Button className="btn" type="primary">primary button</Button>
          <Icon type="search" />
          
          <h1 className="App-title">Welcome to React123</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
