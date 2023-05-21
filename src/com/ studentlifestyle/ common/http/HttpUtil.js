import axios, {request} from "axios";
import {getUserType, getUserID, getUserToken} from "../appUser/UserConstant";

const defaultRequestAddress = "192.168.49.128"
const defaultRequestPort = "8080"

const contextPath = "/xfc";

const requestPrefix = {
    httpPrefix: "http://" + defaultRequestAddress + ":" + defaultRequestPort,
    httpsPrefix: "https://" + defaultRequestAddress + ":" + defaultRequestPort,

    isHttp() {
        return this.httpPrefix;
    },

    isHttps() {
        return this.httpsPrefix;
    },

    get(http = true) {
        if (http) {
            return this.isHttp();
        } else {
            return this.isHttps;
        }
    }

}

// 默认请求头
export const defaultHeaders = {

    USER_TYPE: 'User-Type',
    USER_ID: 'User-Identifier',
    TOKEN: 'Authentication',


    //用户类型
    getUserType(type) {
        return {[this.USER_TYPE]: type}
    },
    //用户设备id
    getUserIdentifier(identifier) {
        return {[this.USER_ID]: identifier}
    },
    //请求token
    getAuthentication(authentication) {
        return {[this.TOKEN]: authentication}
    },
};

export const ContextType = {
    support: 'Content-Type',

    getSupportHeader(contextType) {
        return {[this.support]: contextType}

    },
}


export const SupportContextType = {
    //JSON
    APPLICATION_JSON: 'application/json;charset=utf-8',

    //from 表单
    APPLICATION_FROM: 'application/x-www-form-urlencoded',

    //atom+xml
    APPLICATION_ATOM_XML: 'application/atom+xml',

    //stream
    APPLICATION_STREAM: 'application/octet-stream',

    //文件格式表单
    MULTIPART_FROM: 'multipart/form-data',

}

function headerMap({supportContextType = null, header = {}},) {
    header = Object.assign(header, defaultHeaders.getUserType(getUserType()), defaultHeaders.getUserIdentifier(getUserID()), defaultHeaders.getAuthentication(getUserToken()))
    if (supportContextType) {
        Object.assign(header, ContextType.getSupportHeader(supportContextType))
    }
    return header;
}

export class HttpUtil {
    constructor(timeOut, http = true) {
        this.requestBaseURL = requestPrefix.get(http) + contextPath;
        this.http = http;
        this.instance = axios.create({
            baseURL: this.requestBaseURL,
            timeout: timeOut,
        });
    }

    get(url, params = {}, header = {}) {
        const requestURL = this.getRequestURI(url);
        return new Promise((resolve, catchException) => {
            const headers = headerMap({header: header});
            this.instance.get(requestURL, {
                params: params,
                headers: headers
            }).then(response => {
                resolve(response.data)
            }).catch(e => {
                catchException(e)
            });
        });
    }

    post(uri, supportContextType2, {params = {}, header = {}}) {
        const requestBody = JSON.stringify(params);
        const requestURL = this.getRequestURI(uri);
        return new Promise((resolve, catchException) => {
            const headers = headerMap({supportContextType: supportContextType2, header: header});
            console.log(headers)
            this.instance.post(requestURL, requestBody, {headers})
                .then(response => {
                    resolve(response.data)
                })
                .catch(e => {
                    catchException(e)
                })
        });
    }

    postFromData(uri, supportContextType2, formData = {}, header = {}) {
        const requestURL = this.getRequestURI(uri);
        return new Promise((resolve, catchException) => {
            const headers = headerMap({supportContextType: supportContextType2, header: header});
            this.instance.post(requestURL, formData, {headers})
                .then(response => {
                    resolve(response.data)
                })
                .catch(e => {
                    catchException(e)
                })
        });
    }


    getRequestURI(URI) {
        return this.requestBaseURL + URI;
    }
}
