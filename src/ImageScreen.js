import React, { Component } from'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {callApi} from './callAPI';
import PictureViewer from './ImageViewer';
import URL from './url'
import ImagePicker from 'react-native-image-crop-picker';
import ModalPicker from './ModalPicker';
import RNfetchBlob from 'rn-fetch-blob';
import {buildImage} from './image-helper';

const url = URL + '/';

export default class ImageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            imageVisible: false,
            selectedPicture: null,
            delete: 0,
            source : null,
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
            api: '/api/images',
            method: 'GET',
            param: [],
        }
        const result = await callApi(params);
        this.setState({data: result.data})
    }

    pickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
            }).then(image => {
            const data = buildImage(image);
            this.uploadImage(data);
        });
      
    }

    pickFromCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            const data = buildImage(image);
            this.uploadImage(data);
        });
    }

    uploadImage = async (data) => {
        console.log(data)
        // const params = {
        //     api: '/api/upload/picture',
        //     method: 'POST',
        //     param: this.state.source,
        // }
        // const result = await callApi(params);
        // console.log(result)
        RNfetchBlob.fetch('POST', `${URL}/api/upload/picture`, {
            'Content-Type': 'multipart/form-data'
        },[
            {
                name: 'file', filename: data.name, type: data.type, data: RNfetchBlob.wrap(data.uri),
            }
        ]).then((res) => {
            Alert.alert("Upload thành công");
            this.loadData();
        }).catch((err) => {
            Alert.alert("Upload thất bại, vui lòng thử lại");
        })
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
        this.setState({imageVisible: false, visible: false})
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
                        onPress = {
                            () => this.setState({visible: true})
                        }
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
                    <TouchableOpacity
                        style = {[styles.delete2, this.state.delete == 0 ? {
                            backgroundColor: 'gray',
                        } : null]}
                        onPress = {this.openDelete}
                    >
                        <Icon
                            name = "trash-2"
                            color = "white"
                            size = {25}
                        />
                        <Text style = {{
                            color: 'white',
                            fontSize: 16,
                            marginLeft: 5,
                        }}>Xóa</Text>
                    </TouchableOpacity>
                </View>
                <View style = {styles.body}>
                    <FlatList
                        showsVerticalScrollIndicator = {false}
                        numColumns = {3}
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
                <ModalPicker
                    visible = {this.state.visible}
                    onClose = {this.closeModal}
                    pickImage = {this.pickImage}
                    pickFromCamera = {this.pickFromCamera}
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
        paddingTop: '5%',
    },
    list: {
        height: '75%',
        width: "100%",
    },
    image: {
        height: 100,
        width: 100,
    },
    fullImage: {
        margin: 10,
        
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
        marginRight: 10,
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