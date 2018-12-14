import * as React from "react";
import {Card} from "semantic-ui-react";
import {getTheme} from "../../../shared/AppTheme";

class EventDataUpload extends React.Component {
  public render() {
    return (
      <Card fluid={true} color={getTheme().secondary} className="step-view">
        <Card.Content className='card-header'>
          <Card.Header>Event Data Upload</Card.Header>
        </Card.Content>
        <Card.Content>
          Stuff.
        </Card.Content>
      </Card>
    );
  }
}

export default EventDataUpload;