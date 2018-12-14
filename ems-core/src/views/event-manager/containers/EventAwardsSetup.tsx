import * as React from "react";
import {getTheme} from "../../../shared/AppTheme";
import {Button, Card} from "semantic-ui-react";

interface IProps {
  onComplete: () => void,
}

class EventAwardsSetup extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.complete = this.complete.bind(this);
  }

  public render() {
    return (
      <Card fluid={true} color={getTheme().secondary} className="step-view">
        <Card.Content className='card-header'>
          <Card.Header>Event Awards</Card.Header>
        </Card.Content>
        <Card.Content>
          <Button color={"orange"} onClick={this.complete}>Press Me</Button>
        </Card.Content>
      </Card>
    );
  }

  private complete() {
    this.props.onComplete();
  }
}

export default EventAwardsSetup;