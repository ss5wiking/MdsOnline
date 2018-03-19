import React, { Component } from 'react';
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import './index.scss';
import { NavLink } from 'react-router-dom';
import api from '@/api'
import {Link} from 'react-router-dom';

import white from "images/white.svg";

export default  class WhiteNo extends Component {
    // 默认数据
  constructor(props) {
      super(props)
      this.state = {
          data: [],
      }
  }

  // 渲染
  render() {
      return (
        <div className ="WhiteNo" >
        <p className="img_wrap">
          <img src={white}/>
        </p>
        <p className="tips">
          暂无{this.props.text}数据
        </p>
        <p className="add_button">
          <Link to="/HomePage/0">返回首页</Link>
        </p>
        </div>
      )
  }
}
  