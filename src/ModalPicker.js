import React, { Component } from 'react';
import {
    Modal, 
    Text, 
    View, 
    StyleSheet, 
    StatusBar, 
    TouchableOpacity
} from 'react-native';

export default class ModalPicker extends Component {
    picker = () => {
        this.props.onClose();
        this.props.pickImage();
    }
    camera = () => {
        this.props.onClose();
        this.props.pickFromCamera();
    }
    render () {
        return (
            <Modal
                visible = {this.props.visible}
                transparent
                animationType ='slide'
            >
                <View style ={styles.container}>
                    <StatusBar translucent backgroundColor = "rgba(0, 0, 0, 0.5)"/>
                    <View style = {styles.modal}>
                        <View style = {styles.header}>
                            <Text style = {styles.title}>Chọn phương thức</Text>
                        </View>
                        <View style = {styles.body}>
                            <TouchableOpacity
                                style = {styles.method}
                                onPress = {this.picker}
                            >
                                <Text style = {styles.text}>Chọn ảnh từ thư viện</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {this.camera}
                                style = {styles.method}
                            >
                                <Text style = {styles.text}>Chụp ảnh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {this.props.onClose}
                                style = {[styles.method, {backgroundColor: "#FF6060"}]}
                            >
                                <Text style = {styles.text}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: 'flex-end'
    },
    modal: {
        height: '45%',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    header: {
        height: 60,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomWidth: 1.5,
        borderColor: '#EFF1F5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        alignItems: 'center',
        paddingTop: 30,
    },
    method: {
        height: 50,
        width: "80%",
        backgroundColor: "#4A77F6",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        color: 'white',
        fontSize: 16,
    }
})