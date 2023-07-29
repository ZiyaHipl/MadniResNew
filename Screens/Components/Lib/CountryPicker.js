import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, Dimensions, FlatList, TextInput, Image, TouchableOpacity, ActivityIndicator, } from 'react-native';
import images from '../common/ImagesPath';
import ApiUrl from './ApiUrl';
import Helper from './Helper';

export default class CountryPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: '',
            data: [],
            isLoading: true,
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        Helper.makeRequest({ url: ApiUrl.GET_COUNTRIES, method: "POST" }).then((response) => {
            if (response.status == true) {
                this.setState({ data: response.data })
                this.setState({ isLoading: false });
            }
            else {
                this.setState({ isLoading: false });
                Helper.showToast(response.message);
            }
        }).catch(err => {
        })
    }

    renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                this.props.onSelect(item);
                this.setState({ searchKey: '' });
            }}
            style={styles.countryView}>
            <View style={styles.country}>
                <Text style={styles.countryText}>
                    {item.name} ({item.phonecode})
        </Text>
            </View>
        </TouchableOpacity>
    );

    filterCountries(value) {
        this.setState({ searchKey: value });
    }

    render() {
        let { show, closeModal, list } = this.props;
        let { searchKey, data, isLoading } = this.state;
        let filteredData = [];
        const lowercasedFilter = searchKey.toLowerCase();
        if (data.length > 0) {
            filteredData = data.filter((item) => {
                return Object.keys(item).some(
                    (key) =>
                        item[key] &&
                        item[key].toString().toLowerCase().startsWith(lowercasedFilter),
                );
            });
        }
        return (
            <Modal
                animationType="slide"
                visible={show}
                onRequestClose={() => {
                    this.setState({ searchKey: '' });
                    closeModal();
                }}>
                <SafeAreaView style={styles.modalparent}>
                    <View style={styles.modalCenter}>
                        <View style={styles.modalViewStyle}>
                            <View style={{ ...styles.searchView, borderWidth: 1, borderRadius: 5 }}>
                                <TextInput
                                    placeholder={'Search...'}
                                    onChangeText={(value) => this.filterCountries(value)}
                                    style={styles.searchInput}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ searchKey: '' });
                                        closeModal();
                                    }}>
                                    <Image
                                        source={images.close}
                                        style={{
                                            height: 12,
                                            width: 12,
                                            resizeMode: 'contain',
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            {isLoading ? (
                                <View style={{ marginTop: 0 }}>
                                    <ActivityIndicator size={'large'} color={'#000'} />
                                </View>
                            ) : null}
                            <FlatList
                                data={filteredData}
                                showsVerticalScrollIndicator={false}
                                renderItem={this.renderItem}
                                style={{ marginBottom: 45 }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalparent: {
        backgroundColor: '#ffffff90',
        height: Dimensions.get('window').height,
    },
    modalCenter: {
        flex: 1,
        borderRadius: 10,
        padding: 20,
    },
    modalViewStyle: {
        maxHeight: Dimensions.get('window').height,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    countryView: {
        borderColor: '#ddd',
    },
    country: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingVertical: 10,
    },
    countryText: {
        fontSize: 16,
        color: '#000',
    },
    searchView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        marginBottom: 12,
        padding: 5,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 1,
    },
    searchInput: {
        fontSize: 16,
        marginLeft: 5,
        flex: 1, height: 40
    },
});