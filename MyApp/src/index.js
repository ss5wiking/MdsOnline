
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import FastClick from 'fastclick' // 解决移动端300ms延迟
import Routers from '@/routers'
import configureStore from '@/store/configureStore'
import api from '@/api'
import '@/service/global.js'
import './index.css';
// import App from './containers/App';
// import registerServiceWorker from './registerServiceWorker';
import cookie from 'react-cookies'
import _ from 'lodash'

import wxConfig from  '@/service/wxconfig'
import './style/common.scss'
import  '@/service/flexible'
require('es6-promise').polyfill()
require('isomorphic-fetch')


function isPassive() {
  var supportsPassiveOption = false;
  try {
      window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
          get: function () {
              supportsPassiveOption = true;
          }
      }));
  } catch(e) {}
  return supportsPassiveOption;
}

// 解决移动端300ms延迟
window.addEventListener("load", ()=>{
  FastClick.attach(document.body);
})

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
  capture: false,
  passive: false
} : false);



console.log(token, "token" )
// 本地测试数据
console.log(process.env ,"console.log(process.env)")
if(process.env.NODE_ENV === "development"){
  cookie.remove('mds_token')
  cookie.save('mds_token', 'rQVsjPTseWbgC02FnilpR0gqzg+vCJefEV1p3BDlIq3dwAA76CKTGUaOMu8uKB2YyM641rkN/MjT1pkG4EsyEg==', {path: '/'})
  // cookie.save('mds_token', 'sfmMSI8XqPpuTnE4W4za/NM4+9oWPhR0Y1W6lrDekwdLCAywPnFrclmtuoqNh6wtLr2nuvObnR7A8O+szBbetA==', {path: '/'})
  cookie.remove('user_id')
  cookie.save('user_id', '27', {path: '/'})
}
// rQVsjPTseWbgC02FnilpR0gqzg+vCJefEV1p3BDlIq3dwAA76CKTGUaOMu8uKB2YyM641rkN/MjT1pkG4EsyEg%3D%3D
const token = cookie.load("mds_token")
const gotoGetWxCode = (appId, redirect) => {
  const wxApi = 'https://open.weixin.qq.com/connect/oauth2/authorize'
  const wxAuth = `${wxApi}?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
  console.log(wxAuth,"wxAuth")
  return wxAuth
}

const getCodeBySearch = search => {
  if (!search) {
    return null
  }

  const qs = search.slice(1).split('&')
  let code = null

  console.log(qs ,"qs898989")
  qs.some(item => {
    const [key, value] = item.split('=')
    if (key === 'code') {
      code = value
    }
  })
  console.log(code ,"code898989")
  return code
}

let reqUrl

const getAccessToken = code => {
  reqUrl = `${api.get_access_token}?code=${code}`
  return global._fetch(reqUrl)
}

console.log(_.isNil(token), "_.isNil(token)")
const ownPageLink = window.location
const wxCode = getCodeBySearch(ownPageLink.search)
console.log(wxCode , "789wxCode")
// GET /api/patient/auth/get_access_token
if(process.env.DEPLOY === 'test') {  
  console.log(1 ,"1")
  // 未授权
  if(_.isNil(token)){
    if (!wxCode) { // 没有 code，需要获取 code
      const appId = 'wx28c955c6fd3382f9'
      window.location = gotoGetWxCode(appId, ownPageLink)
    } else { // 有 code，继续获取 token
      getAccessToken(wxCode)
        // 成功设置 token
        .then(res => {
          // 下面token打出来 +reD3OEsTpcb4q5hYb5uLOlgj6c1CB6U8JO6hyMY9QjvjQmAfDyzHccjtLzfwBvDe/WDIkBNe0K+goM4lEIUjQ== res
          console.log(res.data.access_token, "access_token")
          // 存token
          cookie.save('mds_token', res.data.access_token, {path: '/'})
          //打印token 
          console.log(cookie.load("mds_token"),"newaccess_token")
          // document.body.innerHTML = `<p>测试环境成功 request url: ${reqUrl}</p><p>wechat code: ${wxCode}</p><p>response data: ${JSON.stringify(res)}</p>`
          window.location = "https://www.mdsonline.cn/HomePage/0"
        })
        // 失败 %2BreD3OEsTpcb4q5hYb5uLOlgj6c1CB6U8JO6hyMY9QjvjQmAfDyzHccjtLzfwBvDe%2FWDIkBNe0K%2BgoM4lEIUjQ%3D%3D
        .catch(err => {
          document.body.innerHTML = `<p>测试环境失败 requestrequest url: ${reqUrl}</p><p>wechat code:${wxCode}</p><p>response data: ${JSON.stringify(err)}</p>`
        })
    }
  }

}else if( process.env.DEPLOY === "production" ){ 
  console.log(2 ,"2")
  if(_.isNil(token)){
    if (!wxCode) { // 没有 code，需要获取 code
      const appId = 'wx95cb2975c879c2c0'
      window.location = gotoGetWxCode(appId, ownPageLink)
    } else { // 有 code，继续获取 token
      getAccessToken(wxCode)
        // 成功设置 token
        .then(res => {
          
          document.body.innerHTML = `<p>正式环境成功 request url: ${reqUrl}</p><p>wechat code: ${wxCode}</p><p>response data: ${JSON.stringify(res)}</p>`
        })
        // 失败
        .catch(err => {
          document.body.innerHTML = `<p>request url: ${reqUrl}</p><p>wechat code:${wxCode}</p><p>response data: ${JSON.stringify(err)}</p>`
        })
    }
  }
}

setTimeout(wxConfig, 1000)

  const store = configureStore({ Auth: {access_token: token }})

  render((
    <Provider store={store}>
      <Routers />
    </Provider>
  ), document.getElementById('root'))
  
