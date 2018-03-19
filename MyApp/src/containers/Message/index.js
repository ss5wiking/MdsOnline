import React, { Component, PropTypes } from 'react';
import './index.scss';
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import moment from 'moment';
import {Link} from 'react-router-dom';

import mds_message from 'images/mds_message.png'
import wenzhen_message from 'images/wenzhen_message.png'



  export default class Message extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
      system:{},
      consult:{},
    }
  }


  componentDidMount(){
    _fetch(api.messagesShowPath,{type:'consult'})
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          consult:result.data,
        })
      }
      console.log(this.state.consult, 56966666)
    })

    _fetch(api.messagesShowPath,{consult: 'system'})
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          system:result.data,
        })
      }
      console.log(this.state.system, 999999)
    })
  }

  // 渲染
  render() {
      const { consult,system} = this.state
    return (
      <div className="Message clearfix">
        <div className="Message_wrap pull-left">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <ul className="Message_list">
              <Link to='/MessageSys/'>
                <li className="clearfix">
                  <div className="img_wrap pull-left">
                    <img src={mds_message}/>
                  </div>
                  <div className="info pull-left">
                    <p className="clearfix">
                      <span className="pull-left">麦迪森</span>
                      <span className="pull-right">{system.last_message_at && moment(system.last_message_at).calendar()}</span>
                    </p>
                    <p className= "clearfix">
                      <span className="pull-left">麦迪森团队欢迎你的加入</span>
                      {
                        system.total>0 && <span className="pull-right">{system.total&&system.total}</span>
                      }
                    </p>
                  </div>
                </li>
              </Link>
              <Link to='/MessageInquiryNew/'>
                <li className="clearfix">
                  <div className="img_wrap pull-left">
                    <img src={wenzhen_message}/>
                  </div>
                  <div className="info pull-left">
                    <p className="clearfix">
                      <span className="pull-left">问诊通知</span>
                      <span className="pull-right ">{consult.last_message_at && moment(consult.last_message_at).calendar()}</span>
                    </p>
                    <p className= "clearfix">
                      <span className="pull-left">实时为您推送问诊动态</span>
                      {
                        consult.total>0 && <span className="pull-right">{consult.total&&consult.total}</span>
                      }

                    </p>
                  </div>
                </li>
              </Link>
            </ul>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
