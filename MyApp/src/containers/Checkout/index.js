import React, {Component} from 'react';
import api from '@/api'
import { Button, Toast, Result, Modal } from 'antd-mobile';
import './index.scss' ;
import _ from 'lodash/core'
import {connect} from 'react-redux'
import URLSearchParams from 'url-search-params'

class Checkout extends Component {

  constructor(props) {
    super(props)
    const { location } = this.props
    const params = this.props.match.params
    const query = new URLSearchParams(location.search)
    let type  = query.get("type")
    let disabled = false
    if(type != "bounty" && _.isNull(location.state) ) {
      global.disbaled =  true
    }
    
    let initState = {
      customBounty: false, //是否选择自定
      payAmount: 0, //支付金额
      payWay: 'wechat_pay', //选择支付方式
      checkoutDisabled: disabled , //是否启用支付按钮
      itemInfo: location.state, //非打赏交易时，显示商品的信息
      paid: false //是否支付完成后
    }
    if(!_.isNull(location.state) && type != "bounty") {
      initState.payAmount = location.state.price
    }
    if(!_.isEmpty(location.search)) {
      initState.type =  type.toLowerCase()
    }
    this.state = initState
    this.handleCheckout = this.handleCheckout.bind(this)
  }
  
  componentDidMount() {
    if(!sessionStorage.getItem('hasReload')){
      sessionStorage.setItem('hasReload',true)
      global.location.reload()
    }
  }
  componentWillUnmount() {
    sessionStorage.setItem('hasReload','')
  }

