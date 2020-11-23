import React, { Component } from'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {callApi} from './callAPI';
import VideoPlay from './videoModal';
import url from './url'
import Video from 'react-native-video';
import { Thumbnail } from 'react-native-thumbnail-video';

export default class VideoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            videoVisible: false,
            selectedVideo: null,
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
        this.setState({videoVisible: false})
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
                    <TouchableOpacity
                        style = {styles.refresh}
                        onPress = {this.loadData}
                    >
                        <Icon  
                            name = 'rotate-ccw' 
                            color = "white" 
                            size = {30}
                        />
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
        height: '85%'
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
        right: 10,
        bottom: 7
    }
})