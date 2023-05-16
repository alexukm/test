//先获取位置权限，屏幕上方有一个固定的input输入位置，用户可以自己手动输入位置，
//然后调用谷歌maps来查看位置并确定位置，也可以直接使用当前位置（把获取的位置信息直接选择到输入框）起点位置输入完毕，
//此时另外一个输入框显示出来，这里可以输入终点地址。起点和终点位置输入之后地图会有一个动画：有一条路线规划从起点移动到终点

// 我现在需要一个以react base为框架的页面，主要需求是：
// 1.  画面分成三个部分，第一部分在顶部占据屏幕的60长度，设置一个背景颜色填充，不能完全在顶部，要留出5%的位置给顶部，不能完全贴着顶部。
// 2. 中间设置两段话，占屏幕的20%长度，还要分为上下行：
//     a. 上行字体加重，写上Weclome to my App
//     b. 下行写上， This is the very good app that you can sharing your ride with other person, and for driver thay can earn a lot money
// 3. 底部屏幕的20%长度，同时设置两个按钮，并借用 react base框架中的：<Button size="sm">PRIMARY</Button>来设计，左边一个右边一个，颜色要有差别。左边的按钮上写 User，右边的按钮写Driver；同时上个按钮要在一行中间相距部分距离，左右两边也要相聚部分距离，同时要距离底部大改15%的距离。

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { VStack, Box, NativeBaseProvider } from "native-base";

// import User from "./src/screens/LoginUser";
// import Driver from "./src/screens/LoginDriver";
// import Home from "./src/screens/Home";
// import UserSignUp from "./src/screens/UserRegisterForm";
// import DriverSignUp from "./src/screens/DriverRegisterForm";

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NativeBaseProvider>
//       <Box flex={1} px={0} py={0}>
//         <NavigationContainer>
//           <Stack.Navigator
//             initialRouteName="Example"
//             screenOptions={{
//               headerStyle: { backgroundColor: '#FFF' },
//               cardStyle: { backgroundColor: 'transparent' }
//             }}
//           >
//             <Stack.Screen name="Home" component={Home} />
//             <Stack.Screen name="User" component={User} />
//             <Stack.Screen name="Driver" component={Driver} />
//             <Stack.Screen name="UserSignUp" component={UserSignUp} />
//             <Stack.Screen name="DriverSignUp" component={DriverSignUp} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </Box>
//     </NativeBaseProvider>
//   );
// }