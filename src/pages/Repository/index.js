import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

class Repository extends Component {
    static navigationOptions = ({ navigation }) => ({
      title: navigation.getParam('repository').login,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func,
        }).isRequired,
    };

    render() {
        const { navigation } = this.props;
        const repository = navigation.getParam('repository');
        return (
            <WebView
                source={{ uri: repository.html_url }}
                style={{ flex: 1 }}
            />
        );
    }
}

export default Repository;
