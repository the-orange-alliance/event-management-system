import * as React from "react";
import {Card} from "semantic-ui-react";
import OceanOpportunitiesTeamStatus from "./OceanOpportunitiesTeamStatus";

class OceanOpportunitiesBlueScorecard extends React.Component {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Card fluid={true} className="scorecard blue-bg">
        <Card.Content className="center-items card-header"><Card.Header>Blue Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <OceanOpportunitiesTeamStatus alliance={"Blue"} />
        </Card.Content>
      </Card>
    );
  }
}

export default OceanOpportunitiesBlueScorecard;