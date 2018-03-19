import React, { Component } from 'react';
import { Carousel, WhiteSpace, WingBlank,Icon } from 'antd-mobile';
import './index.scss';
import { NavLink } from 'react-router-dom';
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import {Link} from 'react-router-dom';
import bg_img from 'images/bg_img.png'
import mine_live_img from 'images/mine_live_img.svg'
import mine_video_img from 'images/mine_video_img.svg'
import doctor_img from 'images/doctor_img.svg'
import health_records_img from 'images/health_records_img.svg'
import family_archives_img from 'images/family_archives_img.svg'

console.log ( 
  bg_img , mine_live_img , 7878 )

export default  class Mine extends Component {
    // 默认数据
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    //当props或state更新之后，使用它更新DOM节点。元素完全挂在完毕，可以获取元素宽高信息
    componentDidMount(){
      _fetch(api.usersShowPath)
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            data:result.data
          })
        }

      })

  	}
    // 请求数据
    // <li className="list_content clearfix">
    //   <div className="content_left pull-left">
    //     <img src="/static/wallet_img.svg"/>
    //   </div>
    //   <div className="content_right pull-left">
    //     我的钱包
    //   </div>
    // </li>
    // 滚动

    // 渲染
    render() {
        return (

          <div className = "Mine_wrap" >
            <div className="head_img_wrap">
              <img src={bg_img} className="bg_img"/>
              <p className="user_img">
                <img src={this.state&&this.state.data.avatar}/>
              </p>
              <p className="user_name">{this.state&&this.state.data.name}</p>
              <p className="sevice_num_name">
                <Link to="/MyInquisition">
                  <p>{this.state&&this.state.data.consults_count}</p>
                  <p>我的问诊</p>
                </Link>
                <Link to="/WhitePage/">
                  <p>{this.state&&this.state.data.services_count}</p>
                  <p>已购服务</p>
                </Link>
                <Link to="/MyAttention">
                  <p>{this.state&&this.state.data.following_count}</p>
                  <p>我的关注</p>
                </Link>
              </p>

            </div>
            <div className="mine_tab clearfix">
              <NavLink to="/myLiveList" className="mine_live pull-left">
                <p><img src={mine_live_img}/></p>
                <p>我的直播</p>
              </NavLink>
              <NavLink to="/MyRecordingList"  className="mine_video pull-right">
                <p><img src={mine_video_img}/></p>
                <p>我的录播</p>
              </NavLink>
            </div>
            <ul className="mine_list">
              <li className="list_content clearfix">
                <div className="content_left pull-left">
                  <img src={doctor_img}/>
                </div>
                <Link to="/MineDoctorsList/">
                  <div className="content_right pull-left">
                    我的医生
                  </div>
                </Link>
              </li>
              <li className="list_content clearfix">
                <Link to="/MemberFamily">
                  <div className="content_left pull-left">
                    <img src={family_archives_img}/>
                  </div>
                  <div className="content_right pull-left">
                    家庭成员
                  </div>
                </Link>
              </li>
              <li className="list_content clearfix">
                <Link to="/HealthRecords">
                  <div className="content_left pull-left">
                    <img src={health_records_img}/>
                  </div>
                  <div className="content_right pull-left">
                    健康档案
                  </div>
                </Link>
              </li>

            </ul>
          </div>
        )
    }
}
