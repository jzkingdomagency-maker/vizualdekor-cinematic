import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: () => void;
}

interface State {
  failed: boolean;
}

/** Ha a WebGL jelenet nem indul el, a statikus nézetre váltunk. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(): void {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
