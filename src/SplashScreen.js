import React, { Component } from'react';
import {
    View, 
    Text, 
    StyleSheet, 
    ImageBackground, 
    StatusBar, 
    Image, 
    Dimensions,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class SplashScreen extends Component {
    constructor (props) {
        super (props);
        this.state = {
            imageX: new Animated.Value(300),
            textX: new Animated.Value(-300)
        }
    }

    loadName = () => {
        Animated.parallel([
            Animated.timing(this.state.imageX, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.textX, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start()
    }

    componentDidMount() {
        this.loadName()
        this.navigateToHome()
    }

    navigateToHome = () => {
        setTimeout(() => {
            this.props.navigation.navigate('Home')
        }, 2500);
    }

    render () {
        const {imageX, textX} = this.state;
        return (
            <View style = {styles.container}>
                <StatusBar translucent backgroundColor = 'transparent'/>
                <TouchableWithoutFeedback
                    onPress = {this.navigateToHome}
                >
                    <ImageBackground
                        source = {require('./assets/BG.jpg')}
                        style = {styles.bg}
                        resizeMode ='contain'
                    ></ImageBackground>
                </TouchableWithoutFeedback>
                <View  
                    style = {styles.nameContainer}
                >
                    <Animated.Image
                        source = {require('./assets/bk.png')}
                        style = {[styles.logo, {
                            transform: [{
                                translateX: imageX
                            }]
                        }]}
                    />
                    <Animated.View style = {{
                        marginTop: 20, 
                        alignItems: 'center',
                        transform: [{
                            translateX: textX
                        }]
                    }}>
                        <Text style = {styles.text}>Create by</Text>
                        <Text style = {styles.text}>Nguyễn Đăng Bin</Text>
                        <Text style = {styles.text}>17T2</Text>
                    </Animated.View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4A77F6',
        justifyContent: 'flex-end',
    },
    bg: {
        flex: 1,
        backgroundColor: '#4A77F6',
        marginBottom: 130, 
    },
    nameContainer: {
        position: 'absolute',
        bottom: 50,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 50,
        width: 50,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
    }
})