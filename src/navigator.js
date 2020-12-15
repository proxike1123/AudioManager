import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, YellowBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import VideoScreen from './VideoScreen';
import SplashScreen from './SplashScreen';
import ImageScreen from './ImageScreen';
import UploadImage from './UploadImage';
import UploadVideo from './UploadVideo';
import Icon1 from 'react-native-vector-icons/Entypo'
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const SplashStack = createStackNavigator();
const HomeStack = createDrawerNavigator();

console.disableYellowBox = true;

const Splash = () => (
    <SplashStack.Navigator>
        <SplashStack.Screen 
            name = "Spash" 
            component = {SplashScreen}
            options={({ navigation, route }) => ({
                headerShown: false,
             })}
        />
    </SplashStack.Navigator>
)

const header = (props) => {
    return (
        <View style = {styles.container}>
            <View style = {styles.header}>
                <View style = {styles.logoContainer}>
                    <Image 
                        source = {require('./assets/bk.png')}
                        style = {styles.logo}
                    />
                </View>
                <Text style = {[styles.text, {fontWeight: 'bold'}]}>Nguyễn Đăng Bin</Text>
                <Text style = {[styles.text, {}]}>17T2</Text>
            </View>
            <View style = {styles.body}>
                <TouchableOpacity
                    style = {[styles.navigation,
                        props.state.index == 0 ? {backgroundColor: '#DDEDFF',} : null
                    ]}
                    onPress = {() => props.navigation.jumpTo('Ảnh')}
                >
                    <Icon2
                        name = 'picture-o'
                        color = {props.state.index == 0 ? '#4A77F6' : "#7D7D7D"}
                        size = {27}
                    />
                    <Text style = {[styles.navigationText,
                        props.state.index == 0 ? {color: '#4A77F6',} : null
                    ]}>Xem Ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {[styles.navigation,
                        props.state.index == 1 ? {backgroundColor: '#DDEDFF',} : null
                    ]}
                    onPress = {() => props.navigation.jumpTo('Video')}
                >
                    <Icon1
                        name = 'folder-video'
                        color = {props.state.index == 1 ? '#4A77F6' : "#7D7D7D"}
                        size = {27}
                    />
                    <Text style = {[styles.navigationText, 
                        props.state.index == 1 ? {color: '#4A77F6',} : null
                    ]}>Xem Video</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}



const Home = () => (
    <HomeStack.Navigator
        drawerContent = {props => header(props)}
        drawerStyle = {{
            width: 280,
        }}
        initialRouteName = 'Ảnh'
    >
        <HomeStack.Screen name = "Ảnh" component = {ImageScreen}/>
        <HomeStack.Screen name = "Video" component = {VideoScreen}/>
        <HomeStack.Screen name = "Upload Ảnh" component = {UploadImage}/>
        <HomeStack.Screen name = "Upload Video" component = {UploadVideo}/>
    </HomeStack.Navigator>
)

const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
            name="Splash" 
            component={Splash} 
            options={({ navigation, route }) => ({
               headerShown: false,
            })}
        />
        <Stack.Screen 
            name="Home" 
            component={Home} 
            options={({ navigation, route }) => ({
                headerShown: false,
             })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 300,
        backgroundColor: '#4A77F6',
        justifyContent: 'center',
        alignItems: 'center',

    },
    logo: {
        height: 100,
        width: 100,
        borderRadius: 6,
    },
    logoContainer: {
        backgroundColor: 'white',
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        color: 'white'
    },
    body: {

    },
    navigation: {
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingVertical: 5,
        borderRadius: 6,
    },
    navigationText: {
        color: '#7D7D7D',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
    }
})


export default App;