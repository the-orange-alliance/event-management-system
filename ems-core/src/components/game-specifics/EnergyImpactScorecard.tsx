import * as React from "react";
import {AllianceColors} from "../../shared/AppTypes";
import {Card} from "semantic-ui-react";

interface IProps {
  alliance: AllianceColors
}

class EnergyImpactScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {alliance} = this.props;
    return (
      <Card fluid={true} className={alliance.toString().toLowerCase() + "-bg"}>
        <Card.Content className="center-items card-header"><Card.Header>{alliance} Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          Stuff
        </Card.Content>
      </Card>
    );
  }
}

export default EnergyImpactScorecard;