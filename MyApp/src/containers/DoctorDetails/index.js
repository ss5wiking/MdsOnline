import React, { Component, PropTypes } from 'react';
import {WhiteSpace, WingBlank, Button , Tabs, Badge,Modal} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import _ from 'lodash';
import Talive from "components/Talive";
import Score from "components/Score";
import {Link} from 'react-router-dom';
import moment from 'moment';

import UnAttention from "images/UnAttention.svg";
import Attention from "images/Attention.svg";
import bgpople from "images/bgpople.png";
import tupianwenzhen from "images/tupianwenzhen.png";
import arrow from "images/arrow.svg";
  export default class DoctorDetails extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      info:"",
      key:'1',
      followed:false,
      opened:false,
      opening:false
    }
  }
  // doctorsConsultsFeedbacksPath
  handleToImageText = ()=>{
    //获取家庭成员
    _fetch(api.families)
      .then(({data,status})=>{
        if(status == 'success' && data.length>0){
            if(this.state.info.services){
              this.props.history.push(`/imageText/${this.state.info.services.photo.id&&this.state.info.services.photo.id}`)
            }
        }else{
          Modal.alert('','请先添加家庭成员')
        }
      })
  }

  height = () =>{
    let gootatHeight = this.refs.goodat.offsetHeight;
    let titleHeight = this.refs.title.offsetHeight;
    let DoctorDetails_info_height = this.refs.DoctorDetails_info.offsetHeight
    let contentHeight = gootatHeight +titleHeight
    let opened = this.state.opened

    if(contentHeight>DoctorDetails_info_height){
      this.setState({
        opened:true
      })
    }else{
      this.setState({
        opened:false
      })
    }
  }

  handleopen = ()=>{
    let opening = this.state.opening
    if(this.state.opening ==  false){
      this.setState({
        opening:true
      })
    }
    else{
      this.setState({
        opening:false
      })
    }

  }


  componentDidMount(){
    console.log(this.props,'=======')
    this.height()
    let id =  this.props.location.state.id&&this.props.location.state.id
    _fetch(api.doctorsShowPath,{ id })
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          info:result.data
        },()=>{
          this.height()
        })
      }
    })
    _fetch(api.doctorsConsultsFeedbacksPath,{ id })
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          Feedbacks:result.data
        },()=>{
          console.log(this.state.Feedbacks,99999)
        })
      }
    })
  }

  onRefresh = (iScrollInstance)=>{
    console.log(iScrollInstance)
    if(this.state.maxHeight < iScrollInstance.scrollerHeight){
    }
  }

  Heart = () =>{
    if(this.state.info.followed == false){
      _fetch(api.FollowsCreatePath,{doctor_id:this.state.info.id},'POST')
        .then(({status})=>{
          if(status == 'success'){
            this.setState((prev,props)=>{
              return {
                info:{
                  ...prev.info,
                  followed:true
                }
              }
            })

            Modal.alert('','关注成功')
          }
        })
    }else{
      _fetch(api. FollowsDestroyPath,{doctor_id:this.state.info.id},'POST')
        .then(({status})=>{
          if(status == 'success'){
            this.setState((prev,props)=>{
              return {
                info:{
                  ...prev.info,
                  followed:false
                }
              }
            })

            Modal.alert('','取消关注')
          }
        })
    }
  }

  render() {
    return (
      <div className="DoctorDetails clearfix">
          <ReactIScroll

            iScroll={iScroll}
            options={{
              preventDefault:false
            }}
            onRefresh={this.onRefresh}
          >
            <div className="all_wrap">
              <div className="DoctorDetails_head_wrap">
                {
                  this.state.info.followed == false ?
                  <div>
                    <img src={UnAttention} className="loveheart"  onClick={()=> this.Heart()}/>
                    <span className="Attention_status">关注</span>
                  </div>
                  :
                  <div>
                    <img src={Attention} className="loveheart"  onClick={()=> this.Heart()}/>
                    <span className="Attention_status">已关注</span>
                  </div>
                }
                <img src={bgpople} className="bg_img"/>
                <p className="user_img">
                  <img src={this.state.info.avatar}/>
                </p>
                <p className="user_name">{this.state.info.name}<span>({this.state.info.title})</span></p>
                <p className="hospital_name">
                  {this.state.info.hospital&&this.state.info.hospital.name}&nbsp;&nbsp;{this.state.info.department&&this.state.info.department.name}
                </p>
                <div className="DoctorDetails_title_wrap">
                  <div className="DoctorDetails_title_content">
                    <p>{this.state.info.consults_grade}</p>
                    <p>满意度</p>
                  </div>
                  <div className="DoctorDetails_title_content">
                    <p>{this.state.info.consults_count}</p>
                    <p>接诊人数</p>
                  </div>
                  <div className="DoctorDetails_title_content">
                    <p>{this.state.info.followers_count}</p>
                    <p>粉丝数</p>
                  </div>
                </div>
              </div>

              <div className="DoctorDetails_info_wrap">
                <div className={this.state.opening ? "DoctorDetails_info_auto DoctorDetails_info" : "DoctorDetails_info"} ref="DoctorDetails_info">
                  <p className="goodat" ref="goodat">
                    <span>擅长:</span>
                    {this.state.info.skills ? this.state.info.skills:"暂无擅长"}
                  </p>
                  <p className="title" ref="title">
                    <span>简介:</span>
                    {this.state.info.introduction ? this.state.info.introduction : "暂无简介"}
                  </p>
                </div>
                {this.state.opened == true ?
                  <div className="open" onClick={()=>this.handleopen()}>{this.state.opening?"收起":"展开"}</div>
                  :
                  ""
                }
              </div>

              <div className="DoctorDetails_all_sevice">
                <p className="all_sevice_title">问诊服务</p>
                <div className="DoctorDetails_all_sevice_content">
                  <div onClick={this.handleToImageText} className="clearfix sevice_content">
                    <img src={tupianwenzhen} className="pull-left"/>
                    <div className="pull-left">
                      <p>图文问诊</p>
                      <p>使用图文语音与医生沟通</p>
                    </div>
                    {
                      this.state.info&&this.state.info.services&&this.state.info.services.photo&&this.state.info.services.photo.price ?
                      <div className="pull-right">
                        <span>{this.state.info&&this.state.info.services&&this.state.info.services.photo&&this.state.info.services.photo.price}</span>
                        <span>元/次</span>
                      </div>
                      :
                      <span className="unopen pull-right">暂未开通</span>
                    }
                  </div>
                </div>
              </div>

              <div className="DoctorDetails_Original_wrap">
                <div className="DoctorDetails_Original">
                  <p className="title clearfix">
                    <span className="pull-left">TA的直播</span>
                    <span className="pull-left">(共{this.state.info.lives_count?this.state.info.lives_count : 0  }条直播)</span>
                    {this.state.info.lives_count&&this.state.info.lives_count >1 ?
                      <Link to={{pathname:`/DoctorsLivesList/${this.state.info&&this.state.info.id}` }}>
                        <a className="pull-right active moreLives">更多<img src={arrow}/></a>
                      </Link>
                      :
                      <a>
                        <a className="pull-right moreLives">更多<img src={arrow}/></a>
                      </a>
                    }
                  </p>
                  {
                    this.state.info.lives_count&&this.state.info.lives_count !== 0 ?
                    <Link to={{pathname:`/lives/${this.state.info&&this.state.info.live.id}` }}>
                    {
                      this.state.info&&<Talive data={this.state.info}  type="1"/>
                    }
                    </Link>
                    :
                    <div className="white_page">暂无直播</div>
                  }
                </div>
              </div>

              <div className="DoctorDetails_comment_wrap">
                <p className="title clearfix">
                  <span className="pull-left">患者评价</span>
                  <span className="pull-left">(共{this.state.Feedbacks&&this.state.Feedbacks.feedbacks_count}条评论)</span>
                  {
                    this.state.Feedbacks&&this.state.Feedbacks.feedbacks_count >= 5 ?
                    <Link to={{pathname:`/PatientEvaluation/${this.state.info&&this.state.info.id}` }}>
                      <a className="pull-right active moreFeedbacks">更多<img src={arrow}/></a>
                    </Link>
                    :
                    <a>
                      <a className="pull-right moreFeedbacks">更多<img src={arrow}/></a>
                    </a>
                  }
                </p>
                {
                  this.state.Feedbacks&&this.state.Feedbacks.feedbacks.length>0 ?
                  this.state.Feedbacks.feedbacks.map((item,index) =>{
                    return(
                      <div className="DoctorDetails_comment_content" key={index}>
                        <div className="DoctorDetails_comment_top clearfix">
                          <div className="comment_name_data pull-left">
                            <span>{item.patient.name}</span>
                            <span>{moment(item.created_at).format('YYYY-MM-DD')}</span>
                          </div>
                          <div className="comment_score pull-right">
                            <Score score = {item.grade}  width = "0.5rem" margin = "0.1rem"/>
                          </div>
                        </div>
                        <div className="DoctorDetails_comment_bottom clearfix">
                          {item.content}
                        </div>
                      </div>
                    )
                  })
                  :
                  <div className="white_page">暂无患者评价</div>
                }
              </div>
            </div>
          </ReactIScroll>
      </div>
    )
  }
}
