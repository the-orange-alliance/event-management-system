import * as React from "react";
import {Icon, Popup} from "semantic-ui-react";

interface IProps {
  title: string,
  content: string
}

class ExplanationIcon extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <span>{this.props.title + " "}</span>
        <Popup trigger={
          <Icon name="question circle"/>
        } content={this.props.content} position="top center"/>
      </div>
    );
  }
}

export default ExplanationIcon;