  // 处理微信支付
  wechatPay(data) {
    const wxData = {
      appId: data.app_id,
      nonceStr: data.nonce_str,
      sign: data.sign,
      timestamp: data.timestamp,
      wpackage: data.package
    }
    if( document.addEventListener ){
      document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(wxData), false);
    }else if (document.attachEvent){
      document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(wxData)); 
      document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(wxData));
    } else {
      this.onBridgeReady(wxData)
    }
  }

  // 微信调用支付
  onBridgeReady(wxData) {
    const self = this
    const { appId, nonceStr, sign, timestamp, wpackage } = wxData
    const options = {
      "appId": appId,     //公众号名称，由商户传入     
      "timeStamp": `${timestamp}`,         //时间戳，自1970年以来的秒数     
      "nonceStr": nonceStr, //随机串     
      "package": wpackage,
      "signType": "MD5",         //微信签名方式：     
      "paySign": sign //微信签名 
    }
    global.WeixinJSBridge.invoke(
      'getBrandWCPayRequest', options,
      function(res){     
        // 交易成功
        if(res.err_msg == "get_brand_wcpay_request:ok" ) {
          self.redirectReferer()
          self.setState({paid: true})
        }  
        // 交易失败
        if(res.err_msg == "get_brand_wcpay_request:fail" ) {
          alert(res.err_desc)
          self.setState({ checkoutDisabled: false })
        }
        // 交易取消
        if (res.err_msg == "get_brand_wcpay_request:cancel"){ 
          self.setState({ checkoutDisabled: false })
        }
      }
    ); 
  }

  //打赏选择其他金额的时候清空自定义信息
  clearCustomBounty() {
    this.setState({customBounty: false});
    this.customBountyInput.value = ""
  }

  redirectReferer() {
    const { history } = this.props
    const { type, itemInfo } = this.state
    switch(type) {
      case "bounty":
        history.push({pathname: `/lives/${itemInfo.id}`})
        break
      case "live":
        history.push({pathname: `/lives/${itemInfo.id}`})
        break
      case "video":
        history.push({pathname: `/videos/${itemInfo.id}`})
        break
      case "consult":
        localStorage.setItem('firstComing',true)
        history.replace({pathname: `/ImageChat/${itemInfo.id}`})
        break
      default:
        break
    }
  }

  /* Events function write here */

  // 确认支付Checkout
  handleCheckout(event) {
    const { type, payWay, itemInfo: {id}, payAmount } = this.state
    
    if(type == "bounty" && parseFloat(payAmount) <= 0) {
      Toast.fail("打赏金额不能小于0元")
      return event.preventDefault()
    }

    // 请求将支付按钮disabled, 防止重复支付
    this.setState({ checkoutDisabled: true })

    // 请求API发送订单信息
    _fetch(api.createOrderPath, { type: type, id: id, amount: payAmount, pay_way: payWay }, "POST").then(res =>{
      if(res.status == "success") {
        if(this.state.payWay === "wechat_pay") {
          this.wechatPay(res.data)
        } 
        if(this.state.payWay === "alipay_wap"){
          window.location.href = res.data.pay_url
        }
      } else {
        switch(res.error_code){
          case 100004:
            alert("请先登录");
            break;
          default:
            alert(res.error_message);
            break
        }
      }
    })
  }

  // 支付方式修改
  handlePaymentChange(event) {
    this.setState({ payWay: event.currentTarget.value })
  }

  // 打赏金额修改
  handleBountyAmountChange(event) {
    const value = parseFloat(event.currentTarget.value)
    this.setState({ payAmount: value })
  }

  /*  View Write here */

  // 普通订单详情
  renderBase() {
    const {title, price} = this.state.itemInfo
    return (
      <div>
        <div className="common_list wait_pay_title ">
          <p className="clearfix">
            <span>订单详情</span>
            <span>{title}</span>
          </p>
        </div>
        <div className="common_list wait_pay_price">
          <h3>
            {price}元
          </h3>
          <span>所需费用</span>
        </div>
      </div>
    )
  }

  // 打赏金额选择界面
  renderBounty()  {
    const { customBounty, payAmount } = this.state
    return (
      <div className="common_list pay_price">
        <div className="pay_div clearfix">
          <div className="pay_box clearfix">
            {
              [1, 5, 10, 20, 50].map( (value, i) =>(
                <input
                  key={i}
                  type="button"
                  className={ !customBounty && payAmount == value ? "zm_Price pull-left zm_Checked" : "zm_Price pull-left"}
                  value={value}
                  onClick={ (e) => { this.clearCustomBounty(); this.handleBountyAmountChange(e) } }
                />
              ))
            }
            <input 
              type="text"
              ref={(input) => { this.customBountyInput = input }}
              className={ customBounty ?  "zm_Price pull-left zm_Checked" : "zm_Price pull-left" }
              placeholder="输入金额" 
              onClick={(e) => this.setState({customBounty: true}) } 
              onChange={ (e) => this.handleBountyAmountChange(e)} 
            />
          </div>
        </div>
      </div>
    )
  }

  // 支付宝交易界面

  renderAlipay() {
    return (
      <div className="container-fluid wait_pay">
      </div>
    )
  }

  render() {
    const { checkoutDisabled, payWay, type, paid, itemInfo } = this.state
    const parentData = this.props.location.state
    // 来源不正确的时候显示这个页面
    if(_.isUndefined(type) || itemInfo == null) {
      return(
        <div className="container-fluid wait_pay">
          <Result
            img={<img src="https://gw.alipayobjects.com/zos/rmsportal/GIyMDJnuqmcqPLpHCSkj.svg" />}
            title="无法完成操作"
            message={<span>请重新刷新页页面, 或者返回上一页面</span>}
          />
        </div>
      )
    }
    // 支付完成, 微信跳转回页面, 支付宝显示
    if (paid) {
      if(payWay == "alipay_wap") {
        return this.renderAlipay()
      }
    }
    return (

      <div className="container-fluid wait_pay">
        <div className="list-group row">
          { this.state.type === "bounty" ? this.renderBounty() : this.renderBase() }
          <div className="wait_pay_type">
            支付方式
          </div>
          <div className="wait_pay_type_content">
            <p className="common_list">
              <label>
                <img src="/static/weixin.svg"/>
                <span>微信支付</span>
                <input name="pay_way" type="radio" value="wechat_pay" checked={ payWay === "wechat_pay" } onChange={ (e) => this.handlePaymentChange(e) } />
              </label>
            </p>
            {
            // 因为系统原因注销支付宝支付  
            /*<p className="common_list">
              <label>
                <img src="static/zhifubao.svg"/>
                <span>支付宝支付</span>
                <input name="pay_way" type="radio" value="alipay_wap" checked={ payWay === "alipay_wap" } onChange={ (e) => this.handlePaymentChange(e) }/>
              </label>
            </p>
            */}
          </div>
          <div className="common_btn_position_bottom">
            <Button className={`common-btn common-btn-red ${ checkoutDisabled && 'disabled'}`}  onClick={ this.handleCheckout } disabled={ checkoutDisabled }>确认支付</Button>
          </div>
        </div>

        <Modal
          visible={this.state.paid}
          transparent
          maskClosable={false}
          title="交易结果"
          footer={[{ text: '确认'}]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ height: 100 }}>
            支付成功
          </div>
        </Modal>
      </div>
    );
  }
}

export default Checkout
