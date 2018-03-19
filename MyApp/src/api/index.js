const url = {}

var __host__ = ""
var __ws_host__ = ""

switch (process.env.NODE_ENV) {
  case 'development':
    // __host__ = 'http://192.168.0.111:3000'
    __host__ = 'https://api.mdsonline.cn'
    __ws_host__ = 'wss://doctor.mdsonline.cn'
    break
 
}


switch (process.env.DEPLOY) {
  case 'test':
    __host__ = 'https://api.mdsonline.cn'
    __ws_host__ = 'wss://doctor.mdsonline.cn'
    break
  case 'production':
  __host__ = 'https://api.mdshealth.cn'
  __ws_host__ = 'wss://doctor.mdshealth.cn'
   break
  default:
    __host__ = 'https://api.mdshealth.cn'
    __ws_host__ = 'wss://doctor.mdshealth.cn'
    break
}


const setPath = (name) => {
  return __host__ + "/api/patient/" + name
}
 // 病人端医生直播列表
url.doctorsLives= setPath('doctors/lives')
// 取消收藏
url.collectsDestroy= setPath('collects/destroy')
// 免费录播收藏
url.collectsCreate= setPath('collects/create')
// 医生评价列表
url.doctorsConsultsFeedbacksPath= setPath('doctors/consults/feedbacks')
// 疾病列表
url.diseasesPath = setPath('diseases')
// 我的医生聊表
url.usersDoctorsPath = setPath('users/doctors')
//取消关注
url.FollowsDestroyPath = setPath('follows/destroy')
// 点击关注
url.FollowsCreatePath = setPath('follows/create')
// 系统消息详情
url.messagesPath = setPath('messages')
// 消息列表
url.messagesShowPath = setPath('messages/show')
// 搜索医生
url.searchSuggestPath = setPath('search/suggest')
// 搜索医生列表
url.searchDoctorsPath = setPath('search/doctors')
// 搜索医生关键字
url.searchKeywordsPath = setPath('search/keywords')
// 更新病例
url.medicalRecordsUpdatePath = setPath('medical_records/update')
// 获取用户病例信息
url.medicalShowPath = setPath('medical_records/show')
// 用户信息
url.usersShowPath = setPath('users/show')
// 我的关注
url.usersFollowsPath = setPath('users/followings')
// 我的问诊
url.usersConsultsPath = setPath('users/consults')
// 家庭成员信息
url.familiesShowPath = setPath('families/show')
// 删除病例
url.medicalRecordsDestroyPath = setPath('medical_records/destroy')
// 病例列表
url.medicalRecordsPath = setPath('medical_records')
// 更新健康档案
url.familiesHealthRecordUpdatePath = setPath('families/health_record/update')
// 我的录播列表
url.usersVideosPath = setPath('users/videos')
// 我的列表
url.usersLivesPath = setPath('users/lives')
// 我的问诊
url.usersConsultsPath = setPath('users/consults')
// 删除家庭成员
url.familiesdestroyPath = setPath('families/destroy')
// 设置默认家庭成员
url.familiesupdatedefaultPath = setPath('families/update_default')
// 更新家庭成员
 url.familiesupdatePath = setPath('families/update')
// 添加家庭成员列表
url.familiescreatePath = setPath('families/create')
// 轮播
url.commonCarouselPath = setPath('common/carousel')
// 家庭成员列表
url.familiesPath = setPath('families')
// 医生列表
url.doctorsPath = setPath('doctors')
// 医生详情
url.doctorsShowPath = setPath('doctors/show')
// 省份和城市
url.RegionsProvincePath = setPath('regions/province')
url.RegionsCityPath = setPath('regions/city')
// 科室
url.departmentsPath = setPath('departments')
// 直播和录播
url.streamHomePath = setPath('streams/home')
url.streamLivesPath = setPath('streams/lives')
url.showLivePath = setPath('streams/lives/show')
url.streamVideosPath = setPath('streams/videos')
url.showVideoPath = setPath('streams/videos/show')
url.showVideoPath = setPath('streams/videos/show')
//微信配置信息
url.wxJsConfig = setPath('wechat/jsconfig')
// 聊天室前30条
url.showChatRoom = setPath('streams/lives/messages')

//创建订单
url.createOrderPath = setPath('orders/create')

// 赞
url.likePath = setPath('comments/like')
// 预定
url.createSubscribePath = setPath('subscribes/create')

// 获取评论
url.commentsPath = setPath('comments')

// 发表评论
url.commentsCreatPath = setPath('comments/create')

// 跳转页面
url.redirectPaths = {}
url.redirectPaths.weixinAuthorizePath = "http://www.mdsonline.cn/weixin"
url.webSocketPath = __ws_host__ + '/cable'
//获取患者列表
url.families= setPath('families')
//上传图片
url.upload_image= setPath('upload/image')
//创建图文问诊
url.consults_create= setPath('consults/create')
//发送问诊消息
url.consults_messages_send= setPath('consults/messages/send')
//聊天室状态
url.consults_show= setPath('consults/show')
//聊天室聊天记录
url.consults_messages_history= setPath('consults/messages/history')
//评价问诊
url.consults_feedback= setPath('consults/feedback')
//添加病例
url.medical_records_create= setPath('medical_records/create')
//科室列表
url.departments= setPath('departments')
//创建病例
url.medical_records_create= setPath('medical_records/create')
//标记已读
url.make_read= setPath('consults/messages/make_read')

// 获取 token
url.get_access_token = setPath('auth/get_access_token')

export default url
