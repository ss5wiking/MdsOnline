import React, {Component} from 'react';
import {Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import MyAttention from '@/containers/MyAttention'
import TabBar from '@/containers/TabBar'
import LivePage from '@/containers/LivePage'
import SearchResult from '@/containers/SearchResult'
import LiveContent from '@/containers/LiveContent'
import VideoContent from '@/containers/VideoContent'
import Checkout from '@/containers/Checkout'
import MyLiveList from '@/containers/MyLiveList'
import Selector from '@/containers/Selector'
import SelectorSecond from '@/containers/SelectorSecond'
import DoctorDetails from '@/containers/DoctorDetails'

import ImageText from '@/containers/ImageText'
import ImageChat from '@/containers/ImageChat'
import AskComment from '@/containers/AskComment'
import DiagnoseDetail from '@/containers/DiagnoseDetail'
import AboutDoctorDisease from '@/containers/AboutDoctorDisease'
import AboutDoctor from '@/containers/AboutDoctor'
import MemberFamily from '@/containers/MemberFamily'
import AddMemberFamily from '@/containers/AddMemberFamily'
import AdditionCases from '@/containers/AdditionCases'
import HealthRecords from '@/containers/HealthRecords'
import MyInquisition from '@/containers/MyInquisition'
import HealthRecordsDetails from '@/containers/HealthRecordsDetails'
import DiseaseObstetricalHistory from '@/containers/DiseaseObstetricalHistory'
import DiseaseSurgeryTrauma from '@/containers/DiseaseSurgeryTrauma'
import DiseaseHabitsCustoms from '@/containers/DiseaseHabitsCustoms'
import DiseaseFoodAllergy from '@/containers/DiseaseFoodAllergy'
import DiseaseFamilyHistory from '@/containers/DiseaseFamilyHistory'
import DiseaseDrugAllergy from '@/containers/DiseaseDrugAllergy'
import HomeSearchResuilt from '@/containers/HomeSearchResuilt'
import MyRecordingList from '@/containers/MyRecordingList'
import WhitePage from '@/containers/WhitePage'
import Message from '@/containers/Message'
import MessageSys from '@/containers/MessageSys'
import MessageInquiryNew from '@/containers/MessageInquiryNew'
import ExpertConsultation from '@/containers/ExpertConsultation'
import MineDoctorsList from '@/containers/MineDoctorsList'
import PatientEvaluation from '@/containers/PatientEvaluation'
import DoctorsLivesList from '@/containers/DoctorsLivesList'

const supportsHistory = 'pushState' in window.history

let d_title = ''

if(process.env.NODE_ENV == 'production'){
  d_title = '麦迪森健康'
}else{
  d_title ='麦迪森百科'
}

const setPageTitle = title => (
  document.title = title
)
const PageTitleRoute = ({ title = d_title, ...rest }) => {
  setPageTitle(title)

  return <Route {...rest} />
}

const Routers = () =>(
    <Router basename='/weixin' forceRefresh={!supportsHistory}>
    <Switch>
    <PageTitleRoute path='/MyAttention' component={MyAttention}  title='我的关注'></PageTitleRoute>
     
        <Route exact path='/' component={TabBar} title={d_title}></Route>
        <PageTitleRoute path='/HomePage/:index' component={TabBar} title={d_title}></PageTitleRoute>
     
        <PageTitleRoute path='/streams' component={LivePage}  title='健康直播间'></PageTitleRoute>
        <PageTitleRoute path='/search' component={SearchResult}  title='搜索结果'></PageTitleRoute>
        <PageTitleRoute path='/lives/:id' component={LiveContent}  title='直播详情'></PageTitleRoute>
        <PageTitleRoute path='/videos/:id' component={VideoContent}  title='录播详情'></PageTitleRoute>
       
        <PageTitleRoute path='/checkout' component={Checkout}></PageTitleRoute>
       
        <PageTitleRoute path='/myLiveList' component={MyLiveList}  title='我的直播'></PageTitleRoute>
        <PageTitleRoute path='/Selector' component={Selector}  title='选择地区'></PageTitleRoute>
        <PageTitleRoute path='/SelectorSecond' component={SelectorSecond}  title='选择科室'></PageTitleRoute>
        <PageTitleRoute path='/ImageText/:id' component={ImageText} title='图文问诊'></PageTitleRoute>
        <PageTitleRoute path='/ImageChat/:id' component={ImageChat}  title='图文问诊'></PageTitleRoute>
        <PageTitleRoute path='/AskComment/:id' component={AskComment}></PageTitleRoute>
        <PageTitleRoute path='/DiagnoseDetail/:id' component={DiagnoseDetail} title='问诊详情'></PageTitleRoute>
        <PageTitleRoute path='/DoctorDetails' component={DoctorDetails}  title='医生详情'></PageTitleRoute>
        <PageTitleRoute path='/AboutDoctor' component={AboutDoctor}  title='医生列表'></PageTitleRoute>
        <PageTitleRoute path='/MemberFamily' component={MemberFamily} title='家庭成员'></PageTitleRoute>
        <PageTitleRoute path='/AddMemberFamily' component={AddMemberFamily} strict  title='添加家庭成员'></PageTitleRoute>
        <PageTitleRoute path='/AdditionCases' component={AdditionCases}  title='添加病例'></PageTitleRoute>
        <PageTitleRoute path='/HealthRecords' component={HealthRecords}  title='健康档案'></PageTitleRoute>
        <PageTitleRoute path='/MyAttention' component={MyAttention}  title='我的关注'></PageTitleRoute>
        <PageTitleRoute path='/MyInquisition' component={MyInquisition}  title='我的问诊'></PageTitleRoute>
        <PageTitleRoute path='/HealthRecordsDetails/:id' component={HealthRecordsDetails}  title='健康档案'></PageTitleRoute>
        <PageTitleRoute path='/DiseaseObstetricalHistory/:id' component={DiseaseObstetricalHistory}  title='婚育史'></PageTitleRoute>
        <PageTitleRoute path='/DiseaseSurgeryTrauma/:id' component={DiseaseSurgeryTrauma}  title='手术与外伤'></PageTitleRoute>
        <PageTitleRoute path='/DiseaseHabitsCustoms/:id' component={DiseaseHabitsCustoms}  title='生活习惯'></PageTitleRoute>
        <PageTitleRoute path='/DiseaseFoodAllergy/:id' component={DiseaseFoodAllergy}  title='食物与接触过敏'></PageTitleRoute>
        <PageTitleRoute path='/DiseaseFamilyHistory/:id' component={DiseaseFamilyHistory}  title='家族病史'></PageTitleRoute>
        <PageTitleRoute path='/DiseaseDrugAllergy/:id' component={DiseaseDrugAllergy}  title='药物过敏'></PageTitleRoute>
        <PageTitleRoute path='/HomeSearchResuilt' component={HomeSearchResuilt}  title='搜索结果'></PageTitleRoute>
        <PageTitleRoute path='/MyRecordingList/' component={MyRecordingList}  title='我的录播'></PageTitleRoute>
        <PageTitleRoute path='/WhitePage/' component={WhitePage}  title='敬请期待'></PageTitleRoute>
        <PageTitleRoute path='/Message' component={Message}  title='消息'></PageTitleRoute>
        <PageTitleRoute path='/MessageSys/' component={MessageSys}  title='系统消息'></PageTitleRoute>
        <PageTitleRoute path='/MessageInquiryNew/' component={MessageInquiryNew}  title='问诊通知'></PageTitleRoute>
        <PageTitleRoute path='/ExpertConsultation/' component={ExpertConsultation}  title='专家问诊'></PageTitleRoute>
        <PageTitleRoute path='/MineDoctorsList/' component={MineDoctorsList}  title='我的医生'></PageTitleRoute>
        <PageTitleRoute path='/AboutDoctorDisease/' component={AboutDoctorDisease}  title='医生列表'></PageTitleRoute>
        <PageTitleRoute path='/PatientEvaluation/:id' component={PatientEvaluation}  title='患者评价列表'></PageTitleRoute>
        <PageTitleRoute path='/DoctorsLivesList/:id' component={DoctorsLivesList}  title='医生直播列表'></PageTitleRoute>
  
      
    </Switch>
  </Router>
)
export default Routers;
