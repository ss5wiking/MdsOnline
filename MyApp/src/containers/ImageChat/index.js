import React, {Component} from 'react';
import './index.scss';
import {ImagePicker,Toast,List} from 'antd-mobile';
import { NavLink } from 'react-router-dom';
import IScroll from "iscroll/build/iscroll-probe.js";
import ReactIScroll from "react-iscroll";
import url from '@/api'
import cookie from 'react-cookies';

import voice1 from "images/voice1.svg";
import voice from "images/voice.svg";
import sing from "images/sing.svg";
import star1 from "images/star1.svg";
import star from "images/star.svg";
import keyinput from "images/keyinput.svg";
import chatAdd from "images/chatAdd.svg";
import chatPic from "images/chatPic.svg";
import ipt from "images/ipt.jpg";
import sound from "images/sound.svg";


export default class ImageChat extends Component {
	constructor(props){
		super(props)
		this.socket = {}
		this.state = {
			panShow: false, //展开面板
			text:'', //输入框内容
			files: [], //图片
			totalMsg:[],//总消息
			src:'', //大图路径
			isOpen:false, //大图模态框
			OS:1, //苹果系统版本
			voiceShow:false, //话筒显示
			voiceSelect:false, //话筒图标点击
			voiceText:'按住说话',
			last_id:'', //分页id
			offset:'', //分页条数
			scrollOnOff:true,//是否开启滚动
			data:{}, //show接口数据
			hasHistory:true
		}
		this.ws = new WebSocket(url.webSocketPath);
		this.user_id = cookie.load("user_id");
		this.timer = null
	}
	componentDidMount(){
		//判断IOS 系统版本
		var OS = window.navigator.userAgent.match(/\d+_\d[_\d]?/g);
		if(OS){
			this.setState({OS:OS[0].split('_')[0]})
		}
		//获取聊天室状态
		this.getChatStatus()
		//获取历史记录
		_fetch(url.consults_messages_history,{id:this.props.match.params.id})
			.then(({data,meta,status})=>{
				if(status == 'success'){
					if(data && data.length>0){
						this.state.totalMsg = data.reverse().concat(this.state.totalMsg)
					}
					this.setState({
						last_id:meta.last_id,
						offset:meta.offset,
					})
				}
			})

		//第一次支付成功后进来
		if(localStorage.getItem('firstComing')){
			localStorage.setItem('firstComing','')
			this.sendSocketMsg('firstComing-1514268382594','text')
		}

		//建立聊天室
		this.ws.onopen = ()=>{
			this.ws.send(JSON.stringify({
				"command": "subscribe",
				"identifier": JSON.stringify({
					"channel": "ConsultChannel",
					"id": window.parseInt(this.props.match.params.id)
				})
			}));
		}
		//监听聊天室消息
		this.ws.onmessage = (evt)=>{
			let { totalMsg } = this.state
			let obj_msg = JSON.parse(evt.data);
			if(obj_msg.message && obj_msg.message.data){
				this.message_marked(obj_msg.message.data.id)
				if(obj_msg.message.type == 'action'){
					this.getChatStatus()
				}else{
					totalMsg.push(obj_msg.message.data)
					this.setState({scrollOnOff:true,totalMsg:totalMsg})
				}
			}
		};
	}

