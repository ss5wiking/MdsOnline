import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { Carousel, WhiteSpace, WingBlank ,SearchBar, Button ,} from 'antd-mobile';
import {connect} from 'react-redux';
import './index.scss';
import moment from 'moment'
import api from '@/api'
import { Link } from 'react-router-dom'
import * as LivesActions from '@/actions/lives'
import LiveItem from "@/components/LiveListItem/LiveItem";
import VideoItem from "@/components/LiveListItem/VideoItem";
// import BackHome from "@/components/BackHome";
          // <BackHome history={this.props.history}/>
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import sousuoant from 'images/sousuoant.svg'
import guanbi from 'images/guanbi.svg'
import green_search from 'images/green_search.svg'	
import arrow from 'images/arrow.svg'		

class LivePage extends Component {

    // 默认数据
  constructor(props) {
    super(props);
    this.state = {
      mask:false,
      lives: [],
      keywords: [],
      searchKey: '',
      hasError: false,
      hasLocalstorage:false,
      isFocus:false,
      search_history:[],
      searchdiv:false,
      searchKeyoff:true,
    }
  }
  // 当props或state更新之后，使用它更新DOM节点。元素完全挂在完毕，可以获取元素宽高信息

  componentDidMount(){
    let keyarr =localStorage.getItem("storage1")? JSON.parse(localStorage.getItem("storage1"))  : []
    const { searchKey = '' } = this.state
    if (searchKey) {
      this.props.history.push(`/search?key=${searchKey}`)
      keyarr.unshift(searchKey);
      localStorage.setItem("storage1", JSON.stringify(keyarr))
    }
    let search_history=keyarr?keyarr.slice(0,5):[];
    this.setState({search_history})


    if(localStorage.getItem("storage1")){
      this.setState({
        hasLocalstorage:true
      })
    }


    _fetch(api.streamHomePath)
    .then(
      res => {
        this.handleRessData(res);
      }
    )
	}

  onShowSearch() {
    this.setState({ mask: true  },()=>{
      document.querySelector('input').focus()
    })
  }

  bb = (e)=>{
    e.stopPropagation()
    e.preventDefault()
  }

  aa = ()=>{
    this.setState({
      mask: false,
      searchKey:"",
     })
  }

  onHideSearch() {
    this.setState({
      mask: false,
      isFocus:false,
      searchKey:"",
      searchdiv:false,
      hasLocalstorage:true,
      searchKeyoff:true,
     })
  }

  onSearch(searchKey) {
    this.setState({
      searchKey,
      searchdiv:true,
      hasLocalstorage:false,
      searchKeyoff:false,
    })
  }

  gotoSearchListClick=(value)=>{
    this.setState({searchKey:value ,searchKeyoff:true },()=>{
      this.gotoSearchList()
    })
  }

  gotoSearchList() {
    this.setState({mask:false})
    let keyarr =localStorage.getItem("storage1")? JSON.parse(localStorage.getItem("storage1"))  : []
    const { searchKey = '' } = this.state
    if (searchKey) {
      this.props.history.push(`/search?key=${searchKey}`)
      keyarr.unshift(searchKey);
      localStorage.setItem("storage1", JSON.stringify(keyarr))
    }
    let search_history=keyarr?keyarr.slice(0,5):[];
    this.setState({search_history})
  }

  clearfchistory(){
    this.setState({
      search_history:[],
      hasLocalstorage:false
    })
    localStorage.clear();
  }

  deleteStorage(e,index){
    e.preventDefault()
    e.stopPropagation()
    let deleteArr=this.state.search_history
    let newArr=deleteArr.splice(index,1)
    this.setState({search_history:deleteArr},()=>{
      localStorage.setItem("storage1", JSON.stringify(deleteArr))
    })
    if(!this.state.search_history.length>0){
      this.setState({
        search_history:[],
        hasLocalstorage:false
      })
      localStorage.clear();
    }
  }

  handleRessData(res) {
    const { status, data = {} } = res
    if (status === 'success') {
      const { lives = [], keywords = [] } = data;
      this.setState({ lives, keywords })
    } else {
      this.setState({ hasError: true })
    }
  }

