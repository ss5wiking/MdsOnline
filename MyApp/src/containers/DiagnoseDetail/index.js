import React, {Component} from 'react';
import './index.scss';
import {Toast, Button} from 'antd-mobile';
import IScroll from "iscroll/build/iscroll-probe.js";
import ReactIScroll from "react-iscroll";
import url from '@/api'

export default class DiagnoseDetail extends Component {
	constructor(props){
		super(props) 
		this.state = {
			diagnose:{}
		}
	}
	componentDidMount(){
		//获取诊断信息
		_fetch(url.consults_show,{id:this.props.match.params.id})
			.then(({data,status})=>{
				if(status == 'success'){
					this.setState({diagnose:data.diagnose})
				}
			})
	}

	render() {
		const {diagnose} = this.state
		let objData = diagnose.diseases
		let str='' 
		objData && objData.map(function(item){
			str += item.name+'、' 
		})
		return (
			<ReactIScroll 
				iScroll = {IScroll}
			>
				<div className="DiagnoseDetail">
					<ul>
						<li>
							<div className="title">疾病类型</div>
							<p>{str.slice(0,-1)}</p>
						</li>
						<li className='middle'>
							<div className="title">患者主诉</div>
							<p>{diagnose.about}</p>
						</li>
						<li>
							<div className="title">处理意见</div>
							<p>{diagnose.suggestion}</p>
						</li>
					</ul>
				</div>
			</ReactIScroll>
		);
	}
}
