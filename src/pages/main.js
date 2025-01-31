/* eslint-disable prettier/prettier */
import React, { Component } from 'react';

import api from '../services/api';

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default class Main extends Component {
    static navigationOptions = {
        title: "JSHunt"
    };

    state = {
        productionInfo: {},
        docs: [],
        page: 1,
    }

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = async (page = 1) => {
        try {
            const response = await api.get(`/products?page=${page}`);
            const { docs, ...productionInfo } = response.data;
            this.setState({
                docs: [...this.state.docs, ...docs],
                productionInfo,
                page,
            });
        } catch (err) {
            console.log(err);
            // throw new Error(`Err: ${err}`)
        }
    }

    renderItem = ({ item }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productTitlte}>{item.title}</Text>
            <Text style={styles.productionDescription}>{item.description}</Text>
            <TouchableOpacity
                style={styles.productButton}
                onPress={() => {
                    this.props.navigation.navigate('Product', { product: item });
                }} >
                <Text style={styles.productButtonText}> Acessar </Text>
            </TouchableOpacity>
        </View>
    )

    loadMore = () => {
        const { page, productionInfo } = this.state;
        if (page === productionInfo.pages) return;
        this.loadProducts(page + 1);
    }


    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.list}
                    data={this.state.docs}
                    keyExtractor={item => item._id}
                    renderItem={this.renderItem}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.1}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    list: {
        padding: 20,
    },
    productContainer: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 5,
        padding: 20,
        marginBottom: 20,
    },
    productTitlte: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    productionDescription: {
        fontSize: 16,
        color: '#999',
        marginTop: 5,
        lineHeight: 24,
    },

    productButton: {
        height: 42,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#DA552F',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },

    productButtonText: {
        fontSize: 16,
        color: '#DA552F',
        fontWeight: 'bold'
    }
})