  clear = () => {
    this.setState({
      searchKey:"",
      searchdiv:false,
      isFocus:false,
     });
  };

    // 渲染
  render() {
      const { mask, lives, keywords, searchKey, hasError } = this.state
      const { recommend_lives, recommend_keywords } = this.props
      const endLives = []
      const getEndLiveTag = (isFree, price) => {
        if (isFree) {
          return (
            <div>
              <div className="sanjiao sanjiao_green"></div>
              <span className="sanjiao_text sanjiao_text_green">免费</span>
            </div>
          )
        }
        return (
          <div>
            <div className="sanjiao sanjiao_red"></div>
            <span className="sanjiao_text sanjiao_text_red"><span className="qian">￥</span>{parseInt(price)}</span>
          </div>
        )
      }
      const getLiveStatusTag = (isLiving, time) => {
        if (isLiving) {
          return <span>正在直播中<i className="white"></i></span>
        }
        return <span>{moment(time).format('L')}<i className="yellow"></i></span>
      }
      // 数据加载出错
      if (hasError) {
        return <div>Load Error.</div>
      }
      return (
        <div className="LivePage">
        {!this.state.mask&&
          <div
            className="search_warp"
            onClick={this.onShowSearch.bind(this)}
          >
            <div className="uninput">
              <div>
                <img src={sousuoant}/>
                按关键词查找
              </div>
            </div>
          </div>
        }
          <div className="LivePage_wrap">
          <ReactIScroll
            iScroll={iScroll}
            options={{
              preventDefault:false
            }}
          >
              <div>
                <div className="recommended_keywords_title">
                  <h5>推荐关键词</h5>
                  <p>
                    {keywords.map((value, index) =>
                      <a key={index} onClick={() => {
                        this.props.history.push(`/search?key=${value}`)
                      }}>{value}</a>
                    )}
                  </p>
                </div>
                <div className="recommended_live_wrap">
                  <p className="recommended_live_title">推荐直播/录播</p>
                  <ul className="recommended_list">
                    {
                      lives.map((item,index)=>{
                        if(item.live_status == "living" || item.live_status == "pending" ){
                          return <LiveItem {...item} key={item.id} />
                        }else if(item.live_status === 'end'){
                          return <VideoItem {...item} key={item.id} />
                        }
                      })
                    }
                  </ul>
                </div>
              </div>
            </ReactIScroll>
          </div>
          <div className={this.state.mask? "search_mask active":"search_mask" }  onClick={()=>this.aa()}  >
            <div className="modal_wrap" onClick={(e)=>this.bb(e)}>
              <SearchBar
                placeholder="搜索"
                onChange={this.onSearch.bind(this)}
                onCancel={this.onHideSearch.bind(this)}
                onSubmit={this.gotoSearchList.bind(this)}
                value={searchKey}
              />
              {this.state.searchKey && (
                <div className="search_text clearfix">
                  <img src={green_search} className="green_search pull-left"/>
                  <p
                    className="pull-left"
                    onClick={this.gotoSearchList.bind(this)}
                  >
                    <span>搜索: </span>
                    <span>{searchKey}</span>
                    <img src={arrow} className="arrow_search pull-right"/>
                  </p>
                </div>
              )}
              {
                !this.state.searchKey && this.state.search_history &&this.state.search_history.length>0 ? (
                  <ul className="search_history">
                    <p className="search_early">
                      最近搜索
                    </p>
                    {
                      this.state.search_history.map((item,index) => {
                       return(
                         <li key={index} onClick={()=>this.gotoSearchListClick(item)}  >
                           <span className="pull-left">{item}</span>
                           <span className="pull-right" onClick={(e)=> this.deleteStorage(e,index)}>
                            <img src={guanbi} />
                           </span>
                         </li>
                       )
                     })
                    }
                    <p className="clear_history" onClick={this.clearfchistory.bind(this)}>
                      清除搜索记录
                    </p>
                  </ul>
                ):""
              }
            </div>
          </div>
        </div>
      )
    }
  }

const mapStateToProps = (state, ownProps) => {
  const { recommend_lives, recommend_keywords } = state.Lives
  return {recommend_lives, recommend_keywords }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(LivesActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LivePage)
