import {getCookie} from "@/lib/cookie";
export default async(url = '', params = {}, type = 'GET')=>{
	type = type.toUpperCase();
	let option = {}
	let token = getCookie('mds_token');
	//GET url
	if(type !== 'POST'){
		let str = '';
		Object.keys(params).map((key)=>{
			str += key + '=' + params[key] + '&';
		})
    if (str !== ''){
		  url = url + '?' + str.slice(0, -1)
    }
		option = {
			headers: {
				'Authorization': 'Bearer ' + token
			},
		}

	}
	//POST option
	if(type == 'POST'){
		option = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(params)
		}
	}else if(type == 'FORM'){
		option = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				'Cache-Control': 'no-cache',
				'Authorization': 'Bearer ' + token
			},
			body: params
		}
	}else if(type == 'FORMDATA'){
		option = {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + token
			},
			body: params
		}
	}
	//请求
	try {
			const response = await fetch(url,option);
		const responseJson = await response.json();
		return responseJson
	} catch (error) {
		throw new Error(error)
	}
}
