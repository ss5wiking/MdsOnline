


import React, { Component, PropTypes } from 'react';
import { SwipeAction,ActivityIndicator} from 'antd-mobile';
import {Link} from 'react-router-dom';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import WhiteNo from "@/components/WhiteNo";
import _ from 'lodash';
import yellowstar from 'images/yellowstar.svg'
  export default class MyAttention extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      getusersFollowsDestroy:[],
      usersFollows:null,
    }
  }
// this.state.usersFollows&&this.state.usersFollows.length>0 ?
  // <WhiteNo text="关注"/>

  componentDidMount(){
    _fetch(api.usersFollowsPath)
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          loading:false,
          usersFollows:result.data,

        })
      }
    })
  }

  getusersFollows =() =>{
    _fetch(api.usersFollowsPath)
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          usersFollows:result.data,

        })
      }
    })
  }

  handledelete= (e,itemid) =>{
    e.preventDefault()
    e.stopPropagation()
    _fetch(api. FollowsDestroyPath,{doctor_id:itemid},"POST")
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          getusersFollowsDestroy:result.data,
        },()=>{
          this.getusersFollows();
        })
      }

    })
  }

  // 渲染
  render() {
    return (
      <div className="MyAttention clearfix">
        <ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
        <div className="MyAttention_wrap">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <div>
            { this.state.usersFollows &&
            <div className="wrap">
  						{
                this.state.usersFollows.length>0 ?
                  this.state.usersFollows.map( (item, index) =>(
                  <SwipeAction
                    style={{ backgroundColor: 'gray' }}
                    autoClose
                    right={[
                      {
                        text: '取消关注',
                        onPress: (e) => this.handledelete(e,item.id),
                        style: { backgroundColor: '#F4333C', color: 'white',width:'188px', fontSize:'30px' },
                      },
                    ]}

                    onOpen={() => console.log('global open')}
                    key={index}
                  >
  								<div  className="list_body">
  									<Link to={{pathname:"/DoctorDetails" ,state:{id:item.id}}} >
  										<div className="head clearfix">
  											<img src={item.avatar} alt="" className="pull-left"/>
  											<div className="pull-left">
  												<h2>{item.name}<small>({item.title})</small></h2>
  												<p>{item.hospital.name} {item.department.name}</p>
  												<p className='constr clearfix'>
  													<img src ={yellowstar} className="constr_img" />
  													{
  														item.consults_grade&&item.consults_grade!== 0 ?
                              <i>
  															{item.consults_grade}
                              </i>
  														:
  														"暂无"
  													}
  													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接诊数	&nbsp;

  													{
  														item.consults_count&&item.consults_count!== 0 ?
                              <i>
  														  {item.consults_count}
                              </i>
  														:
  														"暂无"
  													}

  												</p>
  											</div>
  										</div>
  										<div className="footer clearfix">
  											<div className='good_at pull-left'>
  												<strong>擅长：

  												</strong>
                          {
  													item.skills&&item.skills!=="" ?
  													item.skills
  													:
  													"暂未填写擅长内容"
  												}
  											</div>
  											<div className='services_price pull-right'>
  												{
  													item.services&&item.services.photo ?
  													<div>
  														<p className="price">
  															<span>￥</span>
  															<span>{
  																_.values(item.services).length>0 && _.minBy(_.values(item.services),(chr)=>{
  																	return chr.price
  																}).price
  															}</span>
  														</p>
  														<p className="services">
  															图文问诊
  														</p>
  													</div>
  													:
  													<div className="none_services">
  														<p>暂无</p>
  														<p>服务</p>
  													</div>
  												}

  											</div>
  										</div>
  									</Link>
  								</div>
                  </SwipeAction>
  							  ))
                  :
                <WhiteNo text="关注"/>
  						}
  					</div>
            }
            </div>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
