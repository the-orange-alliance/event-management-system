import * as React from "react";
import {Button, Grid} from "semantic-ui-react";
import Process from "../shared/models/Process";

interface IProps {
  process: Process
}

class ProcessActor extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {process} = this.props;
    return (
      <Grid>
        <Grid.Row columns="equal">
          <Grid.Column className="bold center-items">{process.name || ""}</Grid.Column>
          <Grid.Column><Button fluid={true} color="orange">Restart</Button></Grid.Column>
          <Grid.Column><Button fluid={true} color="red">Stop</Button></Grid.Column>
          <Grid.Column><Button fluid={true} color="green">Start</Button></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ProcessActor;