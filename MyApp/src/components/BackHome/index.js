/**
 * Created by mds on 17/11/8.
 */
import React, {Component} from 'react';
import './index.scss'
import icon from 'static/backhome.svg'
import { browserHistory } from 'react-router'

export default class BackHome extends Component {
	constructor(props){
		super(props)

		this.state={
			opacity:'opacity',
			side:'',
			onOff:false
		}
	}

	componentDidMount() {
		//console.log( this.props,88989898)
		let _this = this
		let timer = null
		const winWidth = document.documentElement.getBoundingClientRect().width
		this.home.addEventListener('touchstart',function(e){
			clearTimeout(timer)
			_this.setState({opacity:'',side:'side'})
			const event = e.touches[0]
			const gapx = event.pageX - this.offsetLeft
			const gapy = event.pageY - this.offsetTop
			this.addEventListener('touchmove',function(ev){
				const event = ev.touches[0]
				this.style.left = event.pageX - gapx + 'px'
				this.style.top = event.pageY - gapy + 'px'
			})
			this.addEventListener('touchend',function(){
				_this.setState({side:''})
				if(this.offsetLeft<= winWidth/2){
					this.style.left = '0.266667rem'
				}else{
					this.style.left = winWidth - this.offsetWidth - 20 + 'px'
				}
				clearTimeout(timer)
				timer = setTimeout(()=>{
					_this.setState({opacity:'opacity',onOff:false})
				},3000)
			})
		})
	}

	goHome = ()=>{
		this.setState({onOff:true})
		if(this.state.onOff){
			this.props.history.push('/streams')
		}
	}
	render() {
		const {opacity,side}= this.state;
		return(
			<div className="BackHome" ref={x=>this.home = x} onClick={this.goHome} >
				<img src={icon} alt="" className={`${opacity}${' '+side}`} />
			</div>
		)
	}
}
