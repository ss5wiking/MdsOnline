import api from '@/api'
export default (config={})=>{
	global._fetch(api.wxJsConfig,{url:encodeURIComponent(global.location.href)})
		.then(data=>{
			// console.log(data,1111)
			global.wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.appid,
				timestamp: String(data.timestamp),
				nonceStr: data.noncestr,
				signature: data.signature,
				jsApiList:[
					"onMenuShareTimeline", //分享到朋友圈 
					"onMenuShareAppMessage", //分享给朋友
					"onMenuShareQQ", //分享给QQ
					"onMenuShareWeibo", //分享到微博
					"onMenuShareQZone", //分享到QQ空间
					"startRecord",
					"stopRecord",
					"onVoiceRecordEnd",
					"playVoice",
					"uploadVoice"
				],
			});
		})
}