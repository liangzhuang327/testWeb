import React, { Component } from 'react';
import TestCom from '../components';

export default class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ mounted: true });
    }, 1000);
  }
  render() {
    const { mounted } = this.state;
    if (!mounted)
      return null;
    return <TestCom end="client" />
  }
}
