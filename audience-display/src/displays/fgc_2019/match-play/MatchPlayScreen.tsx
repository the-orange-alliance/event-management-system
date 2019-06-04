import * as React from "react";
import {Match} from "@the-orange-alliance/lib-ems";

import "./MatchPlayScreen.css";

interface IProps {
  match: Match
}

class MatchPlayScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  // public componentDidMount() {
  //
  // }
  //
  // public componentWillUnmount() {
  //
  // }

  public render() {
    const {match} = this.props;
    return (
      <div>
        {match.abbreviatedName}
      </div>
    );
  }
}

export default MatchPlayScreen;