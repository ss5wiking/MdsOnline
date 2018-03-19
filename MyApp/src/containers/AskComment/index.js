import React, {Component} from 'react';
import './index.scss';
import {Toast, Button} from 'antd-mobile';
import url from '@/api'
import star from "images/star.svg";
import star1 from "images/star1.svg";

export default class AskComment extends Component {
	constructor(props){
		super(props) 
		this.state = {
			starIndex:4,
			id:props.match.params.id,
			content:'',
			doctor:{
				hospital:{},
				department:{}
			}
		}
	}
	componentDidMount(){
		//获取医生信息
		_fetch(url.consults_show,{id:this.props.match.params.id})
			.then(({data,status})=>{
				if(status == 'success'){
					this.setState({doctor:data.doctor})
				}
			})
	}
	handleSubmit = ()=>{
		const { starIndex,id,content } = this.state
		_fetch(url.consults_feedback,{
			id,
			grade:starIndex + 1,
			content,
		}, 'POST')
			.then(({data,status})=>{
				if(status == 'success'){
					Toast.info('评价成功！',1)
					this.props.history.goBack()
				}
			})
	}
	render() {
		const {starIndex, doctor} = this.state
		return (
			<div id="AskComment">
				<div className='clearfix'>
					<img src={doctor.avatar} alt="" className='headimg pull-left'/>
					<div className='head'>
						<strong>{doctor.name}</strong>
						<p>{doctor.hospital.name} {doctor.department.name}</p>
						<p>满意度<i>{doctor.consults_grade}</i> &nbsp;&nbsp;&nbsp;&nbsp;接诊数 <i>{doctor.consults_count}</i></p>
					</div>
				</div>
				<div className='already'>
					<p className='hrizontal'>—————— 评价本次问诊  ——————</p>
					{
						[1,1,1,1,1].map((item,index)=>{
							if(index <= starIndex){
								return <img src={star1} alt="" onClick={()=>this.setState({starIndex:index})} key={index}/>
							}else{
								return <img src={star} alt="" onClick={()=>this.setState({starIndex:index})} key={index}/>
							}
						})
					}					
				</div>
				<textarea cols="30" rows="10" placeholder='对于本次问诊的补充和建议' onChange={(e)=>this.setState({content:e.target.value})}></textarea>
				<Button style={{ width: '80%',margin:'0.6rem auto' }} type="primary" onClick={this.handleSubmit}>提交评价</Button>
			</div>
		);
	}
}
