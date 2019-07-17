import * as React from "react";
import {Card} from "semantic-ui-react";
import OceanOpportunitiesTeamStatus from "./OceanOpportunitiesTeamStatus";

class OceanOpportunitiesRedScorecard extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Card fluid={true} className="scorecard red-bg">
        <Card.Content className="center-items card-header"><Card.Header>Red Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <OceanOpportunitiesTeamStatus alliance={"Red"} />
        </Card.Content>
      </Card>
    );
  }
}

export default OceanOpportunitiesRedScorecard;