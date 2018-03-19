import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge} from 'antd-mobile';
import {Link} from 'react-router-dom';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import classNames from 'classnames'
import moment from 'moment'
import {getCookie} from "@/lib/cookie";
import _ from 'lodash/collection';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";

  export default class SelectorModalNew extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
			Department: [{id:"",name:"全部科室",active:true}],
			Department_right: [{id: "", name: "不限"}],
    }
  }

  componentDidMount(){
    this.getDepartmentLeft()
  }

  getDepartmentLeft =()=>{
    _fetch(api.departmentsPath,{filter:"pro"})
    .then(result=>{
      if(result.status=="success"){
        result.data.map(function(item){
          item.active = false
        })
        this.setState((prev,prop) => {
          return{
            Department:prev.Department.concat(result.data)
          }
        })
      }
    })
  }

  getDepartmentRight(DepartmentId) {
    let newData = this.state.Department
    newData.map(function(item){
      item.active = false
      if(item.id == DepartmentId){
        item.active = true
      }
    })
    this.setState({
      Department:newData,
      Department_right:[{id: "", name: "不限"}]
    },()=>{
      if(DepartmentId){
        _fetch(api.departmentsPath,{department : DepartmentId, filter:"pro"})
        .then(result=>{
        	if(result.status=="success"){
        		this.setState((prev,prop)=>{
              return{
                Department_right:prev.Department_right.concat(result.data)
              }
            })
        	}
        })
      }
    })
  }

  getAction(DepartmentrightId,DepartmentrightName){
    let newData = this.state.Department_right
    newData.map(function(item){
      item.action = false
      if(item.id == DepartmentrightId){
        item.action = true
      }
    })
    if(DepartmentrightId == ""){
      DepartmentrightId = _.find(this.state.Department, {'active': true }).id;
      DepartmentrightName = _.find(this.state.Department, {'active': true }).name;
      this.props.onUp(DepartmentrightId,DepartmentrightName);
    }else{
      this.props.onUp && this.props.onUp(DepartmentrightId,DepartmentrightName)
    }
  }

	cancel(){
		this.props.onCancelNew && this.props.onCancelNew()
	}

  // 渲染
  render() {
    return (
      <div className={`${this.props.className} myLiveListItem clearfix`}>
				<div className="title">
					<a className="cancel" onClick= { ()=>this.cancel()}>取消</a>
					选择科室
				</div>
        <div className="Selector_main_wrap pull-left">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <ul className="Selector_main">
              {
                this.state.Department.length>0 && this.state.Department.map( (item, index)=>(
                  <li key={index}  className={item.active==true && 'active'} onClick = {()=>this.getDepartmentRight(item.id)} >{item.name}</li>
                ))
              }
            </ul>
            </ReactIScroll>
        </div>
        <div className="Selector_else_wrap pull-left">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <div className="Selector_else">
            {
              this.state.Department_right.length>0 && this.state.Department_right.map( (item, index)=>(
                <a key={index}  className={item.action==true && 'action'}  onClick = {()=>this.getAction(item.id,item.name)}>{item.name}</a>
              ))
            }
            </div>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
