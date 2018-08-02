import * as React from "react";
import {Button, Card, Grid} from "semantic-ui-react";
import {getTheme} from "../../shared/AppTheme";
import {IApplicationState} from "../../stores";

interface IProps {
  slaveModeEnabled?: boolean
}

class MatchTestView extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {slaveModeEnabled} = this.props;
    return (
      <div className="view">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content className="card-header">
            <Card.Header>Network Test</Card.Header>
          </Card.Content>
          <Card.Content>
            <Grid column={16}>
              <Grid.Row textAlign="center">
                <Grid.Column width={2}/>
                <Grid.Column width={3}><h3>REST API {slaveModeEnabled ? "(MASTER)" : ""}</h3></Grid.Column>
                <Grid.Column width={3}><h3>SocketIO Server</h3></Grid.Column>
                <Grid.Column width={3}><h3>Web Server</h3></Grid.Column>
                <Grid.Column width={3}><h3>Audience Display</h3></Grid.Column>
                <Grid.Column width={2}/>
              </Grid.Row>
              <Grid.Row textAlign="center">
                <Grid.Column width={2}/>
                <Grid.Column width={3}><Button fluid={true} color={getTheme().primary}>Test</Button></Grid.Column>
                <Grid.Column width={3}><Button fluid={true} color={getTheme().primary}>Test</Button></Grid.Column>
                <Grid.Column width={3}><Button fluid={true} color={getTheme().primary}>Test</Button></Grid.Column>
                <Grid.Column width={3}><Button fluid={true} color={getTheme().primary}>Test</Button></Grid.Column>
                <Grid.Column width={2}/>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    slaveModeEnabled: configState.slaveModeEnabled
  };
}

export default MatchTestView;