import * as React from 'react';
import {Cookies} from 'react-cookie';

interface IProps {
  cookies: Cookies,
  onLoginFailure: () => void
}

class MainView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    if (typeof this.props.cookies.get("login") === "undefined" ||
        this.props.cookies.get("login") === false) {
      this.props.onLoginFailure();
    }
  }

  public render() {
    return (
      <div>
        Hello World!
      </div>
    );
  }
}

export default MainView;