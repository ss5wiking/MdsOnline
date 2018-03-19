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



  export default class Selector extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
        Province: [],
        City: [],
        Quanguo:false,
    }
  }


  componentDidMount(){
    _fetch(api.RegionsProvincePath)
    .then(result=>{
      if(result.status=="success"){
        result.data.map(function(item){
          item.active = false
        })
        this.setState({
          Province:result.data,
          Quanguo:false
        })
      }
      console.log(this.state.Province, 56966666)
    })

  }

  getCity(ProvinceCode) {
    let newData = this.state.Province
    newData.map(function(item){
      item.active = false
      if(item.code == ProvinceCode){
        item.active = true
      }
    })
    _fetch(api.RegionsCityPath,{province : ProvinceCode})
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          City:result.data,
          Quanguo:false
        })
      }
      console.log(this.state.City, 888888)
    })
  }
  getQuanguo() {
    this.setState({
      Quanguo:true,
      City:[]
    })
  }


  getAction(CityId){
    console.log( CityId, 78877)
    let newData = this.state.City
    newData.map(function(item){
      item.action = false
      if(item.id == CityId){
        item.action = true
      }
    })
    this.setState({})
  }
  // 渲染
  render() {
    console.log(this.state.Province,'==========')
    console.log(this.state.City, 7777)
    return (
      <div className="myLiveListItemold clearfix">
        <div className="Selector_main_wrap pull-left">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <ul className="Selector_main">
              <li onClick = {()=>this.getQuanguo()}>全国</li>
              {

                this.state.Province.length>0 && this.state.Province.map( (item, index)=>(
                  <li key={index}  className={item.active==true && 'active'} onClick = {()=>this.getCity(item.code)} >{item.name}</li>
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
              this.state.Quanguo == true ?
              <a className="action">全国</a>:""
            }
            {
              this.state.City.length>0 && this.state.City.map( (item, index)=>(
                <Link to={{pathname:'/AboutDoctor',state:{name:item.name,city:item.id}  }} key={index}  className={item.action==true && 'action'}  onClick = {()=>this.getAction(item.id)}>{item.name}</Link>
              ))
            }
            </div>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
