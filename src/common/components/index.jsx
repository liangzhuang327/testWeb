import React, { Component } from 'react';

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }
  componentDidMount() {
    this.setState({ mounted: true });
  }
  render() {
    return <h1>{this.props.end}渲染</h1>
  }
}
