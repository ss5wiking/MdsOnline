import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge} from 'antd-mobile';
import {Link} from 'react-router-dom';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import classNames from 'classnames'
import moment from 'moment'
import {getCookie} from "@/lib/cookie";
import _ from 'lodash';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";

  export default class SelectorModalCity extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
        Province: [{code:"",name:"全国",id:"",active:true}],
        City: [{id: "", name: "不限"}],
    }
  }

  componentDidMount(){
    this.getProvince();
  }

  getProvince = ()=>{
    _fetch(api.RegionsProvincePath)
    .then(result=>{
      if(result.status=="success"){
        result.data.map(function(item){
          item.active = false
        })
        this.setState((prev,prop)=>{
          return {
            Province:prev.Province.concat(result.data)
          }
        })
      }
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
    this.setState({
      Province:newData,
      City:[{id: "", name: "不限"}]
    },()=>{
      if(ProvinceCode){
        _fetch(api.RegionsCityPath,{province : ProvinceCode})
        .then(result=>{
          if(result.status=="success"){
            this.setState((prev,props)=>{
              return {
                City:prev.City.concat(result.data)
              }
            },()=>console.log(this.state.City,9988))
          }
        })
      }
    })
  }

  getAction(CityId ,CityName){
    let newData = this.state.City
    newData.map(function(item){
      item.action = false
      if(item.id == CityId){
        item.action = true
      }
    })
    if(!CityId){
      CityId = _.find(this.state.Province, {'active': true }).id;
      CityName = _.find(this.state.Province, {'active': true }).name;
      this.props.onSub(CityId,CityName);
    }else{
      this.props.onSub && this.props.onSub(CityId,CityName);
    }
  }

	cancel(){
		this.props.onCancel && this.props.onCancel()
	}

  // 渲染
  render() {
    return (
      <div className={`${this.props.className} SelectorModalCity clearfix`}>
				<div className="title">
					<a className="cancel" onClick= {()=>this.cancel()}>取消</a>
				  选择地区
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
              this.state.City.length>0 && this.state.City.map( (item, index)=>(
                <a key={index}   onClick = {()=>this.getAction(item.id ,item.name)}>{item.name}</a>
              ))
            }
            </div>
            </ReactIScroll>
        </div>
      </div>
    )
  }
}
