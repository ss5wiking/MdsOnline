import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import './index.scss'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';
import * as tabBar from '@/actions/tabBar.js';
import Home from '@/containers/Home';
import Mine from '@/containers/Mine';
import FindDoctor from '@/containers/FindDoctor';
import MyLiveList from '@/containers/MyLiveList';
import Selector from '@/containers/Selector';
import Message from '@/containers/Message';
import MessageSys from '@/containers/MessageSys';
import MessageInquiryNew from '@/containers/MessageInquiryNew';
// 图片


// 找医生
// <TabBar.Item
// 	icon={
// 		<div
// 			style={{
// 				width: '0.66rem',
// 				height: '0.66rem',
// 				background: `url(/static/zhaoyisheng.svg) center center /  0.66rem 0.66rem no-repeat`
// 			}}
// 	/>
// 	}
// 	selectedIcon={
// 		<div
// 			style={{
// 				width: '0.66rem',
// 				height: '0.66rem',
// 				background: `url(/static/zhaoyisheng-xuanzhong.svg) center center /  0.66rem 0.66rem no-repeat`
// 			}}
// 		/>
// 	}
// 	title="找医生"
// 	key="找医生"
// 	selected={this.state.selectedTab === '1'}
// 	onPress={() => {
// 		this.setState({
// 			selectedTab: '1',
// 		});
// 		this.props.history.push('/HomePage/1')
// 	}}
// >
// 	<FindDoctor/>
// </TabBar.Item>

class TabBarItem extends Component {
	constructor(props) {
		super(props);
		console.log(this.props)
		let selectedTab = this.props.match.params.index ? this.props.match.params.index :'0';
		this.state = {
			selectedTab: selectedTab
		};
	}
	// this.props.location.state 可以拿到 Link ={{pathname: '/', state: 'mine'}}中的state
	render() {
		const {selectedTab} = this.props.state
		return (
		<TabBar
			unselectedTintColor="#565656"
			tintColor="#02cd8b"
			barTintColor="white"
		>
	        <TabBar.Item
				title="主页"
				key="主页"
				icon={
					<div
						style={{
							width: '0.66rem',
							height: '0.66rem',
							background: `url(${require('@/images/zhuye.svg')}) center center /  0.66rem 0.66rem no-repeat`
						}}
					/>
				}
				selectedIcon={
					<div
						style={{
							width: '0.66rem',
							height: '0.66rem',
							background: `url(${require('@/images/zhuye-xuanzhong.svg')}) center center /  0.66rem 0.66rem no-repeat`
						}}
					/>
				}

				selected={this.state.selectedTab === '0'}
				onPress={() => {
					this.setState({
						selectedTab: '0',
					});
					this.props.history.push('/HomePage/0')
				}}
	        >
				<Home {...this.props}/>
	        </TabBar.Item>

	        <TabBar.Item
				icon={
					<div
						style={{
							width: '0.66rem',
							height: '0.66rem',
							background: `url(${require('@/images/xiaoxi.svg')}) center center /  0.66rem 0.66rem no-repeat`

							
						}}
					/>
	        	}
				selectedIcon={
					<div
						style={{
							width: '0.66rem',
							height: '0.66rem',
							background: `url(${require('@/images/xiaoxi-xuanzhong.svg')}) center center /  0.66rem 0.66rem no-repeat`
						}}
					/>
				}
				title="消息"
				key="消息"
				selected={this.state.selectedTab === '2'}
				onPress={() => {
					this.setState({
						selectedTab: '2',
					});
					this.props.history.push('/HomePage/2')
				}}
	        >
				<Message/>
	        </TabBar.Item>
	        <TabBar.Item
				icon={
					<div
					style={{
						width: '0.66rem',
						height: '0.66rem',
						background: `url(${require('@/images/wode.svg')}) center center /  0.66rem 0.66rem no-repeat`
						
					}}
					/>
				}
				selectedIcon={
					<div
						style={{
							width: '0.66rem',
							height: '0.66rem',
							background: `url(${require('@/images/wode-xuanzhong.svg')}) center center /  0.66rem 0.66rem no-repeat`
							
						}}
					/>
				}
				title="我的"
				key="我的"
				selected={this.state.selectedTab === '3'}
				onPress={() => {
					this.setState({
						selectedTab: '3',
					});
					this.props.history.push('/HomePage/3')
				}}
	        >
				<Mine/>
	        </TabBar.Item>
        </TabBar>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		state: state.tabBar
	}
};
const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(tabBar, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(TabBarItem);
