import React, { Component, PropTypes } from 'react';
import {Toast,ActivityIndicator} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import _ from 'lodash';
import Talive from "components/Talive";
import Score from "components/Score";
import {Link} from 'react-router-dom';
import moment from 'moment';

  export default class DoctorsLivesList extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      id:this.props.match.params.id,
			data:"",
			fetching:false,
			loading:true,
    }
  }

  componentDidMount(){
		this.getLivesList(this.state.id)
  }

	getLivesList = (id)=>{
    this.setState({fetching:true})
    let option = {id: id}
    // if(offset){
    //   option.offset = offset
    // }
    // if(last_id){
    //   option.last_id = last_id
    // }
    _fetch(api.doctorsLives, option )
      .then( res => {
        if(res.status == "success") {
          this.setState({
						loading:false,
            data: res.data,
            meta:res.meta,
            fetching:false,
          })
        }else{
          this.setState({
						loading:false,
            fetching:false,
          })
          Toast.info('请求出错！',1)
        }
      })

      // item.has_video ? `/videos/${item.video.id}` :
  }


  render() {
		console.log(this.state, 4844848)
    return (
			<div className="DoctorsLivesList">
				<ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
				<ReactIScroll
					iScroll={iScroll}
					options={{
						preventDefault:false
					}}
				>
					<div className="content">
						{
							this.state.data&&this.state.data.map((item,index)=>{
								return(
									<Link to={ {pathname: (`/lives/${item.id}`), state: item }} key={index}>
										<Talive  data={item} type='2'/>
									</Link>
								)
							})
						}
					</div>
				</ReactIScroll>
			</div>
    )
  }
}
