import React, { PureComponent } from 'react';
import { ActivityIndicator, View } from 'react-native';
import FastImage from 'react-native-fast-image'

export default class LoadImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    render() {
        return (
            <View>
                <FastImage
                    {...this.props}
                    onLoadEnd={(e) => {
                        this.setState({ loading: false })
                    }}
                    resizeMode={this.props.resizeMode}
                />
                {this.state.loading ?
                    <ActivityIndicator style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} size="small" color={"#000"} />
                    : null
                }
            </View>
        );
    }
}
