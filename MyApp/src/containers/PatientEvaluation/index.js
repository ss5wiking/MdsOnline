import React, { Component } from 'react';
import { connect } from 'react-redux';
import Score from 'components/Score'
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll/build/iscroll-probe.js';
import { Toast,ActivityIndicator } from 'antd-mobile';
import { Link } from 'react-router'
import moment from 'moment';
import api from '@/api';
import './index.scss' ;
import WhiteNo from "@/components/WhiteNo";
class PatientEvaluation extends Component{
  constructor(props){
    super(props)
    this.state={
      page:1,
      data:"",
      fetching:false,
      id:this.props.match.params.id,
      offset:"",
      last_id:"",
      loading:true,
      feedbacks:[]
    }
  }
  componentDidMount(){
    this.getEvaluation(this.state.id)
  }

  //获取评价数据
  getEvaluation = (id,offset,last_id)=>{
    this.setState({fetching:true})
    let option = {id: id}
    if(offset){
      option.offset = offset
    }
    if(last_id){
      option.last_id = last_id
    }
    _fetch(api.doctorsConsultsFeedbacksPath, option )
      .then( res => {
        if(res.status == "success") {
          this.setState({
            loading:false,
            data: res.data,
            feedbacks: this.state.feedbacks.concat(res.data.feedbacks),
            count:res.data.feedbacks.length,
            meta:res.meta,
            fetching:false,
            offset:res.meta.offset,
            last_id:res.meta.last_id,
          })
        }else{
          this.setState({
            fetching:false,
          })
          Toast.info('请求出错！',1)
        }
      })
  }
  //滚动翻页
  onScroll = (iscroll)=>{
    const { fetching, meta } =this.state
    if(!fetching && (iscroll.y < iscroll.maxScrollY)){
      if(this.state.count){
          this.getEvaluation(this.state.id,this.state.offset,this.state.last_id)
      }else{
        Toast.info('没有更多数据',1)
      }
    }
  }
  render(){
    const { data ,meta } = this.state
    console.log(this.state.feedbacks, 545454)
    return(
      <div className="PatientEvaluation">
      <ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
        <div className="box">

          <ReactIScroll
            iScroll={iScroll}
            onScroll = {this.onScroll}
            options={{ probeType:2,...global.iscrollOptions }}
          >
          <div className="">
            <div className="title">
              <span>患者评价：</span><Score score={  this.state.data&&this.state.data.feedbacks_grade&&this.state.data.feedbacks_grade} width='0.4rem' margin='0.05rem'/> <i>{data.feedback_grade}</i>
            </div>
            <div className="listTitle">共{data.feedbacks_count}条患者评价</div>
            {this.state.feedbacks.length>0 ?
              <ul>
              {
                  this.state.feedbacks.map(function(item,i){
                    return (
                      <li key={i}>
                        <h2>
                          <span className="name">{item.patient.name} {moment(item.created_at).format('YYYY-MM-DD')} </span>
                          <span className="type">图文问诊</span>
                          <div className="right">
                            <Score score={item.grade} width='0.3rem' margin='0.05rem'/>
                          </div>
                        </h2>
                        <p>
                          {item.content}
                        </p>
                      </li>
                    )
                  })
              }
              </ul>
              :
              <WhiteNo text="评价"/>
            }
          </div>
          </ReactIScroll>
        </div>
      </div>
    )
  }
}


export default connect(
  state => {
    return {
      userInfo: state.userInfo
    };
  }
)(PatientEvaluation);
