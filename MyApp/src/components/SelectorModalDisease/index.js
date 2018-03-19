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
// {id:"",name:"全部疾病",active:true}
  export default class SelectorModalDisease extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
      Department: [],
      Disease: [],
    }
  }

  componentDidMount(){
    this.getDepartmentLeft()
  }
  getDepartmentLeft =()=>{
    _fetch(api.departmentsPath,{filter:"disease"})
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

  getDisease(DepartmentId) {
    let newData = this.state.Department
    newData.map(function(item){
      item.active = false
      if(item.id == DepartmentId){
        item.active = true
      }
    })
    this.setState({
      Department:newData,
      Disease:[]
    },()=>{
      if(DepartmentId){
        _fetch(api.diseasesPath,{department : DepartmentId})
        .then(result=>{
        	if(result.status=="success"){
        		this.setState((prev,prop)=>{
              return{
                Disease:prev.Disease.concat(result.data)
              }
            })
        	}
        })
      }
    })
  }

  getAction(DiseaseId,DiseaseName){
    let newData = this.state.Disease
    newData.map(function(item){
      item.action = false
      if(item.id == DiseaseId){
        item.action = true
      }
    })
    this.props.onDown && this.props.onDown(DiseaseId,DiseaseName)
  }

	cancel(){
		this.props.onCancelDisease && this.props.onCancelDisease()
	}

  // 渲染
  render() {
    return (
      <div className={`${this.props.className} SelectorModalDisease clearfix`}>
				<div className="title">
					<a className="cancel" onClick= { ()=>this.cancel()}>取消</a>
					选择疾病
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
                  <li key={index}  className={item.active==true && 'active'} onClick = {()=>this.getDisease(item.id)} >{item.name}</li>
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
              this.state.Disease.length>0 && this.state.Disease.map( (item, index)=>(
                <Link to={{pathname:'/AboutDoctorDisease/' ,state: {chek:item.name , disease:item.id}}} key={index}  className={item.action==true && 'action'}  onClick = {()=>this.getAction(item.id,item.name)}>{item.name}</Link>
              ))
            }
            </div>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
