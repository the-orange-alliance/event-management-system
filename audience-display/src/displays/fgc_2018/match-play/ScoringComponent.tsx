import * as React from "react";

interface IProps {
  completed: boolean,
  started: boolean,
  baseImg: any,
  startedImg: any,
  completedImg: any
}

class ScoringComponent extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div className="scoring-icon-container">
        <img src={this.getImage()} className={"fit-w " + this.getStyle()}/>
      </div>
    );
  }


  private getStyle() {
    if (this.props.completed) {
      return "complete";
    } else if (this.props.started) {
      return "";
    } else {
      return "";
    }
  }

  private getImage() {
    if (this.props.completed) {
      return this.props.completedImg;
    } else if (this.props.started) {
      return this.props.startedImg;
    } else {
      return this.props.baseImg;
    }
  }
}

export default ScoringComponent;