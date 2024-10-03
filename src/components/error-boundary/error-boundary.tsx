import React, { Component, ErrorInfo, ReactNode, CSSProperties } from 'react';

const STYLE: CSSProperties = { whiteSpace: 'pre-wrap' };

export interface IErrorBoundaryProps {
  children?: ReactNode;
}

interface IState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<IErrorBoundaryProps, IState> {
  public state: IState = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="main_page_heading">
          <h3>Что-то пошло не так... Обновите страницу или обратитесь в службу поддержки</h3>
          <details style={STYLE}>
            {this.state.error ? this.state.error.toString() : null}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
