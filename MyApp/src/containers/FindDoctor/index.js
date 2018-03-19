import React, { Component } from 'react';
import { Carousel, WhiteSpace, WingBlank, Flex } from 'antd-mobile';
import './index.scss';
import { NavLink } from 'react-router-dom';
import api from '@/api'
import ReactIScroll from "react-iscroll";
import iScroll from "iscroll/build/iscroll-probe.js";

export default class FindDoctor extends Component {
    // 默认数据
    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    //当props或state更新之后，使用它更新DOM节点。元素完全挂在完毕，可以获取元素宽高信息
    componentDidMount(){
      global._fetch(api.commonCarouselPath)
      .then(result=>{
        if(result.status=="success"){
          this.setState({
            data:result.data
          })
        }
      })
  	}
    // 请求数据

    // 滚动

    // 渲染
    render() {
        return (
          <div className = "finddoctor_wrap" >
            <ReactIScroll
              iScroll={iScroll}
              options={{
                preventDefault:false
              }}
            >
            <div className="scroll_wrap">
              <div className="swipe_wrap">
                <img src="/static/medical_education_fc.png"/>
              </div>
              <div className="search_warp">
                <div className="uninput">
                  <div>
                  <img src="/static/sousuoant.svg"/>
                  请输入疾病，医生，医院，科室
                  </div>
                </div>
              </div>
              <div className="lookup clearfix">
                <NavLink to="/Selector" className="address_lookup clearfix pull-left">
                  <div className="img_wrap pull-left"> 
                    <img src="/static/According_to_the_address_search.svg"/>
                  </div>
                  <div className="content pull-left">
                    <p>按地区查找</p>
                    <p>寻找您周边的医生</p>
                  </div>
                </NavLink>
                <NavLink to="/SelectorSecond" className="department_lookup pull-left">
                  <div className="img_wrap pull-left">
                    <img src="/static/According_to_the_disease_search.svg"/>
                  </div>
                  <div className="content pull-right">
                    <p>按科室查找</p>
                    <p>快速匹配对症医生</p>
                  </div>
                </NavLink>
              </div>
              <div className="common_diseases">
                <p className="common_diseases_title clearfix">
                  <span className="pull-left">常见疾病</span>
                  <span className="pull-right">更多</span>
                </p>
                <Flex className="common_diseases_list">
                  <Flex.Item>骨质增生</Flex.Item>
                  <Flex.Item>关节炎</Flex.Item>
                  <Flex.Item>颈椎病</Flex.Item>
                  <Flex.Item>胆结石</Flex.Item>
                </Flex>
                <Flex className="common_diseases_list">
                  <Flex.Item>甲亢</Flex.Item>
                  <Flex.Item>小儿腹泻</Flex.Item>
                  <Flex.Item>乳腺癌</Flex.Item>
                  <Flex.Item>早泄</Flex.Item>
                </Flex>
                <Flex className="common_diseases_list common_diseases_list_last">
                  <Flex.Item>胃溃疡</Flex.Item>
                  <Flex.Item>脑梗塞</Flex.Item>
                  <Flex.Item>肺炎</Flex.Item>
                  <Flex.Item>胃炎</Flex.Item>
                </Flex>
              </div>
              <div className="all_departments">
                <p className="all_departments_title">全部科室</p>
                <Flex className="all_departments_list">
                  <Flex.Item>
                    <img src="/static/department_of_orthopedics.svg"/>
                    <p>骨科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/The_pediatric.svg"/>
                    <p>儿科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/Obstetrics_Gynecology_Department.svg"/>
                    <p>妇产科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/Dental_Department.svg"/>
                    <p>口腔科</p>
                  </Flex.Item>
                </Flex>
                <Flex className="all_departments_list">
                  <Flex.Item>
                    <img src="/static/The_Department_of_general_surgery.svg"/>
                    <p>普外科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/male_division.svg"/>
                    <p>男科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/Digestive_department.svg"/>
                    <p>消化内科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/Department_of_Dermatology.svg"/>
                    <p>皮肤科</p>
                  </Flex.Item>
                </Flex>
                <Flex className="all_departments_list">
                  <Flex.Item>
                    <img src="/static/Internal_Medicine_Neurology.svg"/>
                    <p>神经科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/Department_of_ENT.svg"/>
                    <p>耳鼻咽喉科</p>
                  </Flex.Item>
                  <Flex.Item>
                    <img src="/static/Urology_Surgery.svg"/>
                    <p>泌尿外科</p>
                  </Flex.Item>
                  <Flex.Item>
                  </Flex.Item>
                </Flex>
              </div>
            </div>
            </ReactIScroll>
          </div>

        )
    }
}
