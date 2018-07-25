import * as React from "react";
import {Button, Card, Grid, Tab} from "semantic-ui-react";
import {getTheme} from "../../../shared/AppTheme";
import SocketProvider from "../../../shared/providers/SocketProvider";

class VideoSwitch extends React.Component {
  public render() {
    return (
      <Tab.Pane className="tab-subview">
        <Card.Group itemsPerRow={2}>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>General</h3></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 1)}>Blank Screen</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 0)}>Sponsor Screen</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>Match Play</h3></Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    );
  }

  private switchVideo(id: number) {
    SocketProvider.send("request-video", id);
  }
}

export default VideoSwitch;