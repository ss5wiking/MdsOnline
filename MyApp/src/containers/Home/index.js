import React, { Component,PropTypes} from 'react';
import { Carousel, WhiteSpace, WingBlank ,SearchBar, Button } from 'antd-mobile';
import './index.scss';
import { NavLink } from 'react-router-dom';
// import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import { Link } from 'react-router-dom'
import SelectorModalDisease from "components/SelectorModalDisease";
import SelectorModalDepartment from "components/SelectorModalDepartment";
import sousuoant from 'images/sousuoant.svg'
import jiankangzhibojian from 'images/jiankangzhibojian.svg'
import zhuanjiawenzhen from 'images/zhuanjiawenzhen.svg'
import tesefuwu from 'images/tesefuwu.svg'	
import Diseasesearch from 'images/Diseasesearch.svg'
import Departmentsearch from 'images/Departmentsearch.svg'
import png1 from 'images/1.png'	
import guanbi from 'images/guanbi.svg'	
import api from '@/api'

export default class Home extends Component {
    // 默认数据
    constructor(props) {
      super(props)
      this.state = {
        carousel: [],
        mask:false,
        keywords: [],
        searchKey: '',
        hasError: false,
        hasLocalstorage:false,
        isFocus:false,
        search_history:[],
        searchAready:false,
        SelectorModalDepartmentVisible:false,
        SelectorModalDiseaseVisible:false,
      }
    }
    //当props或state更新之后，使用它更新DOM节点。元素完全挂在完毕，可以获取元素宽高信息
    componentDidMount(){
    	// 轮播图
		  _fetch(api.commonCarouselPath)
		  .then(result=>{
		    if(result.status=="success"){
		      this.setState({
		        carousel:result.data
		      })
		    }
		  })

		  // 页面上来搜索记录
		  let keyarr =localStorage.getItem("storage")? JSON.parse(localStorage.getItem("storage"))  : []
		  const { searchKey = '' } = this.state

		  if (searchKey.trim() && keyarr.indexOf(searchKey.trim()) == -1){
		    // this.props.history.push(`/HomeSearchResuilt?key=${searchKey}`)
		    keyarr.unshift(searchKey.trim());
		    localStorage.setItem("storage", JSON.stringify(keyarr))
		  }
		  let search_history=keyarr?keyarr.slice(0,5):[];
		  this.setState({search_history})

		  // 设置hasLocalstorage
		  if(localStorage.getItem("storage")&&JSON.parse(localStorage.getItem("storage")).length>0){
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
        searchKey:"",
       })
    }
    //搜索
    onSearch(searchKey) {
      this.setState({
        searchKey,
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
       });
    };

    SelectorModalDepartmentVisible = ()=>{
      this.setState({
        SelectorModalDepartmentVisible:true
      })
    }

    SelectorModalDiseaseVisible = ()=>{
      this.setState({
        SelectorModalDiseaseVisible:true
      })
    }

    depSelect =(id,name)=>{
  		this.setState({SelectorModalDepartmentVisible:false,department:id},()=>{
  			this.getData()
  		})
  	}

    diseaseSelect =(id,name)=>{
  		this.setState({SelectorModalDiseaseVisible:false,department:id},()=>{
  			this.getData()
  		})
  	}


    // 渲染
    render() {
        const { mask, keywords, searchKey, hasError } = this.state
        return (
			<div className = "home_page" >				
				<div className="search_bar" onClick={this.onShowSearch.bind(this)}>
					<div className="search_content">
					搜索疾病，医生，医院，科室
					<img src={sousuoant}/>
					</div>
				</div>
				<div className="home_page_wrap">
					<ReactIScroll
					iScroll={iScroll}
					options={{
						preventDefault:false
					}}
					>
					<div className="scroll_wrap">
						<Carousel className = "carousel"
						autoplay = { true }
						infinite
						selectedIndex = { 0 }
						autoplayInterval = { 3000 }
						speed = { 400 }>
						{
							this.state.carousel.length>0 && this.state.carousel.map(function(item,i){
							return <a className="v-item" key={i}>
								<img src={item.cover_url}/>
							</a>
							})
						}
						</Carousel>
						<div className="home_page_conetent clearfix">
						<NavLink to="/streams" className="home_page_conetent_left pull-left">
							<img src={jiankangzhibojian} alt="zhibo"/>
							<h5>健康直播间</h5>
							<p>实时关注健康</p>
						</NavLink>
						<div className="home_page_conetent_right pull-right">
							<Link to="/ExpertConsultation/" className="home_page_conetent_right_top">
							<img src={zhuanjiawenzhen} alt="zhuanjiawenzhen" className="pull-left"/>
							<div className="pull-left">
								<h5>专家问诊</h5>
								<p>专家为您解答</p>
							</div>
							</Link>
							<Link to="/WhitePage/" className="home_page_conetent_right_bottom clearfix">
							<img src={tesefuwu} alt="tesefuwu" className="pull-left"/>
							<div className="pull-left">
								<h5>特色服务</h5>
								<p>定制服务治疗</p>
							</div>
							</Link>
						</div>
						</div>
						<div className="lookup clearfix">
						<a className="Diseasesearch_lookup clearfix pull-left" onClick={()=>this.SelectorModalDiseaseVisible()}>
							<div className="img_wrap pull-left">
							<img src={Diseasesearch}/>
							</div>
							<div className="content pull-left">
							<p>按疾病查找</p>
							<p>快速匹配对症医生</p>
							</div>
						</a>
						<a className="department_lookup pull-left clearfix"  onClick={()=>this.SelectorModalDepartmentVisible()} >
							<div className="img_wrap pull-left">
							<img src={Departmentsearch}/>
							</div>
							<div className="content pull-right">
							<p>按科室查找</p>
							<p>寻找您的专科医生</p>
							</div>
						</a>
						</div>
						<div className="community_classroom">
						<div className="community_classroom_title clearfix">
							<span className="titlename pull-left">社区课堂</span>
							<span className="moredo pull-right">更多</span>
						</div>
						<ul className="community_classroom_content">
							<li className="clearfix">
							<img src={png1} alt="shequketang" className="pull-left"/>
							<div className="pull-left">
								<h5> 12招预防老年痴呆，为了爸妈必看</h5>
								<p>为了日渐老去的父母，这些事情我们必须早一点了解</p>
							</div>
							</li>
							<li className="clearfix">
							<img  src={png1} alt="shequketang" className="pull-left"/>
							<div className="pull-left">
								<h5> 12招预防老年痴呆，为了爸妈必看</h5>
								<p>为了日渐老去的父母，这些事情我们必须早一点了解</p>
							</div>
							</li>
							<li className="clearfix">
							<img  src={png1} alt="shequketang" className="pull-left"/>
							<div className="pull-left">
								<h5> 12招预防老年痴呆，为了爸妈必看</h5>
								<p>为了日渐老去的父母，这些事情我们必须早一点了解</p>
							</div>
							</li>
							<li className="clearfix">
							<img  src={png1} alt="shequketang" className="pull-left"/>
							<div className="pull-left">
								<h5> 12招预防老年痴呆，为了爸妈必看</h5>
								<p>为了日渐老去的父母，这些事情我们必须早一点了解</p>
							</div>
							</li>
						</ul>
						</div>
					</div>
					</ReactIScroll>
				</div>
				<div className={this.state.mask? "search_mask active":"search_mask" }   onClick={()=>this.aa()} >
					<div className="modal_wrap"  onClick={(e)=>this.bb(e)}>
					<SearchBar
						placeholder="搜索"
						onChange={this.onSearch.bind(this)}
						onCancel={this.onHideSearch.bind(this)}
						value={searchKey}
					/>
					<div className={this.state.searchAready  ? "recommended_keywords_title " : "recommended_keywords_title action"}>
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
								<li  className="clearfix" key={index} onClick={()=>this.gotoSearchListClick(item)}>
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
				<SelectorModalDepartment
					SelectorModalDepartmentVisible = {this.state.SelectorModalDepartmentVisible}
					onCancelNew={()=>this.setState({SelectorModalDepartmentVisible:false})}
					onUp={(id,name)=>this.depSelect(id,name)}
					className={!this.state.SelectorModalDepartmentVisible && 'up'}
				/>
				<SelectorModalDisease
					SelectorModalDiseaseVisible = {this.state.SelectorModalDiseaseVisible}
					onCancelDisease={()=>this.setState({SelectorModalDiseaseVisible:false})}
					onDown={(id,name)=>this.diseaseSelect(id,name)}
					className={!this.state.SelectorModalDiseaseVisible && 'up'}
				/> 
            </div>
        )
    }
}
