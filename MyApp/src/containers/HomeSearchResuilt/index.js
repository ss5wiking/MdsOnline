  import React, { Component } from 'react';
import { Carousel, WhiteSpace, WingBlank ,SearchBar, Button , } from 'antd-mobile';
import './index.scss';
import { NavLink } from 'react-router-dom';
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import moment from 'moment'
import { Link } from 'react-router-dom'
import _ from "lodash";
import sousuoant from 'images/sousuoant.svg'
import guanbi from 'images/guanbi.svg'	
import yellowstar from 'images/yellowstar.svg'	

let canRun = false
export default  class HomeSearchResuilt extends Component {
    // 默认数据
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
          mask:false,
          keywords: [],
          searchKey: this.props.location.state.searchKey,
          hasError: false,
          hasLocalstorage:false,
          isFocus:false,
          search_history:[],
          searchAready:false,
          lastsearchKey:this.props.location.state.searchKey,
          onoff:false,
        }
    }

    //当props或state更新之后，使用它更新DOM节点。元素完全挂在完毕，可以获取元素宽高信息
    componentDidMount(){
      _fetch(api.searchDoctorsPath,{q:this.state.searchKey})
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            searchDoctorsList:result.data
          })
        }
      })
      // 页面上来搜索记录

      let keyarr =localStorage.getItem("storage")? JSON.parse(localStorage.getItem("storage"))  : []
      this.setState({search_history:keyarr})

      // 设置hasLocalstorage
      if(localStorage.getItem("storage")){
        this.setState({
          hasLocalstorage:true
        })
      }

      // 推荐关键字
      _fetch(api.searchKeywordsPath)
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            keywords:result.data
          })
        }
      })
    }


    // 打开搜索模态框
    onShowSearch() {
      let keyarr =localStorage.getItem("storage")? JSON.parse(localStorage.getItem("storage"))  : []
      this.setState({
        mask: true,
        searchAready:false,
      },()=>{
        document.querySelector('input').focus()
      })
    }

    aa = ()=>{
      this.setState({
        mask: false,
        isFocus:false,
        searchKey:"",
        searchAready:false,
       })
    }
    bb = (e)=>{
      e.stopPropagation()
      e.preventDefault()
      return false
    }

    // 取消按钮
    onHideSearch() {
      this.setState({
        mask: false,
        isFocus:false,
        searchAready:false,
        onoff:true,
        searchKey:this.state.lastsearchKey
       })
    }
    //搜索
    onSearch(searchKey) {
      this.setState({
        searchKey,
        onoff:false
      },()=>{
        if(this.state.searchKey){
          this.setState({
            searchAready:true,
          })
        }else{
          this.setState({
            searchAready:false,
          })
        }
      })

      clearTimeout(this.timer);
      this.timer=setTimeout(() =>{
        if(this.state.searchKey){
        _fetch(api.searchSuggestPath,{q:searchKey})
        .then(result=>{
          if(result.status=="success"){
            this.setState({
              SearchResult:result.data.doctors,
              hasLocalstorage:false,
            })
            if(result.data.doctors.length>0){
              this.setState({
                lastsearchKey:searchKey
              })
            }
          }
        })
        }else{
          this.setState({
            SearchResult:"",
            hasLocalstorage:false,
          })
        }
      }, 1000)
    }
    clearfchistory(){
      this.setState({
        search_history:[],
        hasLocalstorage:false
      })
      localStorage.clear();
    }

    gotoSearchListClick=(value)=>{
      this.setState({searchKey:value},()=>{
        this.gotoSearchList()
      })
      let keyarr =localStorage.getItem("storage")? JSON.parse(localStorage.getItem("storage"))  : []
      if (value.trim() && keyarr.indexOf(value.trim()) == -1) {
        keyarr.unshift(value.trim());
        localStorage.setItem("storage", JSON.stringify(keyarr))
      }
      let search_history=keyarr?keyarr.slice(0,5):[];
      this.setState({search_history})
    }

    gotoSearchList() {
      this.setState({mask:false})
      let keyarr =localStorage.getItem("storage")? JSON.parse(localStorage.getItem("storage"))  : []
      const { searchKey = '' } = this.state
      if (searchKey) {
        this.props.history.push({
            pathname:'/HomeSearchResuilt',
            state:{
              searchKey
            }
        })
      }

      _fetch(api.searchDoctorsPath,{q:this.state.searchKey})
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            searchDoctorsList:result.data
          })
        }
      })


    }

    deleteStorage(e,index){
      e.preventDefault()
      e.stopPropagation()
      let deleteArr=this.state.search_history
      let newArr=deleteArr.splice(index,1)
      this.setState({search_history:deleteArr},()=>{
        localStorage.setItem("storage", JSON.stringify(deleteArr))
      })
      if(!this.state.search_history.length>0){
        this.setState({
          search_history:[],
          hasLocalstorage:false
        })
        localStorage.clear();
      }
    }

    clear = () => {
      this.setState({
        searchKey:"",
        isFocus:false,
       })
    }
    // 渲染
    render() {
        const { mask, keywords, searchKey, hasError} = this.state
        return (
          <div className = "HomeSearchResuilt" >
            <div className="search_bar clearfix" onClick={this.onShowSearch.bind(this)}>
              <div className="search_content pull-left">
                <img src={sousuoant}/>
                {this.state.onoff? this.state.lastsearchKey : this.state.searchKey}
              </div>
              <Link to="/HomePage/0" >
                <div className="return_home pull-right">
                  返回
                </div>
              </Link>
            </div>
            <div className="HomeSearchResuilt_wrap">
              <ReactIScroll
                iScroll={iScroll}
                options={{
                  preventDefault:false
                }}
              >
              <div className="HomeSearchResuilt_content">
                <div className="title">相关医生</div>
                <div className="wrap">
      						{ this.state.searchDoctorsList&&this.state.searchDoctorsList.map( (item, index) =>(
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
      						}
      					</div>
              </div>
              </ReactIScroll>
            </div>
            <div className={this.state.mask? "search_mask active":"search_mask" } onClick={()=>this.aa()}  >
              <div className="modal_wrap" onClick={(e)=>this.bb(e)}>
                <SearchBar
                  placeholder="搜索"
                  onChange={this.onSearch.bind(this)}
                  onCancel={this.onHideSearch.bind(this)}
                  value={this.state.searchKey}
                />
                <div className={this.state.searchAready ? "recommended_keywords_title " : "recommended_keywords_title action"}>
                  <h5>热门搜索</h5>
                  <p>
                    {keywords.map((value, index) =>
                      <a onClick={()=>this.gotoSearchListClick(value)} key={index}
                      >{value}</a>
                    )}
                  </p>
                </div>
                {
                  this.state.searchKey&&
                  <div className={this.state.searchAready? "SearchResult active" :"SearchResult"}>
                    {
                      this.state.SearchResult&& this.state.SearchResult.length>0 ?
                      <ul className="SearchResultList">
                        {
                          this.state.SearchResult&& this.state.SearchResult.map((item,index)=>{
                            return(
                              <li key={index} onClick={()=>this.gotoSearchListClick(item.name)}>{item.name}</li>
                            )
                          })
                        }
                      </ul>
                      :
                      <div className="noSearchResultList">
                        无匹配结果
                      </div>
                    }
                  </div>
                }

                {
                  !this.state.searchKey&&this.state.search_history &&this.state.search_history.length>0? (
                    <ul className="search_history">
                      {
                         this.state.search_history.map((item,index) => {
                         return(
                           <li className="clearfix" key={index} onClick={()=>this.gotoSearchListClick(item)}>
                             <span className="pull-left">{item}</span>
                             <span className="pull-right" onClick={(e)=> this.deleteStorage(e,index)}>
                              <img src={guanbi}/>
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
