import React, { Component } from'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Alert, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import {buildImage} from './image-helper';
import ModalPicker from './ModalPicker';
import PictureViewer from './ImageViewer';
import {callApi, uploadImage} from './callAPI'
import createFormImage from './imageForm';
import RNfetchBlob from 'rn-fetch-blob';
import url from './url'

export default class UploadImage extends Component {

    constructor (props) {
        super(props);
        this.state = {
            source : null,
            visible: false,
            imageVisible: false,
        }
    }

    componentDidMount = async () => {
        const params = {
            api: '/api',
            method: 'GET',
            param: [],
        }
        const result = await callApi(params);
        console.log(result)

    }

    closeModal = () => {
        this.setState({visible: false, imageVisible: false})
    }

    pickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
            }).then(image => {
            const data = buildImage(image);
            this.setState({source: data})
        });
    }

    pickFromCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            const data = buildImage(image);
            this.setState({source: data})
          });
    }

    uploadImage = async () => {
        const data = this.state.source
        console.log(data)
        // const params = {
        //     api: '/api/upload/picture',
        //     method: 'POST',
        //     param: this.state.source,
        // }
        // const result = await callApi(params);
        // console.log(result)
        RNfetchBlob.fetch('POST', `${url}/api/upload/picture`, {
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

    message = () => {
        Alert.alert('Bạn chưa chọn ảnh')
    }

    render () {
        const empty = require('./assets/EI.png')
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
                    <Text style = {styles.title}>Upload Ảnh</Text>
                </View>
                <View style = {styles.body}>
                    <View style = {styles.imageContainer}>
                        <TouchableWithoutFeedback
                            onPress = {() => {
                                if (this.state.source != null) {
                                    this.setState({imageVisible: true})
                                }
                            }}
                        >
                            {this.state.source == null ? 
                                <Image
                                    source = {empty}
                                    style = {styles.emptyImage}
                                /> : 
                                <Image
                                    source = {{uri: this.state.source.uri}}
                                    style = {styles.emptyImage}
                                />
                            }
                        </TouchableWithoutFeedback>
                    </View>
                    <View style = {styles.buttonContainer}>
                        <TouchableOpacity
                            style = {styles.picker}
                            onPress = {() => {
                                this.setState({visible: true})
                            }}
                        >
                            <Text style = {styles.text}>Chọn ảnh</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style = {[styles.upload, 
                                this.state.source != null ? {backgroundColor: '#4A77F6'} : null
                            ]}
                            onPress = {this.state.source != null ? this.uploadImage : this.message}
                        >
                            <Text style = {styles.text}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ModalPicker
                    visible = {this.state.visible}
                    onClose = {this.closeModal}
                    pickImage = {this.pickImage}
                    pickFromCamera = {this.pickFromCamera}
                />
                {this.state.source != null ? 
                    <PictureViewer
                        visible = {this.state.imageVisible}
                        url = {this.state.source.uri}
                        onClose = {this.closeModal}
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
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    imageContainer: {
        borderWidth: 1,
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
        width: 90,
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
        width: 90,
        alignItems: 'center',
        justifyContent: 'center'
    }
})