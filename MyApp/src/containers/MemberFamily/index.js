
import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge, Switch, SwipeAction ,List ,ActivityIndicator} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import {Link} from 'react-router-dom';

import add from 'images/add.svg'
import white from 'images/white.svg'		


  export default class MemberFamily extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      data:[],
      loading:true,
    }
  }

  handleChecked = (id)=>{
    _fetch(api.familiesupdatedefaultPath,{id:id},"post")
    .then(result=>{
      if(result.status=="success"){
          this.getData()
      }
    })
  }

  handleDelete = (e,id)=>{
     e.preventDefault()
     e.stopPropagation()
    _fetch(api.familiesdestroyPath,{id:id},"post")
    .then(result=>{
      if(result.status=="success"){
          this.getData()
      }
    })
  }




  getData = ()=>{
    _fetch(api.familiesPath)
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          loading:false,
          data:result.data
        })
      }

    })
  }
  handleClick = (e)=>{
    e.preventDefault()
    e.stopPropagation()
    // console.log(e,'---')
  }

  componentDidMount(){
    this.getData()
  }

  // 渲染
  render() {
      console.log(this.state.data, 999999)
    return (

      <div className="MemberFamily_wrap clearfix">
      <ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
        {
          this.state.data&&
          this.state.data.length>0 ?
          <div className="MemberFamily_wrap_content">
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
              <div className="MemberFamily_wrap_iscroll">
                {
                  this.state.data.length>0 && this.state.data.map( (item, index)=>(
                    <Link to={{pathname:"/AddMemberFamily/" ,state:{id: item.id}}}  key={index} >
                      <SwipeAction
                        style={{ backgroundColor: 'gray' }}
                        autoClose
                        key={index}
                        right={[
                          {
                            text: '删除',
                            onPress: (e) => this.handleDelete(e,item.id),
                            style: { backgroundColor: '#F4333C', color: 'white',width:'200px' },
                          },
                        ]}
                        onOpen={() => console.log('global open')}
                        onClose={() => console.log('global close')}
                      >
                        <List.Item>
                          <div className="person_info_top clearfix" onClick = {this.handleClick}>
                            <div className="user_name pull-left">{item.name}</div>
                            <div className="user_sex pull-left">{item.gender == "male" ? "男":"女"}</div>
                            <div className="user_age pull-left">{item.age}岁</div>
                            <div className="user_relationship pull-left">{item.relationship== "self"?"自己" :item.relationship== "parent"?"父母" :item.relationship== "child"?"子女":item.relationship== "kinship"?"亲属" :item.relationship== "friend"?"朋友" :"其他"}</div>
                            <div className="user_checked pull-right">
                            <Switch
                              checked={item.default}
                              onChange={()=> this.handleChecked(item.id)}

                              disabled={item.default}
                            />
                            </div>
                            {item.default  && <div className="user_defult pull-right">默认就诊人</div>}
                          </div>
                          <div className="person_info_bottom clearfix">
                            <div className="user_id pull-left">{item.id_number}</div>
                            <div className="user_phone pull-right">{item.mobile}</div>
                          </div>
                        </List.Item>
                      </SwipeAction>
                    </Link>
                  ))
                }
              </div>
            </ReactIScroll>
            <p className="add_img">
              <Link to="/AddMemberFamily">
                <img src={add}/>
                新增成员
              </Link>
            </p>
          </div>
          :
          <div className="MemberFamily_none">
            <p className="img_wrap">
              <img src={white}/>
            </p>
            <p className="tips">
              您还没有添加家庭成员
            </p>
            <p className="add_button">
              <Link to="/AddMemberFamily">添加家庭成员</Link>
            </p>
            <p className="add_img">
              <Link to="/AddMemberFamily">
                <img src={add}/>
                添加成员
              </Link>
            </p>
          </div>
        }


      </div>
    )
  }
}
