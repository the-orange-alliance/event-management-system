import * as React from "react";
import {Card, Grid} from "semantic-ui-react";
import {getTheme} from "../../AppTheme";

class AboutView extends React.Component {
  public render() {
    return (
      <div className="view">
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={3}/>
            <Grid.Column width={10}>
              <Card fluid={true} color={getTheme().secondary}>
                <Card.Content className="card-header center-items">
                  <Card.Header><h3>About Event Management System</h3></Card.Header>
                </Card.Content>
                <Card.Content>
                  <p>
                    Event Management System is a project engineered by Kyle Flynn, and made possible with the help of <i>REV</i> Robotics,
                    Alex Fera, Soren Zaiser, and Will Curran. The libraries within the project as well as the source code itself are developed to be open-source, but credit is due to
                    it's original authors and engineers.
                  </p>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={3}/>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default AboutView;