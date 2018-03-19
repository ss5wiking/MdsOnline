import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router-dom';
import './index.scss';
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import WhiteNo from "components/WhiteNo";
import {Toast,ActivityIndicator} from 'antd-mobile';
import moment from 'moment';

import arrow from 'images/arrow.svg'		

  export default class MessageInquiryNew extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
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
    _fetch(api.usersConsultsPath,{page:this.state.page})
    .then(result=>{
      console.log(result,4444)
      if(result.status=="success"){
        if(result.data.length>0){
          this.setState({
            loading:false,
            data:this.state.data.concat(result.data),
            fetching:false,

          })
        }else{
          this.setState({
            fetching:false,
            loading:false
          })
          if(this.state.page !== 1){
            Toast.info('没有更多数据了！',1)

          }
        }
      }

    })

  }


  // 渲染
  render() {
    return (
      <div className="MessageInquiryNew clearfix">
        <div className="MessageInquiryNew_wrap pull-left">
        <ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            {
              this.state.data&&
              <ul className="MessageInquiryNew_list">
              {
                this.state.data.length>0 ?
                this.state.data.map((item,index) =>{
                  return(
                    <li className="clearfix" key={index}>
                      <p className="title">{moment(item.created_at).calendar()}</p>
                      <div className="info">
                        <p className="clearfix">
                          <span className="pull-left">{item.doctor.name}医生</span>
                          {
                            item.not_read_messages_count&&item.not_read_messages_count !== 0 ?
                              <span className="pull-right">{item.not_read_messages_count}</span>
                            :
                              null
                          }
                        </p>
                        <p>{item.symptom_describe}</p>
                        <p>
                          <Link to={`/imageChat/${item.id}`}>
                          查看详情<img src={arrow}/>
                          </Link>
                        </p>
                      </div>
                    </li>
                  )
                })
                :
                <WhiteNo text="问诊信息"/>
              }
              </ul>
            }
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
