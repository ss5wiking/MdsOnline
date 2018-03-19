import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './index.scss' ;
import {  List, Button,Toast} from 'antd-mobile';
import cookie from 'react-cookies';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import api from '@/api'

import laba1 from "images/laba1.svg";
import play_btn from "images/play_btn.svg";
import pay_money from "images/pay_money.svg";
import person_number from 'images/person_number.svg';

export default class ChatRoom extends Component {
  constructor(props) {
		super(props)

    this.state = {
  		loading:false,
      chatList1:[],
  		chatList:[],
  		inputValue:"",
      bounties_amount:props.data.bounties_amount || 0,
      bounties_count:props.data.bounties_count || 0,
      watcher_count:props.data.watcher_count || 0,
      data: [],
      scrollerHeight:0
  	}
		this.ws = new WebSocket(api.webSocketPath);
	}

  componentDidMount() {
    _fetch(api.showChatRoom,{id : this.props.data.id},'GET')
    .then(result=>{
      if(result.status=="success"){
        this.setState({
          chatList1:result.data
        },()=>{
          this.refs.iScroll.withIScroll(function(iScroll) {
              iScroll.scrollTo(0,iScroll.maxScrollY)
            })
        })
      }
    })

		this.ws.onopen = ()=>{
			this.ws.send(JSON.stringify({
				"command": "subscribe",
				"identifier": JSON.stringify({
					"channel": "StreamRoomChannel",
					"stream_id": window.parseInt(this.props.data.id)
				})
			}));
		}

		this.ws.onmessage = (evt)=>{
			let obj_msg = JSON.parse(evt.data);
			if(obj_msg.message){
				if(obj_msg.message.data){
          if(obj_msg.message.data.type == 'payment'){
            this.setState({
              bounties_amount:obj_msg.message.data.stream_payment_count,
              bounties_count:obj_msg.message.data.user_count,
            },()=>{
              this.props.onClick && this.props.onClick()
            })
          }
					let arr = this.state.chatList;
					arr.push(obj_msg.message.data);
					this.setState({
						chatList:arr,
						inputValue:"",
						loading:false,
					},()=>{
    				this.refs.iScroll.withIScroll(function(iScroll) {
    			      iScroll.scrollTo(0,iScroll.maxScrollY)
    			    })
    			})
				}
			}
		};
	}
	componentWillUnmount(){
		this.ws.close();
	}
  inputChange = (e) =>{
		this.setState({
			inputValue:e.target.value
		})
	}
  sendMessage=()=>{
		let inputValue = this.state.inputValue;
		if(inputValue !== ""){

			this.ws.send(JSON.stringify({
				"command": "message",
				"identifier": JSON.stringify({
					"channel": "StreamRoomChannel",
					"stream_id": window.parseInt(this.props.data.id)
				}),
				"data": JSON.stringify({
					"action": "speak",
					token:cookie.load("mds_token"),
					content: inputValue
				})

			}))
		}else{
			 Toast.info('请输入内容', 0.7);
		}

	}
  render() {
      const { data, i } = this.props;
    return (
      <div className="chat_room_wrap">
        <p className="live_status"><span>正在直播: {this.props.data.title}</span></p>
        <div className="chat_room_list">
          <ReactIScroll
            iScroll={iScroll}
            options={{preventDefault:false}}
            ref="iScroll"
          >
            <ul className="" id="message">
            {
              this.state.chatList1.length > 0&&
              this.state.chatList1.map((item, index)=>{
                if(item.type == "payment"){
                  return (
                    <li className="them_chat" key={index}>
                      <div className="pos_status clearfix">
                        <div className="img_wrap pull-left">
                          <img src={laba1} className="laba1"/>
                          <span className="chat_user_name">
                            系统公告
                          </span>
                        </div>
                        <div className="chat_text pull-left">
                          <i className="triangle_left"></i>
                          &nbsp;{item.user_name}打赏了主播{item.content}元
                        </div>
                      </div>
                    </li>
                  )
                }else{
                  return(
                    item.user_id == cookie.load("user_id") ?
                    <li className="my_chat" key={index}>
                      <div className="pos_status clearfix">
                        <div className="img_wrap pull-right">
                          <img src={item.user_image_url}/>
                          <span className="chat_user_name">
                            {item.user_name}
                          </span>
                        </div>
                        <div className="chat_text pull-right">
                          <i className="triangle_right"></i>
                          {item.content}
                        </div>
                      </div>
                    </li>
                    :
                    <li className="them_chat" key={index}>
                      <div className="pos_status clearfix">
                        <div className="img_wrap pull-left">
                          <img src={item.user_image_url}/>
                          <span className="chat_user_name">
                            {item.user_name}
                          </span>
                        </div>
                        <div className="chat_text pull-left">
                          <i className="triangle_left"></i>
                          {item.content}
                        </div>
                      </div>
                    </li>
                  )
                }
              })
            }
              {
              	this.state.chatList.length > 0&&
            		this.state.chatList.map((item, index)=>{
                  console.log(item, 33333)
            			if(item.type == "payment"){
            				return (
                      <li className="them_chat" key={index}>
                        <div className="pos_status clearfix">
                          <div className="img_wrap pull-left">
                            <img src={laba1} className="laba1"/>
                            <span className="chat_user_name">
                              系统公告
                            </span>
                          </div>
                          <div className="chat_text pull-left">
                            <i className="triangle_left"></i>
                            &nbsp;{item.user_name}打赏了主播{item.content}元
                          </div>
                        </div>
                      </li>
            				)
            			}else{
            				return(
                      item.user_id == cookie.load("user_id") ?
                      <li className="my_chat" key={index}>
                        <div className="pos_status clearfix">
                          <div className="img_wrap pull-right">
                            <img src={item.user_image_url}/>
                            <span className="chat_user_name">
                              {item.user_name}
                            </span>
                          </div>
                          <div className="chat_text pull-right">
                            <i className="triangle_right"></i>
                            {item.content}
                          </div>
                        </div>
                      </li>
                      :
                      <li className="them_chat" key={index}>
                        <div className="pos_status clearfix">
                          <div className="img_wrap pull-left">
                            <img src={item.user_image_url}/>
                            <span className="chat_user_name">
                              {item.user_name}
                            </span>
                          </div>
                          <div className="chat_text pull-left">
                            <i className="triangle_left"></i>
                            {item.content}
                          </div>
                        </div>
                      </li>
            				)
            			}
            		})
              }
            </ul>
          </ReactIScroll>
        </div>
        <div className="chat_fixed clearfix">
          <Link to={{ pathname: '/checkout', search: '?type=bounty',  state: data }}>
            <div className="reward pull-left">
              <img src={play_btn}/>
            </div>
          </Link>
          <div className="chat_input pull-left">
            <input type="text" name="" value={this.state.inputValue}  onChange={this.inputChange} id="stream_chat_information"/>
          </div>
          <input type="button" id="message_button" value="发送" onClick={this.sendMessage} className="send pull-right"/>
          {/*  <input type="button" id="message_button" value="发送" className="send pull-right disabled" disabled="disabled"/>*/}
        </div>
          <div className="reward_man_no">
          <span>
            <img src={pay_money}/>
          </span>
          {this.state.bounties_count}人已经打赏{parseFloat(this.state.bounties_amount).toFixed(2)}元
        </div>
        <div className="reward_moneyall">
          <span>
            <img src={person_number}/>
          </span>
          {this.state.watcher_count}人
        </div>
      </div>
    );
  }
}
