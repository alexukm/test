// httpService.js

import axios from 'axios';
import {userLogin} from './BizHttpUtil';

const API_URL = "http://10.37.32.54:8080";
const loginParam = {}
const httpGet = async (url, headers, params) => {
    try {
        const response = await axios.get(API_URL + url, { headers, params });
        return response.data;
    } catch (error) {
        console.error('Error submitting data:', error);
        throw error;
    }
};

const httpPost = (url, body, headers) => {
    try {
        console.log(API_URL + url)
        const response = axios.post(API_URL + url, body, { headers });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error submitting data:", error);
        throw error;
    }
};

export { httpGet, httpPost };