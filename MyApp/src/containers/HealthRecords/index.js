import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge, Switch, SwipeAction ,List, Picker,ActivityIndicator} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import moment from 'moment'
import {getCookie} from "@/lib/cookie";
import _ from 'lodash';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import {Link} from 'react-router-dom';
import arrow from "images/arrow.svg";

  export default class HealthRecords extends Component {
  // 默认数据
  constructor(props) {
    super(props)

    this.state={
      loading:true,
      name:"请选择",
      newData:[],
      MedicalrecordslistData:[],
      data:[],
      downData:{},
      defaultId:""
    }
  }
  handleClick(e) {
  }

  selectPople =(user) => {
    let data = this.state.newData[0]
    let label = data.find(function(item){
      return item.value == user[0]
    }).label
    let downData = this.state.data.find(function(item){
      return item.id == user[0]
    })
    this.setState({id:user[0],name:label,downData},()=>{
      this.getMedical_records();
    })
  }
  getData = ()=>{
    const {data} = this.state
    _fetch(api.familiesPath)
    .then(result=>{
      if(result.status=="success"){
        let newData=[[]]
        result.data.map(function(item){
          newData[0].push( {label:item.name ,value:item.id})
        })
        this.setState({
          loading:false,
          data:result.data,
          newData:newData
        },()=>{
          let family_id = ''
          this.props.location.state && (family_id = this.props.location.state.family_id)
          if(family_id){
            this.setState({defaultId:family_id})
            this.selectPople([family_id])
          }else{
            if(result.data.length>0){
              let defaultId = result.data.find(function(item){
                return item.default == true
              }).id
              this.setState({defaultId:defaultId})
              this.selectPople([defaultId])
            }
          }
        })
      }
    })
  }

  getMedical_records = ()=>{
    _fetch(api.medicalRecordsPath,{family_id:this.state.id})
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          loading:false,
          MedicalrecordslistData:result.data,
        })
      }
    })
  }
  handledelete= (e,itemid) =>{
    e.preventDefault()
    e.stopPropagation()
    _fetch(api.medicalRecordsDestroyPath,{family_id:this.state.id,id:itemid},"post")
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          loading:false,
          medicalRecordsDestroy:result.data,
        },()=>{
          this.getMedical_records();
        })
      }

    })
  }

  jump =(stateId, itemId) =>{
    console.log(this.props)
    this.props.history.push({
      pathname: '/AdditionCases',
      state: {
        family_id:stateId,
        medicalrecordid:itemId
      }
    })
  }
  componentDidMount(){
    console.log(this.props ,5698656)
    this.getData()


  }

  // 渲染
  render() {
    return (
      <div className="HealthRecords clearfix">
        <ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
        <div className="content">
          <div className="Member">
            <List>
              <Picker data={this.state.newData}  cascade={false}
                onChange={(user)=>{
                  this.selectPople(user);
                }}
      					title="家庭成员"
                extra={this.state.name}
      				>
      					<List.Item >家庭成员</List.Item>
      				</Picker>
            </List>
            {
              this.state.data.length>0 ?
              <p className="clearfix">
                <span className="pull-left"></span>
                <span className="pull-left">{this.state.downData && this.state.downData.gender == "male" ? "男" : "女"}</span>
                <span className="pull-left">{this.state.downData && this.state.downData.age}岁</span>
                <span className="pull-left">{this.state.downData && this.state.downData.relationship == "self" ? "自己"
                 :this.state.downData && this.state.downData.relationship == "parent" ?"父母"
                 :this.state.downData && this.state.downData.relationship == "child" ?"子女"
                 :this.state.downData && this.state.downData.relationship == "kinship" ? "亲属"
                 :this.state.downData && this.state.downData.relationship == "friend" ? "朋友": "其他"

                }本人</span>
                <span className="pull-right">
                  <img src={arrow}/>
                </span>
                  <Link to={"/HealthRecordsDetails/"+ this.state.downData.id}>
                    <span className="pull-right">健康档案</span>
                  </Link>
              </p>
              :
              <div className="no_HealthRecords">
                暂无家庭成员请添加
              </div>
            }

          </div>
          <div className="HealthRecords">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
              <div>
                <div className="title clearfix">
                   <span className="pull-left HealthRecords_word">病历</span>
                   <Link to="/AdditionCases">
                    <span className="pull-right add">添加病历</span>
                    <span className="pull-right">

                    </span>
                   </Link>
                </div>
                {this.state.MedicalrecordslistData&&

                    this.state.MedicalrecordslistData.length>0 ?
                    this.state.MedicalrecordslistData.map((item,index) =>{
                      var _this = this
                      return(
                          <div className="HealthRecords_item" key={index} onClick={()=> this.jump(this.state.id, item.id)} >

                            <SwipeAction
                              style={{ backgroundColor: 'gray' }}
                              autoClose
                              right={[
                                {
                                  text: '删除',
                                  onPress: (e) => this.handledelete(e,item.id),
                                  style: { backgroundColor: '#F4333C', color: 'white',width:'160px', fontSize:'30px' },
                                },
                              ]}

                              onOpen={() => console.log('global open')}

                            >
                              <List.Item
                                onClick={this.handleClick.bind(this)}
                              >
                                <div className="item clearfix">
                                  <div className="date pull-left">
                                    {moment(item.diagnosed_at).format("MM/DD")}
                                  </div>
                                  <div className="info pull-left">
                                    <p><span className="green_point"></span><span>{item.disease}</span></p>
                                    <p><span className="gray_point"></span><span>{item.department.name}</span></p>
                                    <p><span className="gray_point"></span><span>{item.hospital}</span></p>
                                  </div>
                                  <div className="Doctor pull-right">{item.doctor_name} 医生 </div>
                                </div>
                              </List.Item>
                            </SwipeAction>
                          </div>
                      )
                    })
                    :
                    <div className="no_Medicalrecord">
                      暂无病历
                    </div>

                }
              </div>
            </ReactIScroll>
          </div>
        </div>
      </div>
    )
  }
}
