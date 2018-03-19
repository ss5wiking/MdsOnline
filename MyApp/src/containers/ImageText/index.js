import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { Modal,ImagePicker, WhiteSpace, WingBlank ,List, Button ,Picker,InputItem,TextareaItem,Toast} from 'antd-mobile';
import {connect} from 'react-redux';
import './index.scss';
import classNames from 'classnames'
import moment from 'moment'
import url from '@/api'
import { Link } from 'react-router-dom'
import * as LivesActions from '@/actions/lives'
import LiveItem from "@/components/LiveListItem/LiveItem";
import VideoItem from "@/components/LiveListItem/VideoItem";
// import BackHome from "@/components/BackHome";
      // <BackHome history={this.props.history}/>
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";

export default class ImageText extends Component {

    // 默认数据
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      personData:[],
      person:'请选择',
      family_id:'',
      service_id:props.match.params.id,
      disease:'',
      symptom_describe:'',
      files: [],
      img_id:[],
    }
  }
  componentDidMount() {
    //获取家庭成员
    _fetch(url.families)
      .then(({data,status})=>{
        if(status == 'success'){
          let newData = [[]];
          if(data.length>0){
            data.map(function(item){
              newData[0].push({
                label:item.name,
                value:`${item.name} ${item.gender == 'male' ? '男' : '女'} ${item.age}岁`
              })
            })
            this.setState({data,personData:newData,person: newData[0][0].value,family_id:data[0].id})
          }
        }
      })
  }
  //选择问诊人
  handlePersonSelected = (v)=>{
    const {data} = this.state
    let family_id = data.find(function(item){
      return item.name == v.split(' ')[0]
    }).id
    this.setState({family_id,person:v})
  }
  //图片选择
  onChange = (files, type, index) => {
    let length = files.length-1
    if(type=='add'){
      let formData = new FormData()
      formData.append('image', files[length].file)
      _fetch(url.upload_image,formData,'FormData')
        .then(({data,status})=>{
          if(status == 'success'){
            let img_id = this.state.img_id
            img_id.push(data.id)
            this.setState({img_id,files})
          }else{
            Modal.alert('','图片上传失败')
          }
        })
    }
    if(type == 'remove'){
      let img_id = this.state.img_id
      img_id.splice(index,1)
      this.setState({img_id,files})
    }
  }
  //提交
  handleSubmit = ()=>{
    const { family_id,service_id,disease,symptom_describe,img_id} = this.state
    Toast.info('订单提交中...', 300)
    let formData = new FormData()
    formData.append('family_id', family_id)
    formData.append('service_id', service_id)
    formData.append('disease', disease)
    formData.append('symptom_describe', symptom_describe)
    img_id.length>0 && img_id.map(function(item){
       formData.append('images[]', item)
    })
    _fetch(url.consults_create,formData,'FormData')
      .then(({data,status})=>{
        Toast.hide()
        if(status == 'success'){
          this.props.history.push({
            pathname: '/checkout',
            search: '?type=consult',
            state: {
              id:data.id,
              title:'图文问诊-' + data.doctor.name,
              price:data.price,
              doctor:data.doctor,
            }
          })
        }else{
          Modal.alert('','提交遇到错误或问诊已存在')
        }
      })

  }
  // 渲染
  render() {
    const {personData,person,files,symptom_describe} = this.state
      return (
      <ReactIScroll
        iScroll={iScroll}
        options={{
          preventDefault:false
        }}
      >
        <div className="imageText">
          <List>
            <Picker
              extra={<span style={{color:person=="请选择" ? '#bbb' : '#222'}}>{person}</span>}
              data={personData}
              title="选择地区"
              cascade={false}
              onChange={(v)=>this.handlePersonSelected(v[0])}
            >
              <List.Item arrow="horizontal">问诊人</List.Item>
            </Picker>
          </List>
          {/*<List>
            <List.Item arrow="horizontal" extra={<span style={{color:'#222'}}>家族史、过敏史</span>}>健康档案</List.Item>
          </List>*/}
          <List>
            <div className='jibing'>
            <InputItem placeholder="未确诊可不填" onChange={(disease)=>this.setState({disease})}>疾病</InputItem>
            </div>
          </List>
          <List>
            <List.Item>症状说明</List.Item>
            <TextareaItem
              maxLength={500}
              rows={5}
              placeholder="请详细描述您的病情，症状，治疗经过以及想要获得的帮助。（500字以内）"
              onChange={(symptom_describe)=>this.setState({symptom_describe})}
            />
          </List>
          <List>
            <div className="upload">
              <List.Item>上传图片资料<small style={{color:'#999'}}>（检查报告、处方和其他病情资料）</small></List.Item>
              <ImagePicker
                files={files}
                onChange={this.onChange}
              />
            </div>
          </List>
          <Button disabled={!symptom_describe} style={{ width: '80%',margin:'0.6rem auto' }} type="primary" onClick={this.handleSubmit}>立即支付</Button>

        </div>
        </ReactIScroll>
      )
    }
}
