import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge,Picker, Toast,List ,ActivityIndicator} from 'antd-mobile';
import {Link} from 'react-router-dom';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import classNames from 'classnames'
import {getCookie} from "@/lib/cookie";
import _ from 'lodash/collection';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import moment from 'moment';
import WhiteNo from "@/components/WhiteNo";

import arrow from 'images/arrow.svg'
  export default class MyInquisition extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
      loading:true,
      usersConsults:null,
      visibleData1:[[
			    {
			      label: '图文问诊',
			      value: 'photo',
			    },
			    {
			      label: '电话问诊',
			      value: 'phone',
			    },
			    {
			      label: '视频问诊',
			      value: 'video',
			    },
		  ]],
    }
  }


  getUsersConsults(){
    _fetch(api.usersConsultsPath)
    .then(result=>{
      if(result.status=="success"){
        this.setState({

          usersConsults:result.data
        })
      }
    })
  }
  selectGender =(type) => {
    let data = this.state.visibleData1[0]
    let label = data.find(function(item){
      return item.value == type[0]
    }).label
    this.setState({type:type[0],sex:label})
  }

    componentDidMount(){
      _fetch(api.usersConsultsPath)
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            loading:false,
            usersConsults:result.data
          })
        }
      })
    }


  // 渲染
  render() {
    const{ visibleData1} = this.state
    return (

      <div className="MyInquisition clearfix">
        <div className="MyInquisition_wrap pull-left">
          <div className="MyInquisition_content">
            <ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
            <div className="scroll_wrap">
              { this.state.usersConsults &&
              <ReactIScroll
                iScroll={iScroll}
                options={{
                  preventDefault:false
                }}
              >
                <div>
                  {
                    this.state.usersConsults.length>0 ?
                     this.state.usersConsults.map((item, index)=>{
                      return<Link to={`/imageChat/${item.id}`} className="MyInquisition_content_item" key={index}>
                        <div className="title clearfix">
                          <span className="pull-left">{item.service_type == "photo" ? "图文问诊" : item.service_type == "phone" ? "电话问诊" :"视频问诊" }</span>
                          <span className="pull-right">{moment(item.created_at).format('YYYY-MM-DD')}</span>
                        </div>
                        <div className="item clearfix">
                          <div className="left pull-left">
                            <img src={item.doctor.avatar}/>
                          </div>
                          <div className="middle pull-left">
                            <p>{item.doctor.name}<span>({item.doctor.title})</span></p>
                            <p>{item.doctor.department.name}</p>
                            <p>{item.doctor.hospital.name}</p>
                          </div>
                          <div className="right pull-right clearfix">
                            <span className="status ing pull-left">{item.state == "pending" ? "准备中" : item.state == "diagnosing" ? "问诊中" : item.state == "diagnosed" ? "问诊结束" : "问诊完成"}</span>
                            <img src={arrow} className="pull-right"/>
                          </div>
                        </div>
                      </Link>
                    })
                    :
                    <WhiteNo text="问诊"/>
                  }
                </div>
              </ReactIScroll>
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
