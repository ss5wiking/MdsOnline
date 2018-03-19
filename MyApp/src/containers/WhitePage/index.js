import React, { Component } from 'react';
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import './index.scss';
import { NavLink } from 'react-router-dom';
import api from '@/api'
import {Link} from 'react-router-dom';

import waitgoodnews from "images/waitgoodnews.svg";
export default  class WhitePage extends Component {
    // 默认数据
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    // 渲染
    render() {
      console.log(this.state.data, 455555)
        return (
          <div className = "WhitePage" >
            <p className="img">
              <img src={waitgoodnews}/>
            </p>
            <p className="text">更多服务，敬请期待</p>
          </div>
        )
    }
}
