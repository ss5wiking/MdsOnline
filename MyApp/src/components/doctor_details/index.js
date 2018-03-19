import React, {Component} from 'react';
import {Link} from 'react-router';
import './index.scss' ;
// import dianjishubiao from 'static/dianjishubiao.svg';

export default class DoctorDetails extends Component {
  render() {
		let data = this.props.live;
		let i = this.props.index;
		return (
      <div className="doctor_details_Conponents">
        <div className="space_gray"></div>
        <div className="clearfix doctor_info_wrap clearfix">
          <div className="doctor_img pull-left">
            <img src="static/missing_face.png"/>
          </div>
          <div className="doctor_info pull-left">
            <p>
              <span>严干新</span>
              <span>(主任医师)</span>
            </p>
            <p>
              <span>北京大学人民医院</span>
              <span>心血管内科</span>
            </p>
          </div>
          <img src="static/arrow.svg" className="arrow pull-right"/>
        </div>
        <div className="introduce">
          <p>简介</p>
          <p>
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
          </p>
        </div>
        <div className="good_at">
          <p>简介</p>
          <p>
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
            北京大学人民医院超声心动图主任，现任亚太心脏协会委员
          </p>
        </div>
      </div>
		);
	}
}
