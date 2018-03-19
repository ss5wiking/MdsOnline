import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge,List ,Picker,InputItem,TextareaItem,Toast} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import * as tabBar from '@/actions/tabBar.js';
import api from '@/api'
import classNames from 'classnames'
import moment from 'moment'
import {getCookie} from "@/lib/cookie";
import _ from 'lodash/collection';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import {Link} from 'react-router-dom';;


  export default class DiseaseFamilyHistory extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      data1:[],
      data2:[],
      userID:this.props.match.params.id,
      DiseaseFamilyHistory:[
        {text:"高血压",isCheck:false},
        {text:"糖尿病",isCheck:false},
        {text:"心脏病",isCheck:false},
        {text:"脑梗",isCheck:false},
        {text:"脑出血",isCheck:false},
        {text:"癌症",isCheck:false},
        {text:"过敏性",isCheck:false},
        {text:"哮喘",isCheck:false},
        {text:"癫痫病",isCheck:false},
        {text:"白癜风",isCheck:false},
        {text:"近视",isCheck:false},

      ],
    }
  }



  handlechecked(index) {
    let arr = this.state.DiseaseFamilyHistory;
    arr[index].isCheck = !arr[index].isCheck;
    this.setState({
      DiseaseFamilyHistory:arr,
      onlyNone:false
    })
  }
  handleOnlyNone = ()=>{
    this.state.DiseaseFamilyHistory.map(function(item){
      item.isCheck = false
    })
    this.setState({onlyNone:true})
  }
  submitFuc = ()=>{
    let data1=_.filter(this.state.DiseaseFamilyHistory, { 'isCheck': true });
    // let data2=_.filter(this.state.FertilityCondition, { 'isCheck': true });
      console.log(data1, 4888)
    let arr=[]
    data1.map((item, index) =>{
      arr.push(item.text)
    })
    this.setState({
      data2:arr
    },()=>{
      console.log(this.state.data2, 6555)
    })


    let formData = new FormData()
    formData.append('id', this.state.userID,)
    if(data1.length>0 ){
      for(var i=0;i<arr.length;i++){
        formData.append('history[content][]',arr[i])
      }
    }
    formData.append('history[remark]',this.state.symptom_describe || "")

    if(data1.length>0 || this.state.symptom_describe){
      _fetch(api.familiesHealthRecordUpdatePath,formData,'FormData')
      .then(result=>{
        if(result.status=="success"){
          this.props.history.push("/HealthRecordsDetails/"+ this.state.userID)
        }
      })
    }else{
      this.props.history.push("/HealthRecordsDetails/"+ this.state.userID)
    }
  }
  // 渲染
  render() {
    return (
      <div className="DiseaseFamilyHistory clearfix">
        <div className="content clearfix">
          <div className="title">家族病史</div>
          <div className="DiseaseFamilyHistory_main_wrap clearfix">
            <div className={ this.state.onlyNone ? 'item item_green pull-left' :'item pull-left'} onClick={this.handleOnlyNone}>暂无</div>
            {
              this.state.DiseaseFamilyHistory.map(
                (item, index) =>{
                  return <div key={index} className={ item.isCheck ? 'item item_green pull-left' :'item pull-left'} onClick = {()=>{ this.handlechecked(index) }}>{item.text}</div>
                }
              )
            }
          </div>
          <List>
            <List.Item>症状说明</List.Item>
            <TextareaItem
              maxLength={500}
              rows={5}
              placeholder="请详细描述您的病情，症状，治疗经过以及想要获得的帮助。（500字以内）"
              onChange={(symptom_describe)=>this.setState({symptom_describe})}
            />
          </List>
        </div>
        <Link to={"/HealthRecordsDetails/"+ this.state.userID}>
          <div className="submit_button" onClick={this.submitFuc}>
            保存
          </div>
        </Link>
      </div>
    )
  }
}
