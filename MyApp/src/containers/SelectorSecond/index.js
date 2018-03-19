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



  export default class SelectorSecond extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
        Department: [],
        Department_right: [],
    }
  }




  componentDidMount(){
    _fetch(api.departmentsPath)
    .then(result=>{
      if(result.status=="success"){
        result.data.map(function(item){
          item.active = false
        })
        this.setState({
          Department:result.data,
          Keshi:false
        })
      }
      console.log(this.state.Department, 6666666)
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
    _fetch(api.departmentsPath,{department : DepartmentId})
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          Department_right:result.data,
          Keshi:false
        })
      }
    })
  }

  getKeshi() {
    this.setState({
      Keshi:true,
      Department_right:[]
    })
  }
  getAction(DepartmentrightId){
    let newData = this.state.Department_right
    newData.map(function(item){
      item.action = false
      if(item.id == DepartmentrightId){
        item.action = true
      }
    })
    this.setState({})
  }

  // 渲染
  render() {
    console.log(this.state.Department,'==========')

    return (
      <div className="SelectorSecond clearfix">
        <div className="Selector_main_wrap pull-left">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <ul className="Selector_main">
              <li onClick = {()=>this.getKeshi()}>常见科室</li>
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
              this.state.Keshi == true ?
              <a className="action">常见科室</a>:""
            }
            {
              this.state.Department_right.length>0 && this.state.Department_right.map( (item, index)=>(
                <Link to={{pathname:'/AboutDoctor' ,state: {chek:item.name , department:item.id}}} key={index}  className={item.action==true && 'action'}  onClick = {()=>this.getAction(item.id)}>{item.name}</Link>
              ))
            }

            </div>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
