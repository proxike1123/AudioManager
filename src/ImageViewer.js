import { Modal, StatusBar, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';


export default class PictureViewer extends React.Component {
    render () {
        const images = [{
            url: this.props.url,
            props: {
                // Or you can set source directory.
                //source: require('../background.png')
            }
        }]
        return (
            <Modal visible={this.props.visible} transparent={true}>
                <StatusBar translucent backgroundColor = 'black'/>
                <ImageViewer 
                    imageUrls={images}
                />
                <TouchableOpacity
                    onPress = {this.props.onClose}
                    style = {{
                        position: 'absolute',
                        left: "5%",
                        top: "5%"
                    }}
                >
                <Icon
                    name = 'arrow-back'
                    size = {30}
                    color = 'white'
                />
                </TouchableOpacity>
            </Modal>
        )
    }
}