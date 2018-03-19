import React, {Component} from 'react';
import './index.scss' ;
// import dianjishubiao from 'static/dianjishubiao.svg';
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";
import arrow from "images/arrow.svg";
export default class DoctorDetails extends Component {
  render() {
		let data = this.props.data;
    console.log(this.props.data, 33333)
		return (
      <div className="doctor_details_Conponents">
        <ReactIScroll
          iScroll={iScroll}
          options={{
            preventDefault:false
          }}
        >
          <div className="srcoll_wrap">
            <div className="space_gray"></div>
            <div className="clearfix doctor_info_wrap clearfix">
              <div className="doctor_img pull-left">
                <img src={data.avatar} />
              </div>
              <div className="doctor_info pull-left">
                <p>
                  <span>{data.name}</span>
                  <span>({data.title})</span>
                </p>
                <p>
                  <span>{data.hospital.name}</span>
                  <span>{data.department.name}</span>
                </p>
              </div>
              <img src={arrow} className="arrow pull-right"/>
            </div>
            <div className="introduce">
              <p>简介</p>
              <p>{data.introduction}</p>
            </div>
            <div className="good_at">
              <p>擅长</p>
              <p>{data.skills}</p>
            </div>
          </div>
        </ReactIScroll>
      </div>
		);
	}
}
