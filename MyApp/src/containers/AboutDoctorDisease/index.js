import React, {Component} from 'react';
import './index.scss';
import {Toast,Picker	,ActivityIndicator} from 'antd-mobile';
import IScroll from "iscroll/build/iscroll-probe.js";
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import api from '@/api'
import {Link} from 'react-router-dom';
import _ from 'lodash';

import SelectorModalCity from "components/SelectorModalCity";
import SelectorModalDisease from "components/SelectorModalDisease";
import WhiteNo from "@/components/WhiteNo";

import down from "images/down.svg";
import yellowstar from "images/yellowstar.svg";
export default class AboutDoctorDisease extends Component {
	constructor(props){
		super(props)
		this.state = {
			SelectorModalCityVisible:false,
			SelectorModalDisease:false,
			list:null,
			visible1:false,
			visible3:false,
			visibleValue1:'全部职称',
			visibleValue2:'全国',
			visibleValue3:'综合排序',
			visibleValue4:'全部科室',
			title:'',
			sort:'',
			city:'',
			disease:'',
			loading:true,
			visibleData1:[[
			    {
			      label: '全部职称',
			      value: '全部职称',
			    },
			    {
			      label: '主任医师',
			      value: '主任医师',
			    },
			    {
			      label: '副主任医师',
			      value: '副主任医师',
			    },
			    {
			      label: '主治医师',
			      value: '主治医师',
			    },
			    {
			      label: '住院医师',
			      value: '住院医师',
			    },
			    {
			      label: '其他',
			      value: '其他',
			    }


		  ]],
		  visibleData3:[[
			    {
			      label: '综合排序',
			      value: '综合排序',
			    },
			    {
			      label: '接诊高到低',
			      value: '接诊高到低',
			    },
			    {
			      label: '评价高到低',
			      value: '评价高到低',
			    },
		  ]]
		}
	}
	componentDidMount(){
	
			_fetch(api.doctorsPath,{disease:this.props.location.state.disease})
	    .then(result=>{
	      if(result.status=="success"){
	        this.setState({
						loading	:false,
	          list:result.data
	        })
	      }
	    })

		if(this.props.location.state&&this.props.location.state.name ){
			this.setState({
				visibleValue2:this.props.location.state.name,

			})
		}
		if(this.props.location.state&&this.props.location.state.chek ){
			this.setState({
				visibleValue4:this.props.location.state.chek,
				disease:this.props.location.state.disease
			})
		}
	}

	handleModle = (i)=>{
		this.setState({
			[`visible${i}`]:true
		})
	}

	handleModleHide = (v,i)=>{
		this.setState({[`visible${i}`]:false},()=>{
			if(v){
				this.setState({[`visibleValue${i}`]:v[0]},()=>{
					if(this.state.visibleValue1 == "主任医师"){
						this.setState({title:"physician"},()=>{
							this.getData()
						})
					}else if (this.state.visibleValue1 == "副主任医师") {
						this.setState({title:"deputy_physician"},()=>{
							this.getData()
						})
					}else if (this.state.visibleValue1 == "主治医师") {
						this.setState({title:"attending"},()=>{
							this.getData()
						})
					}else if (this.state.visibleValue1 == "住院医师") {
						this.setState({title:"resident"},()=>{
							this.getData()
						})
					}else if (this.state.visibleValue1 == "其它") {
						this.setState({title:"other"},()=>{
							this.getData()
						})
					}else {
						this.setState({title:""},()=>{
							this.getData()
						})
					}
				})
			}
		})
	}
	handleModleHide2 = (v,i)=>{
		this.setState({[`visible${i}`]:false},()=>{
			if(v){
				this.setState({[`visibleValue${i}`]:v[0]},()=>{
					if(this.state.visibleValue3 == "接诊高到低"){
						this.setState({[`visibleValue${i}`]:v[0],sort:"diagnose"},()=>{
							this.getData()
						})

					}else if (this.state.visibleValue3 == "评价高到低") {
						this.setState({[`visibleValue${i}`]:v[0],sort:"grade"},()=>{
							this.getData()
						})

					}else {
						this.setState({[`visibleValue${i}`]:v[0],sort:""},()=>{
							this.getData()
						})

					}
				})

			}
		})
	}
	SelectorModalCityVisible = ()=>{
		this.setState({
			SelectorModalCityVisible:true,
		})
	}
	SelectorModalDisease = ()=>{
		this.setState({
			SelectorModalDisease:true
		})
	}

	citySelect =(id,name)=>{
		this.setState({SelectorModalCityVisible:false,city:id,visibleValue2:name},()=>{
			this.getData()
		})
	}

