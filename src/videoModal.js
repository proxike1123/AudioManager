import React, { Component } from 'react';
import {View, Text, StyleSheet, Modal, StatusBar, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Ionicons';
import VideoPlayer from 'react-native-video-controls';


export default class VideoPlay extends Component {
    constructor (props) {
        super(props);
        this.state = {
            paused: true
        }
    }
    render () {
        return (
            <Modal
                visible = {this.props.visible}
                transparent
            >
                <View style = {{
                    backgroundColor: 'black',
                    flex: 1,
                }}>
                    <StatusBar translucent backgroundColor = "black"/>
                    <TouchableWithoutFeedback
                        onPress = {() => this.setState({paused: false})}
                    >
                        <VideoPlayer
                            source={{uri: this.props.uri}}
                            onBack = {this.props.onClose}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    backgroundVideo: {
        flex: 1,
    }
})
