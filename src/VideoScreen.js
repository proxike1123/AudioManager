import React, { Component } from'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {callApi} from './callAPI';
import VideoPlay from './videoModal';
import url from './url'
import Video from 'react-native-video';
import { Thumbnail } from 'react-native-thumbnail-video';
import Icon2 from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import RNfetchBlob from 'rn-fetch-blob';
import {buildImage} from './image-helper';

export default class VideoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            videoVisible: false,
            selectedVideo: null,
            visible: false,
        }
    }
    componentDidMount () {
        const {navigation} = this.props
        this.loadData();
        this._unsubscribe = navigation.addListener('focus', () => {
            // do something
            this.loadData()
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    loadData = async () => {
        const params = {
            api: '/api/videos',
            method: 'GET',
            param: [],
        }
        const result = await callApi(params);
        this.setState({data: result.data})
    }

    renderItem = (item, index) => {
        console.log('data', this.state.data)
        console.log(url + item.filepath)
        return (
            <TouchableOpacity
                style = {styles.fullImage}
                onPress = { async() => {
                    await this.setState({selectedVideo: url + '/' + item.filepath})
                    this.setState({videoVisible: true})
                }}
            >
                <View style = {styles.row}>
                    <Image
                        source  = {require('./assets/film.png')}
                        style = {styles.image}
                        resizeMode = 'contain'
                    />
                    <Text style = {{
                        width: 280,
                    }}>{item.filepath}</Text>
                     <TouchableOpacity
                        style = {{
                            backgroundColor: 'red',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 5,
                            marginLeft: 10
                        }}
                        onPress = {() => this.deleteVideo(item.filepath)}
                    >
                        <Icon 
                            name = 'trash-2' 
                            color = "white" 
                            size = {30}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    pickerVideo = () => {
        ImagePicker.openPicker({
            mediaType: "video",
          }).then((video) => {
            console.log(video)
            this.uploadVideo(video)
          });
    }

    deleteVideo = async (filepath) => {
        const params = {
            api: '/api/video/delete',
            method: 'POST',
            param: {
                filepath: filepath
            },
        }
        const result = await callApi(params);
        if (result.success) {
            this.loadData()
        }
    }

    onClose = () => {
        this.setState({videoVisible: false,  visible: false})
    }

    uploadVideo = (source) => {
        const data = buildImage(source)
        console.log(data)
        RNfetchBlob.fetch('POST', `${url}/api/upload/video`, {
            'Content-Type': 'multipart/form-data'
        },[
            {
                name: 'file', filename: data.name, type: data.type, data: RNfetchBlob.wrap(data.uri),
            }
        ]).then((res) => {
            Alert.alert("Upload thành công");
            this.loadData()
        }).catch((err) => {
            Alert.alert("Upload thất bại, vui lòng thử lại");
        })
    }

    render () {
        const {navigation} = this.props;
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
                    <Text style = {styles.title}>Video</Text>
                </View>
                <View style = {styles.toolBar}>
                    <TouchableOpacity
                        style = {styles.refresh}
                        onPress = {this.loadData}
                    >
                        <Icon  
                            name = 'rotate-ccw' 
                            color = "#4A77F6" 
                            size = {30}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.add}
                        onPress = {this.pickerVideo}
                    >
                        <Icon2
                            name = "add"
                            color = "white"
                            size = {25}
                        />
                        <Text style = {{
                            color: 'white',
                            fontSize: 16,
                            marginLeft: 5,
                        }}>Thêm</Text>
                    </TouchableOpacity>
                </View>
                <View style = {styles.body}>
                    <FlatList
                        showsVerticalScrollIndicator = {false}
                        style = {styles.list}
                        data = {this.state.data}
                        keyExtractor = {item => item.filepath}
                        renderItem = {({item, index}) => this.renderItem(item, index)}
                    />
                </View>
                <VideoPlay
                    navigator = {this.props.navigation}
                    visible = {this.state.videoVisible}
                    uri = {this.state.selectedVideo}
                    onClose = {this.onClose}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        paddingTop: '5%'
    },
    list: {
        height: '75%'
    },
    image: {
        height: 40,
        width: 40,
        marginRight: 15,
    },
    fullImage: {
        margin: 10,
        borderBottomWidth: 1,
        borderColor: '#EFF1F5',
    },
    row: {
        flexDirection: 'row',
    },
    refresh: {
        position: 'absolute',
        left: 10,
        bottom: 7
    },
    toolBar: {
        height: 50,
        width: '94%',
        marginHorizontal: '3%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    add: {
        backgroundColor: '#28A745',
        height: 35,
        width: 90,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    delete2: {
        backgroundColor: '#DC3545',
        height: 35,
        width: 80,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }
})