	diseaseSelect =(id,name)=>{
		this.setState({SelectorModalDisease:false,disease:id ,visibleValue4:name},()=>{
			this.getData()
		})

	}
	getData = ()=>{
		const {title,sort,city,disease} =this.state
		_fetch(api.doctorsPath,{ title,sort,city,disease })
		.then(result=>{
			if(result.status=="success"){
				this.setState({
					list:result.data
				})
			}
		})
	}
	render() {
		const {
			visible1,visible3,visibleData1,visibleData3,
			visibleValue1,visibleValue2,visibleValue3,visibleValue4
		} = this.state
		return (

			<div className="ExpertConsultation">
				<ul className="select clearfix">
					<li className="pull-left clearfix" onClick={()=>this.SelectorModalCityVisible()}>
						<div className="select_name pull-left">{visibleValue2}</div><img className="pull-left" src={down} alt=""/>
					</li>
					<li className="pull-left clearfix" onClick={()=>this.SelectorModalDisease()} >
						<div className="select_name pull-left">{visibleValue4}</div><img className="pull-left" src={down} alt=""/>
					</li>
					<li className="pull-left clearfix" onClick={()=>this.handleModle(3)}>
						<div className="select_name pull-left">{visibleValue3}</div><img className="pull-left" src={down} alt=""/>
					</li>
					<li className="pull-left clearfix" onClick={()=>this.handleModle(1)}>
						<div className="select_name pull-left">{visibleValue1}</div><img className="pull-left" src={down} alt=""/>
					</li>
				</ul>
				<ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
				<SelectorModalCity
					SelectorModalCityVisible = {this.state.SelectorModalCityVisible}
					onCancel={()=>this.setState({SelectorModalCityVisible:false})}
					onSub={(id,name)=>this.citySelect(id,name)}
					className={!this.state.SelectorModalCityVisible && 'up'}
				/>


				<SelectorModalDisease
					SelectorModalDisease = {this.state.SelectorModalDisease}
					onCancelDisease={()=>this.setState({SelectorModalDisease:false})}
					onDown={(id,name)=>this.diseaseSelect(id,name)}
					className={!this.state.SelectorModalDisease && 'upNew'}
				/>


				<Picker data={visibleData1} cols={1} cascade={false}
					visible={visible1}
					onOk= {(v)=>this.handleModleHide(v,1)}
					onDismiss={(v)=>this.handleModleHide(v,1)}
				>
        </Picker>


        <Picker data={visibleData3} cols={1} cascade={false}
        	visible={visible3}
					onOk= {(v)=>this.handleModleHide2(v,3)}
					onDismiss={(v)=>this.handleModleHide2(v,3)}>
        </Picker>
				{
					this.state.list &&
				<div className="ExpertConsultation_list_wrap">
					<ReactIScroll
		        iScroll={iScroll}
		        options={{
		          preventDefault:false
		        }}
		      >
					<div className="wrap">
						{ this.state.list.length>0 ?
							this.state.list.map( (item, index) =>(
								<div key={index} className="list_body">
									<Link to={{pathname:"/DoctorDetails" ,state:{id:item.id}}} >
										<div className="head clearfix">
											<img src={item.avatar} alt="" className="pull-left"/>
											<div className="pull-left">
												<h2>{item.name}<small>({item.title})</small></h2>
												<p>{item.hospital.name} {item.department.name}</p>
												<p className='constr clearfix'>
													<img src ={yellowstar} className="constr_img" />
													{
														item.consults_grade&&item.consults_grade!== 0 ?
														<i>
															{item.consults_grade}
														</i>
														:
														"暂无"
													}
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接诊数	&nbsp;

													{
														item.consults_count&&item.consults_count!== 0 ?
														<i>
															{item.consults_count}
														</i>
														:
														"暂无"
													}

												</p>
											</div>
										</div>
										<div className="footer clearfix">
											<div className='good_at pull-left'>
												<strong>擅长：

												</strong>
												{
													item.skills&&item.skills!=="" ?
													item.skills
													:
													"暂未填写擅长内容"
												}
											</div>
											<div className='services_price pull-right'>
												{
													item.services&&item.services.photo ?
													<div>
														<p className="price">
															<span>￥</span>
															<span>{
																_.values(item.services).length>0 && _.minBy(_.values(item.services),(chr)=>{
																	return chr.price
																}).price
															}</span>
														</p>
														<p className="services">
															图文问诊
														</p>
													</div>
													:
													<div className="none_services">
														<p>暂无</p>
														<p>服务</p>
													</div>
												}

											</div>
										</div>
									</Link>
								</div>
							))
							:
							<WhiteNo text="相关医生"/>
						}
					</div>
					</ReactIScroll>
				</div>
				}
			</div>

		);
	}
}
