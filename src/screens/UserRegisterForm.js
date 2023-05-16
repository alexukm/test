import React, { useState } from "react";
import axios from "axios";
import {
    FormControl,
    Center,
    VStack,
    Button,
    NativeBaseProvider,
    Input,
    Text,
} from "native-base";

function RegisterForm() {
    const [nickName, setNickName] = useState("");
    const [email, setEmail] = useState("");

    const handleNickNameChange = (text) => setNickName(text);
    const handleEmailChange = (text) => setEmail(text);
    const validateEmail = (email) => {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
    };

    const submitData = async (nickName, email) => {
        try {
            const response = await axios.post("YOUR_BACKEND_API_URL", {
                nick_name: nickName,
                email: email,
            });

            // 处理响应，例如检查是否成功注册了用户
            if (response.data.success) {
                alert("Registration successful!");
            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("There was an error submitting your data. Please try again.");
        }
    };

    const handleSubmit = () => {
        if (nickName === "") {
            alert("Please enter your Nick Name");
            return;
        }
        if (email === "") {
            alert("Please enter your Email");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid Email");
            return;
        }

        // 这里处理提交表单逻辑
        console.log("Nick Name: ", nickName);
        console.log("Email: ", email);
        submitData(nickName, email);
    };

    return (
        <VStack space={4} mt={4} px={8} width="100%">
            <FormControl>
                <FormControl.Label>Nick Name</FormControl.Label>
                <Input
                    placeholder="Enter your Nick Name"
                    value={nickName}
                    onChangeText={handleNickNameChange}
                />
            </FormControl>
            <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                    placeholder="Enter your Email"
                    value={email}
                    onChangeText={handleEmailChange}
                />
            </FormControl>
            <Button mt={4} onPress={handleSubmit} width="100%">
                Register
            </Button>
        </VStack>
    );
}

export default function App() {
    return (
        <NativeBaseProvider>
            <Center flex={1} p={4}>
                <RegisterForm />
            </Center>
        </NativeBaseProvider>
    );
}
