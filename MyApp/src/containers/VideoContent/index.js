import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, SearchBar, Button , Tabs, Badge} from 'antd-mobile';
import './index.scss';
import Iscroll from '@/service/scroll'
import api from '@/api'
import classNames from 'classnames'
import moment from 'moment'
import Video from "components/LiveVideo";
import LiveDetails from "components/LiveDetails";
import DoctorDetails from "components/DoctorDetails";
import CommentConponents from "components/Comment";
// import BackHome from "@/components/BackHome";
        // <BackHome history={this.props.history}/>
import {getCookie} from "@/lib/cookie";
import _ from 'lodash/collection'


const TabPane = Tabs.TabPane;

export default class LiveContent extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state = {
      liveStatus:'',
      comments: [],
      video: {} ,
      key:''
      }
    this.tabChange = this.tabChange.bind(this);
    //this.ws = new WebSocket('wss://doctor.mdsonline.cn/cable');
  }
  tabChange(key){
    this.setState({key:new Date().getTime()})
  }

  componentDidMount(){
    this.getDatas()

  }
  getDatas = ()=>{
    let id = this.props.match.params.id;
    _fetch(api.showVideoPath, {id: id} )
      .then( res => {
        if(res.status == "success") {
          this.setState({
            video: res.data,
            liveStatus: res.data.live_status
          })
        }
      })
      .catch(err => {
      });
  }
  // 当props或state更新之后，使用它更新DOM节点。元素完全挂在完毕，可以获取元素宽高信息

  handleClick =()=>{
    this.getDatas()
  }

  // 滚动
  // 渲染
  render() {
    console.log(this.state ,888888)
    const { video, comments ,liveStatus } = this.state
    const { doctor, play_urls, cover, charge_free , paid ,comments_count} = video
    let data = []
    let indexTab = [];
    let arrTab = [
      {
        index: 0,
        title: "录播简介",
        component: LiveDetails,
        data: {
          data: video,
          type: 2,
        }
      },
      {
        index: 1,
        title: '医生详情',
        component: DoctorDetails,
        data: doctor
      },
      {
        index: 2,
        title: '评论(' + comments_count + ')',
        component: CommentConponents,
        data: {
          liveStatus,
          comments_count,
          liveComments: comments,
          id:this.props.match.params.id
        },

      }
    ];
    indexTab = [0,1,2];
    return (
      <div className="LiveContent_wrap">
        { charge_free　|| paid ?
          <Video anchor = {true}
            cover_url= {cover}
            pull_urls={ play_urls }
          />
            :
            <div className="banner_wrap">
              <img src={video.cover} className="LiveContent_banner"/>
              <p></p>
            </div>
        }
        <div className="live_tab_wrap">

          <Tabs
            defaultActiveKey={indexTab[0] + ''}
            initialPage={0}
            animated={true}
            swipeable={false}
            onChange = {this.tabChange}
          >
            {
              arrTab.map( (item, index)=>(
                <TabPane tab={item.title} key={item.index + ''}>
                    <item.component data={item.data} id={item.id} onClicks={this.handleClick}/>
                </TabPane>
              ))
            }
          </Tabs>
        </div>


      </div>
    )
  }
}
