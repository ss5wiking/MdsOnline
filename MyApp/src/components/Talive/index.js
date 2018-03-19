import React, { Component, PropTypes } from 'react';
import { Carousel, WhiteSpace, WingBlank ,SearchBar, Button ,} from 'antd-mobile';
import './index.scss';
import { Link } from 'react-router-dom'
import moment from 'moment'

export default class Talive extends Component {

  render() {
      let item = this.props.data;
      const { type,data } = this.props
      let info = {
        cover:type ===  "1" ? data.live.cover : data.cover,
        title: type === "1" ? data.live.title : data.title,
        hospitalname:type === "1" ? data.hospital.name : data.doctor.hospital.name,
        live_status : type ===   "1" ? data.live.live_status : data.live_status,
        departmentname: type === "1" ? data.department.name : data.doctor.department.name,
        hospitalname: type === "1" ? data.hospital.name : data.doctor.hospital.name,
        doctorname:type === "1" ? data.name : data.doctor.name,
        tags:type === "1" ? data.live.tags : data.tags,
        charge_free:type === "1" ? data.live.charge_free : data.charge_free,
        price:type === "1" ? data.live.price : data.price,
      }

      return (
				<li className="Talive">
        {
          item?
          <div className="Talive_content clearfix">
						<div className="img_wrap pull-left">
							<img src={ info.cover} alt=""/>
              {
                info.live_status == "pending" ?
                <p className="videotape_status">未开始</p>
                :info.live_status == "living" ?
                <p className="videotape_status">直播中</p>:
                <p className="videotape_status">已结束</p>
              }
						</div>
						<div className="recommended_videotape_info pull-left">
							<h5>{ info.title}</h5>
              <p>
              	<span>{info.hospitalname}</span>
              	<span>{info.departmentname}</span>
              	<span>{info.doctorname}</span>
              </p>
              <p>
              	{
              		info.tags.map((value,index)=>{
              			return(
              				<span key={index}>{value}</span>
              			)
              		})
              	}
              </p>
              	{
              		info.charge_free == false ?
              		<div>
              			<div className="sanjiao sanjiao_red"></div>
              			<span className="sanjiao_text sanjiao_text_red"><span className="qian">￥</span>{info.price}</span>
              		</div>
              		:
              		<div>
              			<div className="sanjiao sanjiao_green"></div>
              			<span className="sanjiao_text sanjiao_text_green">免费</span>
              		</div>
              	}
						</div>
					</div>
          :
          ""
        }
				</li>
      )
    }
}
