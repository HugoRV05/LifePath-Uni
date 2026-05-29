import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('LifePath Uni crashed:', error, info);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <img src="/logo.png" alt="" className="error-boundary-logo" aria-hidden />
          <h1>Something went wrong</h1>
          <p>The game hit an unexpected error. Click below to restart.</p>
          <button type="button" className="btn-primary" onClick={this.handleRestart}>
            Restart game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
