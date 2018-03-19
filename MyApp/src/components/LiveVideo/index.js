import React, {Component} from 'react';
import './index.scss';
const shuaxin = 'static/shuaxin.svg';
const download = 'static/download.svg';


export default class Video extends Component {

  static defaultProps = {
    anchor: false
  };
  static propTypes = {
    anchor : React.PropTypes.bool,
    cover_url : React.PropTypes.string.isRequired,
    pull_urls : React.PropTypes.object.isRequired,
  };
  constructor(props){
    super(props);
    this.myPlayer = null;
  }
  componentDidMount() {
    let option = {
      autoplay:!this.props.anchor,
      inactivityTimeout:5000,
      preload: "auto",
      controls:true,
      techOrder: ["html5"],
      controlBar:{
        'currentTimeDisplay':true,
        'timeDivider':true,
        'durationDisplay':true,
        'remainingTimeDisplay':true,
        playToggle: true,
        progressControl:true
      },
      errorDisplay:false,
      loadingSpinner:true,
      poster: this.props.cover,
      "x-webkit-airplay":"allow",
      "webkit-playsinline":true
    }

    var errorElement = document.createElement("div");
    //添加class   my-error-display
    global.neplayer.addClass(errorElement, "my-error-display");
    //继承组件
    var Component = global.neplayer.getComponent("Component");
    var ErrorComponent = global.neplayer.extend(Component, {});
    //在实例化组件的时候传入组件元素
    var errorComponent = new ErrorComponent(null, {el:errorElement});
    var _this = this;

    this.myPlayer = global.neplayer("my-video", option);
    //设置数据源
    let { http, hls, mp4} = _this.props.pull_urls;

    let dataOption = [
      { type: "video/x-flv", src: http },
    ]
    if(hls) {
      dataOption.push({ type: "application/x-mpegURL", src: hls })
    }
    if(mp4) {
      dataOption.push({ type: "video/mp4", src: mp4 })
    }
    //录播加密
    if('' + _this.props.encrypted == 'true') {
      dataOption = [{
        "type": "video/x-flv",
        "src": http,
        "decryptInfo" : {
          "transferToken":_this.props.decrypt_info.transferToken,
          "accid": _this.props.decrypt_info.accid,
          "token": _this.props.decrypt_info.token,
          "appKey": _this.props.decrypt_info.appKey,
        }
      }]
    }

    this.myPlayer.setDataSource(dataOption)
    this.myPlayer.corePlayer.addChild(errorComponent, {})
    this.myPlayer.onError(function(){
      let text = "";
      text = _this.props.anchor ? '视频出错了，请稍后重试' : '视频加载中，稍等一会就可以继续观看哦~';
      errorElement.innerHTML = `<p>${text}</p><img class="shuaxinBtn" src="/static/shuaxin.svg"></img>`;
      errorElement.onclick = function(){
        var shuaxinBtn = document.querySelector('.shuaxinBtn')
        shuaxinBtn.className = 'shuaxinBtn shuaxinAction'
        global.location.reload()
      }
    });
    errorElement.onclick = function(){
      var shuaxinBtn = document.querySelector('.shuaxinBtn')
      shuaxinBtn.className = 'shuaxinBtn shuaxinAction'
      global.location.reload()
    }
  }
  componentWillUnmount() {
    //当我挂载的时候
    this.myPlayer.reset();  //必须要先reset再release
    this.myPlayer.release()
  }
  render() {

    return (
      <div>
        <video id="my-video"
          className="video-js vjs-fluid vjs-big-play-centered"
        >
        </video>
      </div>
    )
  }
}
