import * as React from 'react';
import Match from "../../../shared/models/Match";

interface IProps {
  match: Match
}

class MatchPreviewScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div id="rr-body">
        <div id="rr-container">
          Stuff.
        </div>
      </div>
    );
  }
}

export default MatchPreviewScreen;