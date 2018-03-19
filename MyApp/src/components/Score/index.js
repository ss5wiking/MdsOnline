import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

export default function Score(props){
	let integer = String(props.score).split('.')[0] || 0
	let dot = String(props.score).split('.')[1] || 0
	return (
		<div className='Score'>
			{
				[1,1,1,1,1].map(function(item, i){
					return <div key ={i} style={{margin:`0 ${props.margin}`}}>
						<i style={{width:props.width,height:props.width}}></i>
						{
							i < integer
								? <i className = 'active' style={{width:props.width,height:props.width}}></i>
								: i == integer
									? <i className = 'active' style={{width:`${dot*10}%`,height:props.width}}></i>
									: ''
						}
					</div>
				})
			}
		</div>
	)
}
Score.propTypes = {
	score : PropTypes.oneOfType([PropTypes.number,PropTypes.string]).isRequired,
	width : PropTypes.string.isRequired,
	margin : PropTypes.string.isRequired,
}
