let crypto = require("crypto");

let EncryptDecrypt = (() => {
	let params = {
		alg: "aes256",
		key: "",
		iv: "",
	};
	function setParams(_alg, _key, _iv) {
		params.alg = "AES256";
		params.key = process.env.KEY;
		params.iv = process.env.IV;
	}
	function encryptText(bodyJson, encoding) {
		setParams();
		
		const cipher = crypto.createCipheriv(params.alg, params.key, params.iv);
		encoding = encoding || "base64";
		let result = cipher.update(JSON.stringify(bodyJson), "utf8", encoding);
		result += cipher.final(encoding);
		return result;
		
		/**Encripto si es necesario*/
		/*
			const iv = crypto.randomBytes(8).toString("hex");
			const cipher = crypto.createCipheriv(params.alg, params.key, iv);
			encoding = encoding || "base64";
			let result = cipher.update(JSON.stringify(jsonResponse), "utf8", encoding);
			result += cipher.final(encoding);
			 const res =`${iv.toString("hex")}${result}`;
			 return res;*/

		
	}
	function decryptText(bodyJson, encoding) {
		setParams();
		/**Desencripto si es necesario*//*
		if (bodyJson && bodyJson.bodyData.toString().length > 15) {
			const decipher = crypto.createDecipheriv(params.alg, params.key, bodyJson.bodyData.toString().substring(0, 16));
			encoding = encoding || "base64";
			let result = decipher.update(bodyJson.bodyData.toString().substring(16, bodyJson.bodyData.length), encoding);
			result += decipher.final();
			return JSON.parse(result);
		} else {
			return bodyJson;
		}
		*/
		const decipher = crypto.createDecipheriv(params.alg, params.key, params.iv);
		encoding = encoding || "base64";
		let result = decipher.update(bodyJson.bodyData, encoding);
		result += decipher.final();
		return JSON.parse(result);
	}
	function decryptToken( bodyJson, encoding) {
		setParams();
		/**Desencripto si es necesario*//*
		if (bodyJson && bodyJson.toString().length > 15) {
			const decipher = crypto.createDecipheriv(params.alg, params.key, params.iv);
			encoding = encoding || "base64";
			let result = decipher.update(bodyJson, encoding);
			result += decipher.final();
			
			return JSON.parse(result);
			
		} else {
			return bodyJson;
		}*/
		
	}

	return {
		encryptText: encryptText,
		decryptText: decryptText,
		setParams: setParams,
		decryptToken: decryptToken,
	};
})();

module.exports = EncryptDecrypt;
