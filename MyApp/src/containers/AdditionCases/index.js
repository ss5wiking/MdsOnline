import React, { Component, PropTypes } from 'react';
import { DatePicker,WhiteSpace, WingBlank, Button, Badge,List,InputItem, TextareaItem, Picker, ImagePicker, Toast, Modal} from 'antd-mobile';
import './index.scss';
//import Iscroll from '@/service/scroll'
import api from '@/api'
import _ from 'lodash/collection';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import moment from 'moment';
import {Link} from 'react-router-dom';
const maxDate = moment('2025-12-12 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1970-1-1 +0800', 'YYYY-MM-DD Z').utcOffset(8);


  export default class AdditionCases extends Component {
  // 默认数据
  constructor(props) {
    super(props)
    this.state={
      data:[],
        personData:[],
        departmentData:[],
        person:'请选择', //显示就诊人
        family_id:"",// 是 Integer 家庭成员ID
        id:"",//病例代码
        diagnosed_at:'请选择',  //是 String  就诊日期
        disease:'', //是 String  确诊疾病
        hospital_name:'',  //是 String  医院
        department_id:'', //是 Object  科室
        doctor_name:'', //是 String  医生姓名
        symptoms:'',  //是 String  病情说明
        department_name:'请选择',
        img_id:[]
    }
  }
  componentDidMount() {
    this.getFamily()
    this.getDepartments()
    this.getLast()

  }
  //选择就诊人
  handlePersonSelected = (v)=>{
    const {data} = this.state
    let family_id = data.find(function(item){
      return item.name == v.split(' ')[0]
    }).id
    this.setState({family_id,person:v})
  }
  handleClick(e) {
  }
  //选择就诊日期
  handleDateChange = (date)=>{
    this.setState({
      diagnosed_at:date.format('YYYY-MM-DD')
    })
  }
  //确诊疾病
  handleDisease = (disease)=>{
    this.setState({disease})
  }
  //填写医院
  handleHospital = (hospital_name)=>{
    this.setState({hospital_name})
  }
  //医生姓名
  handleDoctorName = (doctor_name)=>{
    this.setState({doctor_name})
  }



  getLast = () =>{
    this.props.location.state && _fetch(api.medicalShowPath,{family_id:this.props.location.state.family_id , id:this.props.location.state.medicalrecordid})
     .then(({data,status})=>{
       if(status == 'success'){
         const { images } = data
         let files = []
         for (let key in images) {
           const params = {
             url: images[key].large,
             id: key
           }
           files.push(params)
         }


         console.log(files)
         this.setState({
           LastData:data,
           id:this.props.location.state.medicalrecordid,
           family_id:this.props.location.state.family_id,
           department_id:data.department.id,
           hospital_name:data.hospital,
           department_name:data.department.name,
           doctor_name:data.doctor_name,
           symptoms:data.symptoms,
           disease:data.disease,
           diagnosed_at:moment(data.diagnosed_at).format('YYYY-MM-DD'),
           person:data.patient.name,
           files
         })
       }
     })
  }

  //获取科室
  getDepartments = ()=>{
     _fetch(api.departments,{type:'all'})
      .then(({data,status})=>{
        if(status == 'success'){
          this.setState({
            departmentData:data
          })
        }
      })
  }
  //获取家庭成员
  getFamily = ()=>{
    _fetch(api.families)
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
          }
          this.setState({data,personData:newData})
        }
      })
  }


  //选择科室
  handleDepartment = (v)=>{
    let id = v[1]
    this.state.departmentData.map((item)=>{
      item.children.map((iitem)=>{
        if(iitem.value == v[1]){
          this.setState({
            department_name:iitem.label,
            department_id:iitem.value
          })
          return;
        }
      })
    })
  }
  //图片选择
  onChange = (files, type, index) => {
    this.setState({
      files,
    });
    let length = files.length-1
    if(type=='add'){
      let formData = new FormData()
      formData.append('image', files[length].file)
      _fetch(api.upload_image,formData,'FormData')
        .then(({data,status})=>{
          if(status == 'success'){
            let img_id = this.state.img_id
            img_id.push(data.id)
            console.log(img_id)
            this.setState({img_id})
          }
        })
    }
    if(type == 'remove'){
      let img_id = this.state.img_id
      img_id.splice(index,1)
      this.setState({img_id})
    }
  }
  //提交
  handleSubmit = ()=>{

    const { id ,family_id,diagnosed_at,disease,hospital_name,department_id,doctor_name,symptoms,img_id } = this.state
    let formData = new FormData()
    formData.append('id', id)
    formData.append('family_id', family_id)
    formData.append('diagnosed_at', diagnosed_at)
    formData.append('disease', disease)
    formData.append('hospital_name', hospital_name)
    formData.append('department_id', department_id)
    formData.append('doctor_name', doctor_name)
    formData.append('symptoms', symptoms)
    img_id.length>0 && img_id.map(function(item){
       formData.append('images[]', item)
    })

    if(this.state.LastData){
      _fetch(api.medicalRecordsUpdatePath ,formData,'FormData')
      .then(({data,status})=>{
        if(status == 'success'){
          Toast.info('更新成功');
          this.props.history.push({
          pathname: '/HealthRecords',
            state: {
              family_id:family_id,
            }
          })
        }else{
          Toast.info('更新遇到错误');
        }
      })

    }else{
      _fetch(api.medical_records_create,formData,'FormData')
      .then(({data,status})=>{
        if(status == 'success'){
          Toast.info('保存成功');
          this.props.history.push({
          pathname: '/HealthRecords',
            state: {
              family_id:family_id,
            }
          })
        }else{
          Toast.info('保存遇到错误');
        }
      })
    }

  }
  // 渲染
  render() {
    const { person, personData,departmentData, files,disease,hospital_name,diagnosed_at,department_name,doctor_name,symptoms } = this.state

    return (
      <div className="AdditionCases clearfix">
      <ReactIScroll
        iScroll={iScroll}
        options={{
          preventDefault:false
        }}
      >
        <div className="AdditionCases_content">
          <List>
            <Picker
              extra={<span style={{color:person=="请选择" ? '#bbb' : '#222'}}>{person}</span>}
              data={personData}
              title="选择就诊人"
              cascade={false}
              onChange={(v)=>this.handlePersonSelected(v[0])}
             >
              <List.Item arrow="horizontal">就诊人</List.Item>
            </Picker>
          </List>

          <List>
            <DatePicker
              extra = {<span style={{color:diagnosed_at=="请选择" ? '#bbb' : '#222'}}>{diagnosed_at}</span>}
              mode="date"
              title="选择日期"
              minDate={minDate}
              maxDate={maxDate}
              onChange={this.handleDateChange}
            >
              <List.Item arrow="horizontal">就诊日期</List.Item>
            </DatePicker>
          </List>
          <List>
            <InputItem
              placeholder="不填表示未确诊(选填)"
              value={disease}
              onChange = {this.handleDisease}
            >确诊疾病</InputItem>
          </List>
          <List>
            <InputItem
              placeholder="必填"
              value={hospital_name}
              onChange = {this.handleHospital}
            >就诊医院</InputItem>
          </List>
          <List>
            <Picker
              extra={<span style={{color:department_name=="请选择" ? '#bbb' : '#222'}}>{department_name}</span>}
              data={departmentData}
              title="选择科室"
              cols={2}
              onChange={this.handleDepartment}

            >
              <List.Item arrow="horizontal">就诊科室</List.Item>
            </Picker>
          </List>
          <List>
            <InputItem
              placeholder="选填"
              value={doctor_name}
              onChange = {this.handleDoctorName}
            >医生姓名</InputItem>
          </List>
          <List>
            <List.Item>症状说明</List.Item>
            <TextareaItem
              maxLength={500}
              autoHeight = {true}
              value={symptoms}
              placeholder="请详细描述您的病情，及医生对您的治疗经过。（必填，500字以内）"
              onChange={(symptoms)=>this.setState({symptoms})}
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

            <Button style={{ width: '80%',margin:'0.6rem auto' }} disabled={!hospital_name ||!person } type="primary"  onClick={this.handleSubmit}>保存</Button>

        </div>
        </ReactIScroll>
      </div>
    )
  }
}
