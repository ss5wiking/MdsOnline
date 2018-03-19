import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { WhiteSpace, WingBlank, SearchBar, Button , Tabs, Badge ,Toast} from 'antd-mobile';
import './index.scss' ;
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import api from '@/api'
// import dianjishubiao from 'static/dianjishubiao.svg';
import _ from 'lodash/collection';
import dianzaned from "images/dianzaned.svg";
import dianzan from "images/dianzan.svg";
import huifu from "images/huifu.svg";

export default class CommentConponents extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id:props.data.id,
  		body:"",
      data:[],
      meta:{
        last_id:"",
        offset:""
      },
      end:"flase",
  	}
  }
  componentDidMount(){

    // 获取评论列表
    this.getList();


  }
  // if(this.props.data.liveStatus == "pending"){}
  getList = (opts = {})=>{
    let livetype= ""
    if(this.props.data.liveStatus=="pending"||this.props.data.liveStatus=="end"){
      livetype = "live"
    }else{
      livetype = "video"
    }
    _fetch(api.commentsPath, {id: this.state.id, type: livetype, ...opts  })
      .then(({ status, data, meta }) => {
        if(status == 'success') {
          this.setState({
            data:this.state.data.concat(data),
            meta
          },()=>{
            iScroll.scrollTo(0, 100000000);
          })

        }
      })
      .catch(err => {});
  }
// 发送消息
    sendMsg = (txt)=>{
      let livetype= ""
      if(this.props.data.liveStatus=="pending"||this.props.data.liveStatus=="end"){
        livetype = "live"
      }else{
        livetype = "video"
      }
  		if(this.state.body){
        _fetch(api.commentsCreatPath, {id:this.state.id , type: livetype, content:this.state.body},'POST')
          .then( res => {
            if(res.status == "success") {
              let newData = this.state.data
              newData.unshift(res.data)
              this.setState({
                data: newData,
                body:"",
					      comments:[]
              },()=>{
                this.props.onClicks && this.props.onClicks()
              })
            }
          })
  		}else{
  			 Toast.info('请输入内容', 1);
  		}
  	}
//输入框
  inputChange = (e) =>{
		this.setState({
			body:e.target.value
		})
  }
  scrollEnd = (iScrollInstance) =>{
    if(Math.abs(iScrollInstance.scrollerHeight)> iScrollInstance.wrapperHeight && iScrollInstance.maxScrollY === iScrollInstance.y ){
      console.log("到底了")
      const { meta } = this.state
      if(this.state.meta.last_id != null){
        this.getList( meta );
      }
		}else {

		  console.log("没有评论了")
		}
	}
// 回复
  onReply(name) {
    this.setState({
        body: `回复『${name}』：`
    })
  }

  // 点赞
  onStar = (id, index) => {

    let newData = this.state.data
    _fetch(api.likePath, {id},'POST')
      .then( res => {
        if(res.status == "success"){
          if(res.data.liked) {
            newData.map(function(item){
              if(item.id == id){
                item.likes_count +=1
                item.click = true
              }
            })
          }else{
            newData.map(function(item){
              if(item.id == id){
                item.likes_count -=1
                item.click = false
              }
            })
          }
          this.setState({data:newData})
        }else{
          404
        }
      })
  }

  render() {
		//let i = this.props.index;
    const data = this.state.data;

		return (
      <div className="comment_wrap_Components">
        <div className="space_gray">全部评论({this.props.data.comments_count})</div>
        <div className="comment_list_wrap">
          <ReactIScroll
            iScroll={iScroll}
            onScrollEnd={this.scrollEnd}
            options={{
              preventDefault:false
            }}
          >
            <ul className="comment_list">
              {
                data.length>0 ?
                  data.map((item, index)=>{
                    return (
                      <li className="clearfix" key={index}>
                        <div className="user_headimg pull-left">
                          <img src={item.user.avatar}/>
                        </div>
                        <div className="comment_content pull-left">
                          <p className="clearfix">
                            <span className="pull-left">{item.user && item.user.name ? item.user.name : '匿名'}</span>
                            <span className="pull-right">{item.reply_at}</span>
                          </p>
                          <p>{item.content}</p>
                          <p>
                            <span onClick={() => {this.onStar(item.id,index)}}>
                            {item.click==true ?
                              <img src={dianzaned}/>
                              :
                              <img src={dianzan}/>
                            }
                              <i>赞({item.likes_count})</i>
                            </span>
                            <span onClick={() => {this.onReply(item.user.name)}} >
                              <img src={huifu}/>
                              <i>回复</i>
                            </span>
                          </p>
                        </div>
                      </li>
                    )
                  })
                  :
                  null
              }
            </ul>
          </ReactIScroll>
        </div>
        <div className="comment_submit">
					<input placeholder="请输入评论～" value={this.state.body}  onChange={this.inputChange} />
					<Button type="primary" size="small" className="" onClick={this.sendMsg}>发送</Button>
				</div>
      </div>
		);
	}
}
