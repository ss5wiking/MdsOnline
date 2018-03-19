import React, { Component, PropTypes } from 'react';
import { Tabs, ActivityIndicator} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import MyLiveListItemNew from "@/components/MyLiveListItemNew";
import WhiteNo from "@/components/WhiteNo";

const TabPane = Tabs.TabPane;

export default class MyLiveList extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      tab:"subscribed",
      data1:null,
      data2:[],
      loading:true,
    }
  }
  selectName =(tab) =>{
    console.log(tab, 665566)
    if(tab ==1){
      this.setState({tab:"subscribed"},()=>{
         this.getdata()
      })
    }else{
      this.setState({tab:"purchased"},()=>{
         this.getdata()
      })
    }
  }

  getdata=()=> {
    _fetch(api.usersLivesPath,{tab:this.state.tab},"GET")
    .then(result=>{
      if(result.status=="success"){
        if(this.state.tab == 'subscribed'){
          this.setState({
            loading:false,
            data1:result.data
          })
        }else{
          this.setState({
            loading:false,
            data2:result.data
          })
        }

      }

    })
  }

  componentDidMount(){

     this.getdata()
  }


  // 渲染
  render() {
    return (
      <div className="LiveContent_wrap">
        <ActivityIndicator toast  animating={this.state.loading} text="正在加载"/>
        <Tabs defaultActiveKey="1" animated={false}  onChange={this.selectName}>
          <TabPane tab="已预约" key="1">
          { this.state.data1 &&
            <div className="content_wrap">
              {this.state.data1.length>0 ?
                <MyLiveListItemNew data={  this.state.data1 }/>
                :
                <WhiteNo text="预约"/>
              }

            </div>
          }
          </TabPane>
          <TabPane tab="已购买" key="2">
            <div className="content_wrap">
              {this.state.data2.length>0 ?
              <MyLiveListItemNew data={  this.state.data2 }/>
                :
                <WhiteNo text="购买"/>
              }
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
