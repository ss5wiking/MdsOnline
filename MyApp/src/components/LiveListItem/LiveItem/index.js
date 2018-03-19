import React, { Component, PropTypes } from 'react';
import { Carousel, WhiteSpace, WingBlank ,SearchBar, Button ,} from 'antd-mobile';
import './index.scss';
import { Link } from 'react-router-dom'
import moment from 'moment'
import readsvg from "images/readsvg.svg";
import timesvg from "images/timesvg.svg";
import paysvg from "images/paysvg.svg";

export default class LiveItem extends Component {
  componentDidMount(){
	}
  render() {
      let item = this.props;
      return (
        <li className="recommended_live_item" key={item.id}>
          <Link to={{pathname: `/lives/${item.id}`, state: item}}>
              <div className="img_wrap">
                <img src={item.cover}/>
                <span className={`live_status ${item.live_status=="living"?"live_status_ing":"live_status_will"}`}>
                    {item.live_status=="living" && <span><i className="white"></i>正在直播中</span>}
                    {item.live_status=="pending" && <span><i className="yellow"></i>{moment(item.start_at).format('MM-DD HH:mm')}</span>}
                </span>
                <div className="shadow clearfix">
                  <img src={item.doctor.avatar} alt="头像"  className="pull-left"/>
                  <div className="pull-left shadow_content">
                    <span>{item.doctor.name} ({item.doctor.title} )</span>
                    <span>{item.doctor.hospital.name}</span>
                  </div>
                </div>
              </div>
              <div className="recommended_live_info">
                <h4>{item.description}</h4>
                <p className="clearfix">
                  {item.tags.map((value, index) =>
                    <span key={index} className="pull-left">{value}</span>
                  )}
                </p>
                <p>
                  <span>
                    <img src={readsvg} alt=""/>
                    {item.watcher_count}人已参与
                  </span>
                  <span>
                    <img src={timesvg} alt=""/>
                    直播时长:{ item.live_time }分钟
                  </span>
                  <span className={item.charge_free ? 'free' : 'unfree'}>
                    <img src={paysvg} alt="" />
                    {item.charge_free ? '免费' : `收费/￥${item.price}`}
                  </span>
                </p>
              </div>
            </Link>
          </li>
      )
    }
}
