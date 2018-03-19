import '@/lib/iscroll-probe'

export default function(item,option={}) {
	document.addEventListener('touchmove',function(e){
		e.preventDefault()
	})
	new global.IScroll(item, option);
}















// {  option
// 	mouseWheel: true,
// 	scrollbars: true,
// 	fadeScrollbars:true
// 	interactiveScrollbars:true
// }
