import * as React from "react";
import {Card, Divider, Tab} from "semantic-ui-react";

class NetworkConfig extends React.Component {
  public render() {
    return (
      <Tab.Pane>
        <h3>Network Config</h3>
        <Divider />
        <Card.Group itemsPerRow={2}>
          <Card fluid={true}>
            <Card.Content>
              Content!
            </Card.Content>
          </Card>
          <Card fluid={true}>
            <Card.Content>
              Content!
            </Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    )
  }
}

export default NetworkConfig;