	//获取聊天室状态
	getChatStatus = ()=>{
		_fetch(url.consults_show,{id:this.props.match.params.id})
			.then(({data,status})=>{
				if(status == 'success'){
					this.setState({data})
				}
			})
	}
	//获取聊天历史记录
	getHistoryRecord = ()=>{
		let { last_id,offset } = this.state
		if(this.state.hasHistory){
			_fetch(url.consults_messages_history,{id:this.props.match.params.id,last_id,offset})
				.then(({data,meta,status})=>{
					if(status == 'success'){
						if(data && data.length>0){
							this.state.totalMsg = data.reverse().concat(this.state.totalMsg)
							this.setState({
								last_id:meta.last_id,
								offset:meta.offset,
								scrollOnOff:false
							},()=>console.log(this.state.totalMsg,'---------'))
						}else{
							Toast.info('没有更多数据了',1)
							this.setState({hasHistory:false})
						}
					}
				})
		}
	}
	//展开面板
	handlePan=(value)=>{
		this.setState({panShow:value})
	}
	//输入文本
	textChange=(e)=>{
		this.setState({text:e.target.value},()=>{
			this.refs.textarea.style.height = '';
			this.refs.textarea.style.height = this.refs.textarea.scrollHeight + 'px';
		})
	}
	//选择本地图片
	imgChange = (files) => {
		console.log(files);
		files.map((item)=>{
			this.sendSocketMsg(item.file,'image')
		})
		this.setState({panShow:false})
	}
	//点击发送按钮
	sendMsg = ()=>{
		const {text} = this.state
		if(text.trim()){
			this.sendSocketMsg(text,'text')
				.then(data=>{
					if(data.status == 'success'){
						this.setState({text:''},()=>{
							this.refs.textarea.style.height = '';
						})
					}
				})
		}else{
			 Toast.info('请输入内容', 0.7);
		}
	}
	//标记已读
	message_marked = (id)=>{
		let data = new FormData();
		data.append("id", this.props.match.params.id );
		data.append("message_ids", id );

		_fetch(url.make_read,data,'FormData')
	}
	//发送聊天室消息
	sendSocketMsg = (val,msg_type)=>{
		const id = window.parseInt(this.props.match.params.id)
		let option = {id,msg_type,text:val}
		if(msg_type == 'voice'){
			option = {id,msg_type,voice:val}
			return _fetch(url.consults_messages_send,option,'POST')
						.then(data=>{
							if(data.status == 'fail'){
								alert(data.error_message)
							}
						})
		}
		if(msg_type == 'image'){
			let formData = new FormData()
	    formData.append('id', id)
	    formData.append('msg_type', msg_type)
	    formData.append('image', val)
			return _fetch(url.consults_messages_send,formData,'FormData')
		}
		return _fetch(url.consults_messages_send,option,'POST')
	}
	//输入框聚焦
	handleFocus = ()=>{
		setTimeout(()=>{
			if(this.state.OS < 11){
				this.refs.ipt.scrollIntoView(true)
				this.refs.ipt.scrollIntoViewIfNeeded();
				document.body.scrollTop = 10000
			}
		},400)
	}
	//图片放大
	imgView = (src)=>{
		this.setState({
			isOpen:true,
			src,
		})
	}
	//切换语言输入
	handleVoice = ()=>{
		this.setState({voiceSelect:!this.state.voiceSelect})
	}
	//按下说话
	handleTouchStart = ()=>{
	 document.oncontextmenu = function(event){
      event.returnValue = false;
   };

		var _this = this
		this.setState({voiceText:'松开发送',voiceShow:true},()=>{
			wx.startRecord({
	      cancel: function () {
	        alert('用户拒绝授权录音');
	      }
	    });
	    this.recordStartTime = new Date().getTime()
		})

		//监听录音自动停止
	  wx.onVoiceRecordEnd({
	    complete: function (res) {
	    	this.setState({voiceText:'按住说话',voiceShow:false},()=>{
	    		//上传语音
					wx.uploadVoice({
					    localId:res.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
					    isShowProgressTips: 0, // 默认为1，显示进度提示
			        success: function (re) {
			        	// console.log(res.serverId,'已上传wx服务器')
			        	_this.sendSocketMsg(re.serverId,'voice')
					    }
					});
	    	})

	    }
	  });
	}

	//按下说话
	handleTouchEnd = ()=>{
		var _this = this
		this.state.voiceShow && this.setState({voiceText:'按住说话',voiceShow:false},()=>{
			this.recordEndTime = new Date().getTime()
			if(this.recordEndTime - this.recordStartTime > 1000){
				wx.stopRecord({
			    success: function (res) {
			    	// console.log('录音id:',localId)
		        var localId = res.localId;
						//播放语音
		    		//wx.playVoice({
						//   localId // 需要播放的音频的本地ID，由stopRecord接口获得
						// });
						//上传语音
						wx.uploadVoice({
						    localId, // 需要上传的音频的本地ID，由stopRecord接口获得
						    isShowProgressTips: 0, // 默认为1，显示进度提示
				        success: function (re) {
				        	// console.log(res.serverId,'已上传wx服务器')
				        	_this.sendSocketMsg(re.serverId,'voice')
						    }
						});
			    }
				});
			}else{
				Toast.info('录音时间太短！',1)
			}
		})

	}
	//播放video
	playVideo = (e)=>{
		var audio = ''
		var svg = ''
		// //如果点击的是图片
		if(e.target.tagName == 'IMG'){
			audio = e.target.previousSibling
			svg = e.target
		}else{
			audio = e.target.childNodes[0]
			svg = e.target.childNodes[1]
		}
		audio.load()
		audio.play()
		svg.src={voice1}
		audio.onended = function() {
	    svg.src={voice}
		};
	}
	componentWillUnmount(){
		this.ws.close();
	}
	onRefresh = (x)=>{
		const { maxScrollY, scrollOnOff} = this.state
		if((maxScrollY !== x.maxScrollY) && scrollOnOff){
			this.setState({maxScrollY:x.maxScrollY})
			this.refs.iScroll.withIScroll(function(iScroll) {
	      iScroll.scrollTo(0,x.maxScrollY, 400, {
					style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					fn: function (k) {
						return k * ( 2 - k );
					}
				})
	    })
		}
	}

