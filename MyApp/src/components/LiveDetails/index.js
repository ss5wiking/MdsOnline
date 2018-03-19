import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import { Toast} from 'antd-mobile';
import './index.scss' ;
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";


export default class LiveDetails extends Component {
  constructor(props) {
    super(props)

    this.state={
      collectsed:""
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data.data){
      this.setState({
        collectsed:nextProps.data.data.collected,
      })
    }
  }

  handleYuyue = (id)=>{
    _fetch(api.createSubscribePath,{id},'POST')
    .then(res => {
      if(res.status == 'success'){
        this.props.onClicks && this.props.onClicks()
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleShouCang = (id,video) =>{

    _fetch(api.collectsCreate,{id,type: video},'POST')
    .then(res => {
      if(res.status == 'success'){
      this.setState({
        collectsed:true
      })
      Toast.info('收藏成功', 1);
    }
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleQuxiaoShouCang = (id,video) =>{
    _fetch(api.collectsDestroy,{id,type: video},'POST')
    .then(res => {
      if(res.status == 'success'){
        this.setState({
          collectsed:false
        })
      Toast.info('取消收藏', 1);
    }
    })
    .catch(err => {
      console.log(err);
    });
  }

  renderPaid () {
    const { data } = this.props
    const { paid ,live_status ,price } = data.data
    let info = {
      path: {
        pathname:'/checkout/',
        search: '?type=live',
        state: data.data
      },
      text: '',
      className: 'pay_red pull-left',
      price: ''
    }

    if (!paid) {
      if (live_status === 'end') {
        info.text = '直播已结束'
        info.className = 'pull-left'
        info.path.pathname = ""
      } else if (live_status === 'living') {
        info.text = '付费观看'
        info.price = price
      } else if (live_status === 'pending') {
        info.text = '付费观看'
        info.price = price
      }
    } else {
      if (live_status === 'end') {
        info.text = '直播已结束'
        info.className = 'pull-left'
        info.path.pathname = ""
      } else if (live_status === 'living') {
        return null
      } else if (live_status === 'pending') {
        return null
      }
    }

    return(

      <span>
        <Link to={info.path} className={info.className}>
          <a className={info.className}>{info.text}{info.price && `￥${info.price}`}</a>
        </Link>
        <a className="pull-right">更多</a>
      </span>
    )
  }

  renderVideoPaid () {
    const { data } = this.props
    const { paid ,live_status ,price } = data.data
    let info = {
      path: {
        pathname:'/checkout/',
        search: '?type=video',
        state: data.data
      },
      text: '',
      className: 'pay_red pull-left',
      price: ''
    }
    if (!paid) {
        info.text = '付费观看'
        info.price = price
    } else {
        info.text = '已付款'
        info.className = 'pull-left'
        info.path.pathname = ""
    }


    return(
      <span>
        <Link to={info.path} className={info.className}>
          <a className={info.className}>{info.text}{info.price && `￥${info.price}`}</a>
        </Link>
        <a className="pull-right">更多</a>
      </span>
    )
  }

  renderPrice () {
    const { data } = this.props
    const { price, paid, live_status } = data.data
    if (price > 0) {
      return this.renderPaid()
    } else {
      return (
        live_status == "pending" ?
          <span>
            <a className="pull-left" onClick={()=>this.handleYuyue(data.id)}>{data.subscribed == true ?"已预约" : "免费预约"}</a>
            <a className="pull-right">查看资料</a>
          </span>
          : live_status == "end" ?
          <span>
            <a className="pull-left" >直播已结束</a>
            <a className="pull-right">查看资料</a>
          </span>
          :
          ""
      )
    }
  }

  renderVideoPrice () {
    const { data } = this.props
    const { price, paid, live_status ,id} = data.data

    if (price > 0) {
      return this.renderVideoPaid()
    } else {
      return (
          <span>
          {
            this.state.collectsed ==false?
            <a className=" pull-left" onClick={()=>this.handleShouCang(id,"video")}>收藏免费录播</a>
            :
            <a className=" pull-left collectsed" onClick={()=>this.handleQuxiaoShouCang(id,"video")}>录播已收藏</a>
          }
          <a className="pull-right">更多</a>
          </span>
      )
    }
  }

  renderButton(){
    const { data } = this.props
    const { type, paid, price } = data

    if (data && String(type) === '1') {
      return (
        <div className="live_fixed_button clearfix">{this.renderPrice()}</div>
      )
    } else {
      return (
        <div className="live_fixed_button clearfix">
          {this.renderVideoPrice()}
        </div>
      )
    }
  }

  render() {

    const { data } = this.props.data;
    let startTime = moment(data.start_at).format('YYYY-MM-DD HH:mm');
		return (
      <div className="live_details_Components">
        <ReactIScroll
          iScroll={iScroll}
          options={{
            preventDefault:false
          }}
        >
            <div className="scroll_wrap">
              <p className="space_gray"></p>
              <div className="theme clearfix">
                <span className="theme_title pull-left">主题</span>
                <span className="theme_content pull-right">{data.title}</span>
              </div>
              {
                this.props.data.type&&this.props.data.type == 1 ?
                <div>
                <div className="start_at_time clearfix">
                  <span className="pull-left">开讲</span>
                  <span className="pull-right">{startTime}</span>
                </div>
                <div className="all_time all_div clearfix">
                  <span className="pull-left">时长</span>
                  <span className="pull-right">{parseInt(data.live_time)} 分钟</span>
                </div>
                </div>
                :
                null
              }
              <div className="live_price all_div clearfix">
                <span className="pull-left">费用</span>
                <span className="pull-right">{data.charge_free ? '免费' : data.price}</span>
              </div>
              <div className="live_department all_div clearfix">
                <span className="pull-left">科室</span>
                <span className="pull-right">{data.departments.join('，')}</span>
              </div>
              <div className="keywords_wrap clearfix">
                <p className="keywords_title">关键词</p>
                <p className="keyword_content">
                  {
                    data.tags && data.tags.map((item, index) => {
                      return(
                        <span key={index}>{item}</span>
                      )
                    })
                  }
                </p>
              </div>
              <div className="live_infomation">{data.description}</div>
            </div>
        </ReactIScroll>
        {this.renderButton()}
      </div>
		);
	}
}
