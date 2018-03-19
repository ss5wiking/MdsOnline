import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge,List ,Picker,InputItem,TextareaItem,Toast} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import classNames from 'classnames'
import moment from 'moment'
import {getCookie} from "@/lib/cookie";
import _ from 'lodash/collection';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import {Link} from 'react-router-dom';


  export default class DiseaseFoodAllergy extends Component {
  // 默认数据
  constructor(props) {
    super(props)

    this.state={
      data1:[],
      data2:[],
      userID:this.props.match.params.id,
      DiseaseFoodAllergy:[
        {text:"牛奶",isCheck:false},
        {text:"海鲜",isCheck:false},
        {text:"花粉",isCheck:false},
        {text:"化妆品",isCheck:false},
        {text:"油漆",isCheck:false},
        {text:"皮毛",isCheck:false},
        {text:"笋",isCheck:false},
        {text:"芒果",isCheck:false},
        {text:"香菇",isCheck:false},

      ],
    }
  }

  handlechecked(index) {
    let arr = this.state.DiseaseFoodAllergy;
    arr[index].isCheck = !arr[index].isCheck;
    this.setState({
      DiseaseFoodAllergy:arr,
      onlyNone:false
    })
  }
  handleOnlyNone = ()=>{
    this.state.DiseaseFoodAllergy.map(function(item){
      item.isCheck = false
    })
    this.setState({onlyNone:true})
  }
  submitFuc = ()=>{
    let data1=_.filter(this.state.DiseaseFoodAllergy, { 'isCheck': true });
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

// formData.append('symptom_describe', symptom_describe)
    let formData = new FormData()
    formData.append('id', this.state.userID,)
    if(data1.length>0){
      for(var i=0;i<arr.length;i++){
        formData.append('allergy[content][]',arr[i])
      }

    }
    formData.append('allergy[remark]',this.state.symptom_describe ||"")

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
      <div className="DiseaseFoodAllergy clearfix">
        <div className="content clearfix">
          <div className="title">食物及接触物过敏</div>
          <div className="DiseaseFoodAllergy_main_wrap clearfix">
          <div className={ this.state.onlyNone ? 'item item_green pull-left' :'item pull-left'} onClick={this.handleOnlyNone}>暂无</div>
          {
            this.state.DiseaseFoodAllergy.map(
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

        <div className="submit_button" onClick={this.submitFuc}>
          保存
        </div>
      </div>
    )
  }
}
