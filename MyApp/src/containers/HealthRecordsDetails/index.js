import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Switch, SwipeAction ,List} from 'antd-mobile';
import './index.scss';
import api from '@/api'
import classNames from 'classnames'
import moment from 'moment'
import {getCookie} from "@/lib/cookie";
import {Link} from 'react-router-dom';

import arrow from "images/arrow.svg";

  export default class HealthRecordsDetails extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      relationship:"请选择",
      userID:this.props.match.params.id,
      userData:{}
    }
  }
  handleClick(e) {
  }

  selectRelationship =(relationship ) => {
    let data = this.state.visibleData1[0]
    let label = data.find(function(item){
      return item.value == relationship[0]
    }).label
    this.setState({relationship:relationship[0],relation:label})
  }
  getData = ()=>{
    _fetch(api.familiesPath)
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          data:result.data
        })
      }
    })
  }

  getUserData = () => {
    _fetch(api.familiesShowPath,{id:this.state.userID})
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          userData:result.data
        })
      }
    })
  }


  componentDidMount(){
    this.getUserData()
  }


  // 渲染
  render() {
    console.log(this.state.userID, 9669696)
    const{userData } =this.state
    return (
      <div className="HealthRecordsDetails clearfix">
        <div className="HealthRecordsDetails_content">
          <div className="userinfo clearfix">
            <span className="pull-left">基本详情</span>
            <span className="pull-right">{this.state.userData&&this.state.userData.name} {this.state.userData&&this.state.userData.gender == "male" ? "男":"女"} {this.state.userData&&this.state.userData.age}岁</span>
          </div>
          <Link to={"/DiseaseObstetricalHistory/"+ this.state.userID}>
            <div className="item clearfix">
              <div className="pull-left">婚育史</div>
              <a  className="pull-right">
              <img src={arrow}/>
              </a>
              <div className="pull-right">
              {
                (userData.health_record && userData.health_record.marriage)
                ?
                `${userData.health_record.marriage.bearing ? userData.health_record.marriage.bearing : ""} ${userData.health_record.marriage.marry ? userData.health_record.marriage.marry : ""}`
                :
                "暂无"
               }
              </div>
            </div>
          </Link>

          <Link to={"/DiseaseSurgeryTrauma/"+ this.state.userID}>
            <div className="item clearfix">
              <div className="pull-left">手术和外伤</div>
              <a className="pull-right"><img src={arrow}/></a>
              <div className="pull-right">
              {
                (userData.health_record && userData.health_record.trauma)
                ? `${userData.health_record.trauma.content?userData.health_record.trauma.content : ""} ${userData.health_record.trauma.remark? userData.health_record.trauma.remark :""}`
                :
                "暂无"
              }
              </div>
            </div>
          </Link>

          <Link to={"/DiseaseDrugAllergy/"+ this.state.userID}>
            <div className="item clearfix">
              <div className="pull-left">药物过敏</div>
              <a className="pull-right"><img src={arrow}/></a>
              <div className="pull-right">
              {
                (userData.health_record && userData.health_record.medicine_allergy)
                ? `${userData.health_record.medicine_allergy.content?userData.health_record.medicine_allergy.content : ""} ${userData.health_record.medicine_allergy.remark? userData.health_record.medicine_allergy.remark :""}`
                :
                "暂无"
              }
              </div>
            </div>
          </Link>
          <Link to={"/DiseaseFamilyHistory/"+ this.state.userID}>
            <div className="item clearfix">
              <div className="pull-left">家族病史</div>
              <a  className="pull-right"><img src={arrow}/></a>
              <div className="pull-right">
              {
                (userData.health_record && userData.health_record.history)
                ? `${userData.health_record.history.content?userData.health_record.history.content : ""} ${userData.health_record.history.remark? userData.health_record.history.remark :""}`
                :
                "暂无"
              }
              </div>
            </div>
          </Link>

          <Link to={"/DiseaseFoodAllergy/"+ this.state.userID}>
            <div className="item clearfix">
              <div className="pull-left">食物和接触无过敏</div>
              <a className="pull-right"><img src={arrow}/></a>
              <div className="pull-right">
              {
                (userData.health_record && userData.health_record.allergy)
                ? `${userData.health_record.allergy.content?userData.health_record.allergy.content : ""} ${userData.health_record.allergy.remark? userData.health_record.allergy.remark :""}`
                :
                "暂无"
              }
              </div>
            </div>
          </Link>

          <Link to={"/DiseaseHabitsCustoms/"+ this.state.userID}>
            <div className="item clearfix">
              <div className="pull-left">生物习惯</div>
              <a className="pull-right"><img src={arrow}/></a>
              <div className="pull-right">
              {
                (userData.health_record && userData.health_record.habit)
                ?
                `${userData.health_record.habit.content? userData.health_record.habit.content : ""} ${userData.health_record.habit.remark? userData.health_record.habit.remark: ""}`
                :
                "暂无"
               }
              </div>
            </div>
          </Link>

        </div>
      </div>
    )
  }
}
