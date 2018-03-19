import React, {Component} from 'react';
import './index.scss' ;
// import dianjishubiao from 'static/dianjishubiao.svg';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";

export default class SubscribeList extends Component {
  componentWillReceiveProps(nextProps){
  }
  render() {
		let data = this.props.data;
		let i = this.props.index;
    console.log(this.props, 333333)
		return (
      <div className="subscribe_list_wrap">

          <div className="space_gray">全部预约({data.count})</div>
          <div className='rwarp'>
          <ReactIScroll
            iScroll={iScroll}
            options={{
              preventDefault:false
            }}
          >
          <ul className="subscribe_list">
            {
              data.subscribers.map((item, index) => {
                let status_style = item.type === 'doctor' ? "pull-left color_d"
                :item.type == 'student' ? "pull-left color_s"
                :item.type == 'normal' ? "pull-left color_h"
                :"pull-left color_f"


                let visitortype = item.type === 'doctor' ? "医"
                :item.type == 'student' ? "学"
                :item.type == 'normal' ? "患"
                :"访"
                return(
                  <li className="clearfix" key={ index }>
                    <img src={item.avatar} className="pull-left"/ >
                    <span className="pull-left">{item.name}</span>
                    <span className={status_style}>{visitortype}</span>
                  </li>
                )
              })
            }
          </ul>
          </ReactIScroll>
          </div>
      </div>
		);
	}
}
