import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import moment from 'moment'
import {getCookie} from "@/lib/cookie";
import _ from 'lodash/collection'
import {Link} from 'react-router-dom';
import WhiteNo from "@/components/WhiteNo";
import doc1 from "images/doc1.svg";
import seed from "images/seed.svg";
import price1 from "images/price1.svg";
export default class MyVideoListItemOld extends Component {
  // 默认数据
  constructor(props) {
    super(props)
  }


  // 渲染
  render() {
    return (
      <div className="MyVideoListItemOld">
        {
          this.props.data.map((item, index)=>{
            return (
              <div key={index} className="my_livelistitem_wrap">
                  <Link to={{pathname: `/videos/${item.id}`, state: item}}>
                    <div className="my_livelistitem_content clearfix">
                      <div className="img_wrap pull-left">
                        <img src={item.cover} alt=""/>
                        <p className="videotape_status_liveing">录像回放</p>
                      </div>
                      <div className="video_info pull-left">
                        <h5 className="title">{item.title}</h5>
                        <p className="hospital_info">
                          <span>{item.doctor.hospital.name}</span>
                          <span>{item.doctor.department.name}</span>
                        </p>
                        <p className="videolive_info clearfix">
                          <span className="doc_name pull-left">
                            <img src={doc1}/>
                            {item.doctor.name}
                          </span>
                          <span className="watch_count pull-left">
                            <img src={seed}/>
                            {item.watcher_count}
                          </span>
                          <span className=  {item.charge_free ==true ? "price_status_free pull-left" : "price_status_cost pull-left" }>
                            <img src={price1}/>
                            {item.charge_free ==true ? "免费" : "￥"+item.price }
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
              </div>
            )
          })
        }
      </div>
    )
  }
}
