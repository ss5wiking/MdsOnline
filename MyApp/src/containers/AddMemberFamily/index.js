import React, { Component, PropTypes } from 'react';
import { WhiteSpace, WingBlank, Button , Badge, Switch, SwipeAction ,List, DatePicker,InputItem, Picker, Toast } from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import moment from 'moment'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import {Link} from 'react-router-dom';

const maxDate = moment('2025-12-12 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1900-1-1 +0800', 'YYYY-MM-DD Z').utcOffset(8);

  export default class AddMemberFamily extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      id:"",
      name:"",
      birthday:"请选择",
      gender:"",
      relationship:"请选择",
      relation:"",
      mobile:"",
      id_number:"",
      height:"",
      weight:"",
      hasError: false,
      value: '',
      visibleData1:[[
			    {
			      label: '男',
			      value: 'male',
			    },
			    {
			      label: '女',
			      value: 'female',
			    },
		  ]],
      visibleData2:[[
			    {
			      label: '自己',
			      value: 'self',
			    },
			    {
			      label: '父母',
			      value: 'parent',
			    },
			    {
			      label: '子女',
			      value: 'child',
			    },
			    {
			      label: '亲属',
			      value: 'kinship',
			    },
          {
			      label: '朋友',
			      value: 'friend',
			    },
          {
			      label: '其它',
			      value: 'other',
			    },
		  ]]
    }
  }


  geLast = () =>{
    _fetch(api.familiesShowPath,{id:this.props.location && this.props.location.state && this.props.location.state.id})
    // _fetch(api.familiesShowPath,{id:this.props.location.state.id})
     .then(({data,status})=>{
       if(status == 'success'){
         console.log(data,97878)
        this.selectRelationship([data.relationship])
        this.selectGender([data.gender])
         this.setState({
           id:data.id,
           LastData:data,
           name:data.name,
           mobile:data.mobile,
           id_number:data.id_number,
           birthday:moment(data.birthday).format('YYYY-MM-DD'),
           weight:data.weight,
           height:data.height,
         },()=>{
           console.log(this.state.LastData,   663333)
         })
       }
     })
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('请输入正确的号码');
    }
  }
  onChange = (value) => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        hasError: true,
      });
    } else {
      this.setState({
        hasError: false,
      });
    }
    this.setState({
      mobile:value
    });
  }
  selectData =(date) =>{
    this.setState({birthday:date.format('YYYY-M-D')})
  }
  selectName =(name) => {
    this.setState({name:name})
  }
  selectGender =(gender) => {
    let data = this.state.visibleData1[0]
    let label = data.find(function(item){
      return item.value == gender[0]
    }).label
    this.setState({gender:gender[0],sex:label},()=>{
    })

  }
  selectRelationship =(relationship ) => {
    let data = this.state.visibleData2[0]
    let label = data.find(function(item){
      return item.value == relationship[0]
    }).label
    this.setState({relationship:relationship[0],relation:label})

  }
  selectID =(id_number) => {
    this.setState({id_number:id_number})
  }
  selectHeight =(Height) => {
    this.setState({height:Height})
  }
  selectWeight =(Weight ) => {
    this.setState({weight:Weight})
  }

  submitData =() =>{
    let {id,name,birthday,gender,relationship,mobile,id_number,height,weight} =this.state;
    if(this.state.LastData){
      _fetch(api.familiesupdatePath,{id,name,birthday,gender,relationship,mobile,id_number,height,weight},"post")
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            data:result.data
          })
          this.props.history.push('/MemberFamily')
        }else{
          Toast.info('请输入完整的信息');
        }
        console.log(this.state.data, 777777)
      })
    }else{
      _fetch(api.familiescreatePath,{name,birthday,gender,relationship,mobile,id_number,height,weight},"post")
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            data:result.data
          })

          this.props.history.push('/MemberFamily')
        }else{
          Toast.info('请输入完整的信息');
        }
        console.log(this.state.data, 777777)
      })
    }

  }
  handleClick(e) {
  }


  componentDidMount(){
    this.geLast()

  }

  // 渲染
  render() {
    const{ visibleData1,visibleData2} = this.state
    console.log(this.props ,565656)
    return (
      <div className="AddMemberFamily clearfix">
        <div className="AdditionCases_content">
          <List>
            <InputItem clear placeholder="必填" value ={this.state.name} onChange={(name)=>this.selectName(name)} autoFocus>姓名</InputItem>
          </List>
          <List>
            <DatePicker
              onChange={this.selectData}
    					mode="date"
    					title="选择日期"
    					minDate={minDate}
    					maxDate={maxDate}
              extra={this.state.birthday}

    				>
    					<List.Item arrow="horizontal">出生年月</List.Item>
    				</DatePicker>
          </List>
          <List>
            <Picker data={visibleData1} cols={1} cascade={false}
              onChange={this.selectGender}
    					title="性别"
    				  date={visibleData1}
              extra={this.state.sex}
    				>
    					<List.Item arrow="horizontal">性别</List.Item>
    				</Picker>
          </List>
          <List>
            <Picker data={visibleData2} cols={1} cascade={false}
              onChange={this.selectRelationship}
    					title="关系"
    				  date={visibleData2}
              extra={this.state.relation}
    				>
    					<List.Item arrow="horizontal">关系</List.Item>
    				</Picker>
          </List>
          <List>
            <InputItem clear

              placeholder="请输入正确的手机号"
              error={this.state.hasError}
              onErrorClick={this.onErrorClick}
              onChange={this.onChange}
              autoFocus
              value={this.state.mobile}
            >
            电话
            </InputItem>
          </List>

          <List>
            <InputItem clear onChange={this.selectID}  value={this.state.id_number}   placeholder="请输入正确的身份证" autoFocus>身份证</InputItem>
          </List>
          <List>
            <InputItem clear placeholder="身高"  extra="CM" onChange={this.selectHeight} value={this.state.height} autoFocus>身高</InputItem>
          </List>
          <List>
            <InputItem clear placeholder="体重" extra="KG" onChange={this.selectWeight} value={this.state.weight} autoFocus>体重</InputItem>
          </List>
        </div>
        <a className="sub_button am-button am-button-primary" onClick={this.submitData}>保存</a>
      </div>
    )
  }
}
