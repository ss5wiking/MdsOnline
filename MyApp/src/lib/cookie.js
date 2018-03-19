export const setCookie = (name, value, day)=>{
	var day1 = day || 7;
	var oDate = new Date();
	oDate.setTime(oDate.getTime() + day1 * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + value + ";expires=" + oDate.toGMTString();
}

export const getCookie = (c_name)=>{
	if (document.cookie.length > 0){
		var c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1){
			c_start = c_start + c_name.length + 1
			var c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1){
				c_end = document.cookie.length;
			}
			return document.cookie.substring(c_start, c_end);
		}
	}
	return "";
}

export const deleteCookie = (name)=>{
	var date = new Date();
	date.setTime(date.getTime() - 10000); //设定一个过去的时间即可
	document.cookie = name + "=v; expires=" + date.toGMTString();
}
