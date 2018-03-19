import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';
import './index.scss';
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import WhiteNo from "components/WhiteNo";
import {Toast} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn.js';

  export default class MessageSys extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
      fetching:false,
      page:1,
      data:[]
    }
  }

  componentDidMount(){
    this.getMsg()
  }
  getMsg = ()=>{
    this.setState({fetching:true})
    _fetch(api.messagesPath,{page:this.state.page})
    .then(result=>{
      if(result.status=="success"){
        if(result.data.length>0){
          this.setState({
            data:this.state.data.concat(result.data),
            fetching:false
          })
        }else{
          this.setState({fetching:false})
          if(this.state.page !== 1){
            Toast.info('没有更多数据了！',1)
          }
        }
      }

    })

  }
  // 渲染
  render() {
  console.log(this.state.data, 56966666)
    return (
      <div className="MessageSys clearfix">
        <div className="MessageSys_wrap pull-left">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <ul className="MessageSys_list">
            {
              this.state.data&&this.state.data.length>0 ?
              this.state.data.map((item,index) =>{
                return(
                  <li className="clearfix" key={index}>
                    <p className="title">{moment(item.created_at).calendar()}</p>
                    <div className="info">
                      <p>麦迪森团队</p>
                      <p>{item.body}</p>
                    </div>
                  </li>
                )
              })
              :
              <WhiteNo text="系统消息"/>
            }
            </ul>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
