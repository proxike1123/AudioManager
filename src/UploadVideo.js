import React, { Component } from'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Alert, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import VideoPlay from './videoModal'
import Video from 'react-native-video';
import RNfetchBlob from 'rn-fetch-blob';
import {buildImage} from './image-helper';
import url from './url';

export default class UploadVideo extends Component {
    constructor (props) {
        super(props);
        this.state = {
            source : null,
            visible: false,
            paused: true,
        }
    }

    pickerVideo = () => {
        ImagePicker.openPicker({
            mediaType: "video",
          }).then((video) => {
              console.log(video)
            this.setState({source: video})
          });
    }

    message = () => {
        Alert.alert('Bạn chưa chọn video')
    }

    uploadVideo = () => {
        const data = buildImage(this.state.source)
        console.log(data)
        RNfetchBlob.fetch('POST', `${url}/api/upload/video`, {
            'Content-Type': 'multipart/form-data'
        },[
            {
                name: 'file', filename: data.name, type: data.type, data: RNfetchBlob.wrap(data.uri),
            }
        ]).then((res) => {
            Alert.alert("Upload thành công");
            this.setState({source: null})
        }).catch((err) => {
            Alert.alert("Upload thất bại, vui lòng thử lại");
        })
    }

    onClose = () => {
        this.setState({visible: false})
    }

    render () {
        const {navigation} = this.props;
        const empty = require('./assets/video.png')
        return (
            <View style = {styles.container}>
                <View style = {styles.header}>
                    <TouchableOpacity
                        onPress = {() => navigation.openDrawer()}
                        style = {styles.menuBtn}
                    >
                        <Icon
                            name = "menu"
                            color = 'white'
                            size = {40}
                        />
                    </TouchableOpacity>
                    <Text style = {styles.title}>Upload Video</Text>
                </View>
                <View style = {styles.body}>
                    <View style = {styles.imageContainer}>
                            {this.state.source == null ? 
                                <View style = {{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '90%'
                                }}>
                                    <Image
                                        source = {empty}
                                        style = {styles.emptyImage}
                                        resizeMode = 'contain'
                                    />
                                    <Text>Bạn chưa chọn video</Text>
                                </View> : 
                                <TouchableOpacity
                                    onPress = {() => this.setState({visible: true})}
                                    style = {{
                                        backgroundColor: 'black',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    <Image
                                        source = {require('./assets/play.png')}
                                        style = {styles.playImage}
                                        resizeMode = 'contain'
                                    />
                                </TouchableOpacity>
                            }
                    </View>
                    <View style = {styles.buttonContainer}>
                        <TouchableOpacity
                            style = {styles.picker}
                            onPress = {() => {
                                this.pickerVideo()
                            }}
                        >
                            <Text style = {styles.text}>Chọn Video</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style = {[styles.upload, 
                                this.state.source != null ? {backgroundColor: '#4A77F6'} : null
                            ]}
                            onPress = {this.state.source != null ? this.uploadVideo : this.message}
                        >
                            <Text style = {styles.text}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.source != null ?
                    <VideoPlay
                        navigator = {this.props.navigation}
                        visible = {this.state.visible}
                        uri = {this.state.source.path}
                        onClose = {this.onClose}
                    /> : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#4A77F6',
        height: 80,
        paddingTop: 30,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    menuBtn: {
        position: 'absolute',
        left: 10,
        bottom: 7
    },
    body: {
        alignItems: 'center',
        paddingTop: 60,
        width: '100%',
    },
    emptyImage: {
        width: "60%",
        height: "60%",
        borderRadius: 10,
    },
    imageContainer: {
        borderRadius: 10,
        borderColor: '#4A77F6',
        marginBottom: 30,
        width: '86%',
        height: "80%"
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    picker: {
        backgroundColor: '#4A77F6',
        padding: 4,
        borderRadius: 6,
        marginRight: 30,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 17,
    },
    upload: {
        backgroundColor: '#7D7D7D',
        padding: 4,
        borderRadius: 6,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backgroundVideo: {
        flex: 1,
    },
    playImage: {
        width: "25%",
        height: "25%",
        borderRadius: 10,
        tintColor: 'white'
    }
})