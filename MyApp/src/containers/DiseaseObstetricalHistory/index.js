import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge,Toast} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import _ from 'lodash';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import {Link} from 'react-router-dom';


  export default class DiseaseObstetricalHistory extends Component {
  // 默认数据
  constructor(props) {
    super(props)

    this.state={
      data1:[],
      data2:[],
      userID:this.props.match.params.id,
      DiseaseObstetricalHistory:[
        {text:"已婚",isCheck:false},
        {text:"未婚",isCheck:false},
        {text:"离异",isCheck:false},
        {text:"丧偶",isCheck:false}
      ],
      FertilityCondition:[
        {text:"备孕期",isCheck:false},
        {text:"未生育",isCheck:false},
        {text:"怀孕期",isCheck:false},
        {text:"已生育",isCheck:false}
      ],
    }

  }

  handlechecked(index) {
    let arr = this.state.DiseaseObstetricalHistory;
    arr.map((item,i)=>{
      item.isCheck = false
      arr[index].isCheck = true
      this.setState({
        DiseaseObstetricalHistory:arr,
      })
    })
    // arr[index].isCheck = !arr[index].isCheck;
    // this.setState({
    //   DiseaseObstetricalHistory:arr,
    // })
  }
  handlecheck(index) {
    let newarr = this.state.FertilityCondition;
    newarr.map((item,i)=>{
      item.isCheck = false
      newarr[index].isCheck = true
      this.setState({
        FertilityCondition:newarr,
      })
    })
    // newarr[index].isCheck = !newarr[index].isCheck;
    // this.setState({
    //   FertilityCondition:newarr,
    // })
  }

  submitFuc = ()=>{

    let data1=_.filter(this.state.DiseaseObstetricalHistory, { 'isCheck': true });
    let data2=_.filter(this.state.FertilityCondition, { 'isCheck': true });

    console.log(this.state.userID,  63333)

    let formData = new FormData()
    formData.append('id', this.state.userID,)






    if(data1.length>0 && data2.length>0 ){
      formData.append('marriage[marry]', data1[0].text)
      formData.append('marriage[bearing]', data2[0].text)
      _fetch(api.familiesHealthRecordUpdatePath,formData,'FormData')
      .then(result=>{
        if(result.status=="success"){
          this.props.history.push("/HealthRecordsDetails/"+ this.state.userID)
        }
      })
    }else{
      Toast.info("提示",0.5);
    }
  }
  // 渲染
  render() {
    return (
      <div className="DiseaseObstetricalHistory clearfix">
        <div className="content clearfix">
          <div className="title">婚姻状况</div>
          <div className="DiseaseObstetricalHistory_main_wrap pull-left">
            {
              this.state.DiseaseObstetricalHistory.map(
                (item, index) =>{
                  return <div key={index} className={ item.isCheck ? 'item item_green pull-left' :'item pull-left'} onClick = {()=>{ this.handlechecked(index) }}>{item.text}</div>
                }
              )
            }
          </div>
          <div className="title">生育状况</div>
          <div className="DiseaseObstetricalHistory_main_wrap pull-left">
          {
            this.state.FertilityCondition.map(
              (data, index) =>{
                return <div key={index} className={ data.isCheck ? 'item item_green pull-left' :'item pull-left'} onClick = {()=>{ this.handlecheck(index) }}>{data.text}</div>
              }
            )
          }
          </div>

        </div>
          <div className="submit_button" onClick={this.submitFuc}>
            保存
          </div>
      </div>
    )
  }
}
