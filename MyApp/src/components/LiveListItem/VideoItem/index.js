import React, { Component, PropTypes } from 'react';
import { Carousel, WhiteSpace, WingBlank ,SearchBar, Button ,} from 'antd-mobile';
import './index.scss';
import { Link } from 'react-router-dom'
import moment from 'moment'

export default class VideoItem extends Component {
  render() {
      let item = this.props;
      return (
        <li className="recommended_videotape_item" key={item.id}>
          <Link to={ {pathname: (item.has_video ? `/videos/${item.video.id}` : `/lives/${item.id}`), state: item }}>
            {item.has_video  && item.video ?
              <div className=" recommended_videotape_content clearfix">
                <div className="img_wrap pull-left">
                  <img src={item.video.cover} alt=""/>
                  <p className="videotape_status">{item.has_video ? "录播" : "直播结束"} </p>
                </div>
                <div className="recommended_videotape_info pull-left">
                  <h5>{item.video.title}</h5>
                  <p>
                    <span>{item.video.doctor.name}</span>
                    <span>{item.video.doctor.hospital.name}</span>
                    <span>{item.video.doctor.department.name}</span>
                  </p>
                  <p>
                    {item.video.tags.map((item, index) =>
                      <span key={index}>{item}</span>
                    )}
                  </p>
                  {
                    item.video.charge_free ?
                    <div>
                      <div className="sanjiao sanjiao_green"></div>
                      <span className="sanjiao_text sanjiao_text_green">免费</span>
                    </div>
                    :
                    <div>
                      <div className="sanjiao sanjiao_red"></div>
                      <span className="sanjiao_text sanjiao_text_red"><span className="qian">￥</span>{parseFloat(item.video.price)}</span>
                    </div>
                  }
                </div>
              </div>
              :
              <div className=" recommended_videotape_content clearfix">
                <div className="img_wrap pull-left">
                  <img src={item.cover} alt=""/>
                  <p className="videotape_status">{item.has_video ? "录播" : "直播结束"} </p>
                </div>
                <div className="recommended_videotape_info pull-left">
                  <h5>{item.title}</h5>
                  <p>
                    <span>{item.doctor.name}</span>
                    <span>{item.doctor.hospital.name}</span>
                    <span>{item.doctor.department.name}</span>
                  </p>
                  <p>
                    {item.tags.map((item, index) =>
                      <span key={index}>{item}</span>
                    )}
                  </p>
                  {
                    item.charge_free ?
                    <div>
                      <div className="sanjiao sanjiao_green"></div>
                      <span className="sanjiao_text sanjiao_text_green">免费</span>
                    </div>
                    :
                    <div>
                      <div className="sanjiao sanjiao_red"></div>
                      <span className="sanjiao_text sanjiao_text_red"><span className="qian">￥</span>{parseFloat(item.price)}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </Link>
        </li>
      )
    }
}
