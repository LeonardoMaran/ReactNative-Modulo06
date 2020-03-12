import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native'
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  }

  state = {
    stars: [],
    loading: false,
    refreshing: false,
    page: 2,
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true })

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  loadMore = async () => {
    const { stars, page } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(
      `/users/${user.login}/starred?page=${page}`
    );

    this.setState({
      stars: [...stars].concat(response.data),
      page: page + 1,
    });
  }

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ refreshing: true });

    const response = await api.get(`/users/${user.login}/starred?page=1`);

    this.setState({ stars: response.data, refreshing: false });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
            <ActivityIndicator size={"large"} color="#7159c1"/>
        ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={this.state.refreshing}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred >
              <OwnerAvatar
                source={{ uri: item.owner.avatar_url }}
              />
              <Info>
                <Title>{item.name}</Title>
                <Author onPress={() =>
                  this.handleNavigate(item.owner)
                }>
                  {item.owner.login}
                </Author>
              </Info>
              </Starred>
              )}
            />
          )}
      </Container>
    );
  }
}
