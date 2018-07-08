import * as React from "react";
import {Card} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";

interface IProps {
  title: string,
  content: JSX.Element
}

class EventSelectionSetupCard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Card fluid={true} color={getTheme().secondary}>
        <Card.Content>
          <Card.Header>{this.props.title}</Card.Header>
        </Card.Content>
        <Card.Content>
          {this.props.content}
        </Card.Content>
      </Card>
    );
  }
}

export default EventSelectionSetupCard;