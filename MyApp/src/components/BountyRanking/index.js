import React, {Component} from 'react';
import './index.scss' ;
import rank1 from "images/rank1.svg";
import rank2 from "images/rank2.svg";
import rank3 from "images/rank3.svg";

export default class BountyRanking extends Component {
  componentWillReceiveProps(nextProps){
  }
  render() {
		let data = this.props.data;
		let i = this.props.index;
		return (
        <div className="bounty_ranking common_section_margin">
            {
              data.length>0 && data.map(function(item,i){
                return (
                  <div className="play_list clearfix" key={i}>
                    <div className="play_img pull-left">
                    {
                      i==0 && <img src={rank1}/>
                    }
                    {
                      i==1 && <img src={rank2}/>
                    }
                    {
                      i==2 && <img src={rank3}/>
                    }
                    </div>
                    <div className="play_name pull-left">{item.name}</div>
                    <div className="play_money pull-right">{item.amount}</div>
                  </div>
                )
              })
            }
        </div>
		);
	}
}