	onScroll = (iscroll)=>{
		clearTimeout(this.timer)
		this.timer = setTimeout(()=>{
			if(iscroll.y >= 0){
				this.getHistoryRecord()
			}
		},500)
	}
	render() {
		const {panShow, text, totalMsg,isOpen, src,loadingShow,voiceShow,voiceText,voiceSelect} = this.state
		const {state:chat_state,feedback,diagnose,doctor,patient} = this.state.data
		return (
			<div id="ImageChat">
				<div className="box" onClick={()=>this.handlePan(false)}>
					<div className={`imgView ${isOpen && 'active'}`}>
						<ReactIScroll iScroll={IScroll} >
							<img src={src} alt="" onClick={()=>this.setState({isOpen:false})} />
						</ReactIScroll>
					</div>
					{
						voiceShow && <div className="voiceModal">
													<img src={sing} alt=""/>
												</div>
					}
					<div className={`warp ${(chat_state == 'diagnosed' || chat_state == 'completed') ? "max" : "" }`}>
					<ReactIScroll
						ref="iScroll"
						iScroll = {IScroll}
						onRefresh = {this.onRefresh}
						onScroll={this.onScroll}
						options={{
							probeType:2,
							preventDefault: false,
      				preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
      			}}
					>
						<ul>
						{
							totalMsg.length>0 && totalMsg.map((item,index)=>{
								if(item.from_user.id == this.user_id){
									if(item.message_type == 'text'){
										if(item.content.text == 'firstComing-1514268382594'){
											return (
												<li className='right clearfix' key={index}>
													<div className="head pull-right">
														<img src={item.from_user.avatar} alt=""/>
													</div>
													<div className="text text-health pull-right">
														<div className='healthText'>{`${patient && patient.name} ${patient && patient.gender == 'male'?'男':'女'} ${patient && patient.age}岁`}</div>
														<div className='healthText'>{this.state.data && this.state.data.disease}</div>
														<div className='healthText'>{this.state.data && this.state.data.symptom_describe}</div>
														{
															this.state.data && this.state.data.images && this.state.data.images.length>0 && this.state.data.images.map((iitem,i)=>{
																return <img src={iitem.thumb} alt="" onClick={()=>this.imgView(iitem.original)} key={i}/>
															})
														}
															<NavLink to={`/HealthRecordsDetails/${patient && patient.id}`}>
																<List.Item arrow="horizontal">患者健康档案</List.Item>
															</NavLink>
													</div>
												</li>
											)
										}else{
											return (
												<li className='right_text  clearfix' key={index}>
													<div className="head pull-right">
														<img src={item.from_user.avatar} alt=""/>
													</div>
													<div className="text pull-right">
														<span>{item.content.text}</span>
													</div>
												</li>
											)
										}
									}else if(item.message_type == 'image'){
										return (
											<li className='right clearfix' key={index}>
												<div className="head pull-right">
													<img src={item.from_user.avatar} alt=""/>
												</div>
												<div className="text pull-right">
													<img src={item.content.image.thumb} alt="" onClick={()=>this.imgView(item.content.image.original)}/>
												</div>
											</li>
										)
									}else if(item.message_type == 'voice'){
										return (
											<li className='right_text  voice_send clearfix' key={index}>
												<div className="head pull-right">
													<img src={item.from_user.avatar} alt=""/>
												</div>
												<div className="text pull-right" onClick={this.playVideo}>
													<audio src={item.content.voice.url}></audio>
													<img src={voice} alt="" className='voice_send_img'/>
													<span>{Math.ceil(item.content.voice.duration)}"</span>
												</div>
											</li>
										)
									}
								}else{
									if(item.message_type == 'text'){
										return (
											<li className='left clearfix' key={index}>
												<div className="head pull-left">
													<img src={item.from_user.avatar} alt=""/>
												</div>
												<div className="text pull-left">
													<span>{item.content.text}</span>
												</div>
											</li>
										)
									}else if(item.message_type == 'image'){
										return (
											<li className='left clearfix' key={index}>
												<div className="head pull-left">
													<img src={item.from_user.avatar} alt=""/>
												</div>
												<div className="text pull-left">
													<img src={item.content.image.thumb} alt="" onClick={()=>this.imgView(item.content.image.original)}/>
												</div>
											</li>
										)
									}else if(item.message_type == 'voice'){
										return (
											<li className='left voice_send clearfix' key={index}>
												<div className="head pull-left">
													<img src={item.from_user.avatar}  alt=""/>
												</div>
												<div className="text pull-left" onClick={this.playVideo}>
													<audio src={item.content.voice.url}></audio>
													<img src={voice} alt="" className='voice_send_img'/>
													<span>{Math.ceil(item.content.voice.duration)}"</span>
												</div>
											</li>
										)
									}
								}
							})
						}
						{
							diagnose && diagnose.about && (
								<li>
									<NavLink to={`/DiagnoseDetail/${this.props.match.params.id}`}>
										<div className='left clearfix'>
											{/* <div className="head pull-left">
												<img src={doctor.avatar} alt=""/>
											</div>*/}
											<div className="over">
												<div className='top'>诊断完成</div>
												<div className='middle'>{diagnose.about}</div>
												<List.Item arrow="horizontal">诊断意见详情</List.Item>
											</div>
										</div>
										<div className='diagnoseOver'>医生已提出诊断意见，快去查看吧~</div>
									</NavLink>
								</li>
							)
						}

						{
							chat_state == 'diagnosed' && (
								<li>
									<div>
										<p className='hrizontal'>——————— 问诊已结束  ———————</p>
										<NavLink to={`/askcomment/${this.props.match.params.id}`}>
	                    <p className='goCommet'>评价本次问诊&gt;&gt;</p>
	                  </NavLink>
									</div>
								</li>
							)
						}
						{
							chat_state == 'completed' && (
								<li>
									<div className='already'>
										<p className='hrizontal'>——————— 您已评价  ———————</p>
										{
											[1,1,1,1,1].map(function(item,index){
												if(index < feedback.grade){
													return <img src={star1} alt="" key={index}/>
												}else{
													return <img src={star} alt="" key={index}/>
												}
											})
										}
										<p>{feedback.content}</p>
									</div>
								</li>
							)
						}
						</ul>
						</ReactIScroll>
					</div>
				</div>
				{
					(chat_state != 'diagnosed' && chat_state != 'completed') && (
						<div className="bottom">
							<div className="head" ref = 'ipt'>
								<img src={voiceSelect ? {keyinput} : {sound} } alt="" onClick={this.handleVoice}/>
								{
									voiceSelect && <textarea
																	className='voice_text'
																	disabled
																	value={voiceText}
																	onTouchStart={this.handleTouchStart}
																	onTouchEnd={this.handleTouchEnd}
																	style={{background:voiceText == '松开发送' && '#ddd'}}
																/>
								}
								{!voiceSelect && <textarea  value={text} onChange={(e)=>this.textChange(e)} ref='textarea' onFocus={this.handleFocus} onBlur = {this.handleBlur}/>}
								<span onClick={this.sendMsg}>发送</span>
								<img src={chatAdd} alt="" onClick={()=>this.handlePan(true)}/>
							</div>
							<div className={panShow ? "body active" : 'body none'}>
								<ImagePicker
									onChange={this.imgChange}
								/>
								<ul className='clearfix'>
									<li className='pull-left'>
										<div>
											<img src={chatPic} alt=""/>
										</div>
										<span>照片</span>
									</li>
								</ul>
							</div>
							<img src={ipt} alt="" className='iptimg'/>
						</div>
					)
				}
			</div>
		);
	}
}
