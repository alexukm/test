import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import {
    Box,
    Button,
    Center,
    FormControl,
    HStack,
    Input,
    NativeBaseProvider,
    Select,
    VStack,
    Text,
} from 'native-base';
import { MD5 } from 'crypto-js';
import { smsSend, userRegistry } from "../com/ studentlifestyle/ common/http/BizHttpUtil";
import { setUserToken } from "../com/ studentlifestyle/ common/appUser/UserConstant";

const RegisterScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedValue, setSelectedValue] = useState('60');
    const [verificationCode, setVerificationCode] = useState('');
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isResendOtpActive, setIsResendOtpActive] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    //验证码获取之前灰度
    const [isCodeRequested, setIsCodeRequested] = useState(false);

    const countryData = [
        { code: 'MY', label: '60' },
        { code: 'CHN', label: '86' },
    ];

    // 创建一个ref
    const firstNameInputRef = useRef(null);

    // 使用useEffect，在组件挂载完成后聚焦在firstName输入框
    useEffect(() => {
        if (firstNameInputRef.current) {
            firstNameInputRef.current.focus();
        }
    }, []);

    useEffect(()=>{
        listenVerificationCode()
    }, [verificationCode]);

    const submitData = () => {
        // 检查所有输入框都已填写
        if (!firstName || !lastName || !email || !phoneNumber) {
            alert('Please fill in all the fields.');
            return;
        }

        // 验证电子邮件格式
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // 根据选择的国家代码，验证电话号码
        let phonePattern;
        if (selectedValue === '60') {
            phonePattern = /^\d{9}$/;
        } else if (selectedValue === '86') {
            phonePattern = /^\d{11}$/;
        }

        if (!phonePattern.test(phoneNumber)) {
            alert('Please enter a valid phone number.');
            return;
        }

        // 调用后端函数发送验证码
        const userPhone = selectedValue + phoneNumber;

        smsSend(userPhone)
            .then(data => {
                if (data.code === 200) {
                    setIsTimerActive(true);
                    setIsResendOtpActive(false);
                    //当验证码发送成功后，把 isCodeRequested 设为 true
                    setIsCodeRequested(true);
                    let counter = 30;
                    setSecondsRemaining(counter);
                    const timer = setInterval(() => {
                        counter--;
                        setSecondsRemaining(counter);
                        if (counter === 0) {
                            clearInterval(timer);
                            setIsTimerActive(false);
                            setIsResendOtpActive(true);
                        }
                    }, 1000);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.log(error);
                alert('There was an error submitting your data. Please try again.');
            });
    };

    const handleResendOtp = () => {
        // 再次发送验证码
        const userPhone = selectedValue + phoneNumber;
        smsSend(userPhone)
            .then(data => {
                if (data.code === 200) {
                    setIsTimerActive(true);
                    setIsResendOtpActive(false);
                    let counter = 30;
                    setSecondsRemaining(counter);
                    const timer = setInterval(() => {
                        counter--;
                        setSecondsRemaining(counter);
                        if (counter === 0) {
                            clearInterval(timer);
                            setIsTimerActive(false);
                            setIsResendOtpActive(true);
                        }
                    }, 1000);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.log(error);
                alert('There was an error submitting your data. Please try again.');
            });
    };

    const listenVerificationCode = ()=> {
        if (verificationCode.length === 4) { // 当验证码长度为4时，提交验证
            doUserRegistry();
        }
    }
    const doUserRegistry = () => {
        const userPhone = selectedValue + phoneNumber;

        const md5VerificationCode = MD5(verificationCode).toString();

        const registryParams = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            userPhone: userPhone,
            deviceId: '123',
            platform: 0,
            // code: verificationCode,
            code: md5VerificationCode, // 使用加密后的验证码

        };
        userRegistry(registryParams)
            .then(data => {
                if (data.code === 200) {
                    console.log('注册成功', data);
                    setUserToken(data.data);
                    navigation.navigate("Example");
                    // 注册成功后的操作，如跳转到其他页面
                } else {
                    console.log('注册失败', data.message);
                }
            })
            .catch(error => {
                console.log('注册失败', error);
            });

        setVerificationCode('');
    };

    const renderButton = () => {
        if (isTimerActive) {
            return (
                <Button variant="outline" colorScheme="secondary" size="sm" mt="2" isDisabled={true}>
                    <Text>{secondsRemaining} s</Text>
                </Button>
            );
        } else if (isResendOtpActive) {
            return (
                <Button
                    variant="outline"
                    colorScheme="secondary"
                    size="sm"
                    mt="2"
                    onPress={handleResendOtp}
                >
                    Resend
                </Button>
            );
        } else {
            return (
                <Button mt="4" onPress={submitData}>
                    Get OTP
                </Button>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Center flex={1}>
                    <Box flex={1} p={4} width="100%">
                        <VStack space={4} width="100%">
                            <HStack space={4} width="100%">
                                <FormControl flex={1}>
                                    <FormControl.Label>First Name</FormControl.Label>
                                    <Input
                                        size="lg"
                                        ref={firstNameInputRef}
                                        placeholder="Enter first name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </FormControl>
                                <FormControl flex={1}>
                                    <FormControl.Label>Last Name</FormControl.Label>
                                    <Input
                                        size="lg"
                                        placeholder="Enter last name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </FormControl>
                            </HStack>
                            <FormControl width="100%">
                                <FormControl.Label>Email</FormControl.Label>
                                <Input
                                    size="lg"
                                    placeholder="Enter email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </FormControl>
                            <FormControl width="100%">
                                <FormControl.Label>Phone Number</FormControl.Label>
                                <HStack space={2} width="100%">
                                    <Select
                                        size="lg"
                                        selectedValue={selectedValue}
                                        minWidth={120}
                                        accessibilityLabel="Choose Country Code"
                                        onValueChange={itemValue => {
                                            setSelectedValue(itemValue);
                                        }}
                                        flex={1}
                                    >
                                        {countryData.map(item => (
                                            <Select.Item
                                                key={item.code}
                                                label={`${item.code} +${item.label}`}
                                                value={item.label}
                                            />
                                        ))}
                                    </Select>

                                    <Input
                                        placeholder={selectedValue === '60' ? 'Enter 9 digit number' : 'Enter 11 digit number'}
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="numeric"
                                        flex={1}
                                        size="lg"
                                    />
                                </HStack>
                            </FormControl>
                            <FormControl width="100%">
                                <FormControl.Label>Verification Code</FormControl.Label>
                                <Input
                                    size="lg"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChangeText={setVerificationCode}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    isDisabled={!isCodeRequested} // 当 isCodeRequested 为 false 时，输入框被禁用
                                />
                            </FormControl>

                            {renderButton()}
                        </VStack>
                    </Box>
                </Center>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default function UserSignUp() {
    return (
        <NativeBaseProvider>
            <RegisterScreen />
        </NativeBaseProvider>
    );
}
