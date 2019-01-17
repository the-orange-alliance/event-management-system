import * as React from "react";
import {Button, Card, Grid, Tab} from "semantic-ui-react";
import {getTheme} from "../../../AppTheme";
import {SocketProvider} from "@the-orange-alliance/lib-ems";

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
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 4)}>Blank Screen</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 0)}>Sponsor Screen</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>Match Play</h3></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 1)}>Match Preview</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 2)}>Match Play</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 3)}>Match Results</Button></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 5)}>Match Timer</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 6)}>Rankings</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        </Card.Group>
        <Card.Group itemsPerRow={2}>
          <Card fluid={true} color={getTheme().secondary}>
            <Card.Content className="card-header"><h3>Playoffs</h3></Card.Content>
            <Card.Content>
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 7)}>Available Teams</Button></Grid.Column>
                  <Grid.Column><Button fluid={true} color={getTheme().primary} onClick={this.switchVideo.bind(this, 8)}>Playoff Bracket</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
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