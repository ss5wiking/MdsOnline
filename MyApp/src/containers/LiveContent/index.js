import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, SearchBar, Button , Tabs, Badge} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import classNames from 'classnames'
import moment from 'moment'
import Video from "@/components/LiveVideo";
import LiveDetails from "@/components/LiveDetails";
import DoctorDetails from "@/components/DoctorDetails";
import CommentConponents from "@/components/Comment";
import SubscribeList from "@/components/SubscribeList";
import BountyRanking from "@/components/BountyRanking";
import ChatRoom from "@/components/ChatRoom";
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
      live: {
        subscribers: [],
        bounty_ranks : [],
      },
      liveComments: [],
      key:''
    }
    this.tabChange = this.tabChange.bind(this);
    //this.ws = new WebSocket('wss://doctor.mdsonline.cn/cable');


  }

  tabChange(key){
    this.setState({key:new Date().getTime()})
  }

  // 当props或state更新之后，使用它更新DOM节点。元素完全挂在完毕，可以获取元素宽高信息
  componentDidMount(){
      this.getData()
  }

  handleClick =()=>{
    this.getData()
  }

  getData() {
    let id = this.props.match.params.id;
    _fetch(api.showLivePath, {id: id} )
      .then( res => {
        if(res.status == "success") {
          this.setState({
            live: res.data,
            liveStatus: res.data.live_status
          })
        }

      })
      .catch(err => {
      });
  }

  componentDidUpdate(){
    //this.scroll && this.scroll.refresh()
  }

  componentWillUnmount(){
    //this.scroll = null
  }
  // 滚动


  // 渲染
  render() {

    const { live, liveComments, liveStatus,} = this.state
    const { subscribers, bounty_ranks, doctor, play_urls, cover, paid, subscribers_count, comments_count} = live
    console.log(this.state, 555555555)
    let data = []

    //生成tabpane
    let indexTab = [];
    let arrTab = [
      {
        index: 0,
        title: '聊天室',
        component: ChatRoom,
          data: live
      },
      {
        index: 1,
        title: '打赏排行',
        component: BountyRanking,
        data: bounty_ranks
      },
      {
        index: 2,
        title: "直播简介",
        component: LiveDetails,
        data: {
          data: live,
          livefixedbuttonstatus: liveStatus,
          type: 1,
        }
      },
      {
        index: 3,
        title: '医生详情',
        component: DoctorDetails,
        data: doctor
      },
      {
        index: 4,
        title: '评论(' + comments_count + ')',
        component: CommentConponents,
        data: {
          liveStatus,
          liveComments,
          comments_count,
          id:this.props.match.params.id,
        },

      },
      {
        index: 5,
        title: '预约列表',
        component: SubscribeList,
        data: {
          subscribers,
          count: subscribers_count,
        }
      }
    ];

    switch (liveStatus){
      case 'pending':
        indexTab = [2,3,4,5];
        break;
      case 'living':
        indexTab = [0,1,2,3,5];
        break;
      case 'end':
        if(data.has_video){
          indexTab = [2,3,4];
        } else {
          indexTab = [2,3,4,5];
        }
    }

    arrTab = _.filter(arrTab, (item)=>{
      if( _.includes(indexTab, item.index)){
        return item
      }
    });
    return (
      <div className="LiveContent_wrap">
        {/*判断显示图片or视频（未完成）*/}
        {
          liveStatus === 'living' && paid ?
            <Video anchor = {true}
              cover_url= {cover}
              pull_urls={ play_urls }
            />
            :
            <div className="banner_wrap">
              <img src = {live.cover} className="LiveContent_banner"/>
              {/*<span>
                <img src={data.cover}/>
              </span>
              <p></p>*/}
            </div>
        }

        <div className="live_tab_wrap">
          <Tabs
            defaultActiveKey={indexTab[0] + ''}
            initialPage={0}
            animated={false}
            swipeable={false}
            onChange = {this.tabChange}

          >
            {

              arrTab.map( (item, index)=>(
                <TabPane tab={item.title} key={item.index + ''}>
                  <item.component data={item.data}  key={this.state.key} onClicks = {()=>this.getData()} />
                </TabPane>
              ))
            }
          </Tabs>
        </div>


      </div>
    )
  }
}
