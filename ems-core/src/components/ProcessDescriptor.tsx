import * as React from "react";
import {Grid} from "semantic-ui-react";
import Process from "../shared/models/Process";

interface IProps {
  process: Process
}

class ProcessDescriptor extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {process} = this.props;
    return (
      <Grid.Row columns="equal" textAlign="center">
        <Grid.Column>{process.name || ""}</Grid.Column>
        <Grid.Column>{process.address || ""}</Grid.Column>
        <Grid.Column className={this.getStatusStyle()}>{process.status || ""}</Grid.Column>
        <Grid.Column>{process.pid || ""}</Grid.Column>
        <Grid.Column>{process.cpu || ""}</Grid.Column>
        <Grid.Column>{process.mem || ""}</Grid.Column>
      </Grid.Row>
    )
  }

  private getStatusStyle(): string {
    switch (this.props.process.status) {
      case "ONLINE":
        return "bold success-text";
      case "WAITING...":
        return "bold warn-text";
      case "OFFLINE":
        return "bold error-text";
      case "STOPPED":
        return "bold error-text";
      case "ERROR":
        return "bold error-text";
      default:
        return "bold error-text";
    }
  }
}

export default ProcessDescriptor;