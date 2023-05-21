import {smsSend, userRegistry, userLogin} from './src/screens/BizHttpUtil'

const userDeviceId = 'ASAF414561CAD1'
const userPhone = '17612533365'
const userCode = '81dc9bdb52d04dc20036dbd8313ed055';
// 用户注册
const doUserRegistry = (firstName, lastName, email, userPhone, code) => {
    firstName = '测试名';
    lastName = '测试姓';
    email = '123456@qq.com';
    userPhone = '17612533365';
    code = userCode;

    const registryParams = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "userPhone": userPhone,
        "deviceId": userDeviceId,
        "platform": 0,
        "code": code,
    }
    console.log("用户注册")
    userRegistry(registryParams)
        .then(data => {
            if (data.code === 200) {
                console.log("注册成功" + data)
            }else {
                console.log("注册失败" + data.message);
            }
        }).catch(error => {
        console.log("注册失败" + error);
    });
}

// 验证码发送
const smsSendByPhone = (userPhone) => {
    const sendParams = {
        phoneNumber: userPhone
    }
    console.log(userPhone+" 发送验证码")
    smsSend(sendParams).then(data => {
        console.log(data)
        if (data.code === 200) {
            console.log("验证码发送成功：" + data);
        }else {
            console.log("验证码发送失败" + data.message);
        }

    }).catch(error => {
        console.log("验证码发送失败" + error);
    })
}

//用户登录
const userLoginWithSmsCode = (userPhone, code) => {
    const loginParams = {
        "userPhone": userPhone,
        "code": code,
        "deviceId": userDeviceId,
        "platform": 0
    }
    userLogin(loginParams).then(data => {
        if (data.code === 200) {
            console.log("登录成功：" + data.data)
        }else {
            console.log("登录失败" + data.message);
        }
    }).catch(error => {
        console.log(error);
        alert("登录失败");
    });
}


//登录  预期失败
// userLoginWithSmsCode(userPhone, userCode);

//发送验证码
smsSendByPhone(userPhone);

//注册  预期成功
// doUserRegistry();

// 用户登录 成功
userLoginWithSmsCode(userPhone, userCode);