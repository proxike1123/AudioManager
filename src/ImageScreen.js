import React, { Component } from'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {callApi} from './callAPI';
import PictureViewer from './ImageViewer';
import URL from './url'

const url = URL + '/';

export default class ImageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            imageVisible: false,
            selectedPicture: null,
            delete: 0,
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
            api: '/api/images',
            method: 'GET',
            param: [],
        }
        const result = await callApi(params);
        this.setState({data: result.data})
    }

    renderItem = (item, index) => {
        return (
            <TouchableOpacity
                style = {styles.fullImage}
                onPress = { async() => {
                    await this.setState({selectedPicture: url + item.filepath})
                    this.setState({imageVisible: true})
                }}
            >
                <Image
                    source  = {{uri: url + item.filepath}}
                    style = {styles.image}
                    resizeMode = 'cover'
                />
                {
                    this.state.delete == 1 ? 
                    <TouchableOpacity
                        style = {{
                            backgroundColor: 'red',
                            borderRadius: 5,
                            position: 'absolute',
                            top: 5, 
                            right: 5,
                        }}
                        onPress = {() => this.deleteImage(item.filepath)}
                    >
                        <Icon 
                            name = 'trash-2' 
                            color = "white" 
                            size = {30}
                        />
                    </TouchableOpacity>: null
                }
            </TouchableOpacity>
        )
    }

    deleteImage = async (filepath) => {
        const params = {
            api: '/api/images/delete',
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

    closeModal = () => {
        this.setState({imageVisible: false})
    }

    openDelete = () => {
        this.setState({delete: (this.state.delete + 1) % 2})
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
                    <Text style = {styles.title}>Ảnh</Text>
                    <TouchableOpacity
                        style = {[styles.delete,
                            this.state.delete == 1 ? 
                            {
                                backgroundColor: 'red',
                                borderRadius: 5,
                            } : null
                        ]}
                        onPress = {this.openDelete}
                    >
                        <Icon 
                            name = 'trash-2' 
                            color = "white" 
                            size = {30}
                        />
                    </TouchableOpacity>
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
                        numColumns = {2}
                        style = {styles.list}
                        data = {this.state.data}
                        keyExtractor = {item => item.filepath}
                        renderItem = {({item, index}) => this.renderItem(item, index)}
                    />
                </View>
                <PictureViewer
                    visible = {this.state.imageVisible}
                    url = {this.state.selectedPicture}
                    onClose = {this.closeModal}
                />
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
        paddingTop: '5%'
    },
    list: {
        height: '85%'
    },
    image: {
        height: 170,
        width: 170,
    },
    fullImage: {
        margin: 10,
        
    },
    delete: {
        position: 'absolute',
        right: 10,
        bottom: 7
    },
    refresh: {
        position: 'absolute',
        right: 60,
        bottom: 7
    }
})