import * as React from "react";
import {AllianceColors} from "../../shared/AppTypes";
import {Card} from "semantic-ui-react";
import SocketMatch from "../../shared/models/scoring/SocketMatch";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";

interface IProps {
  alliance: AllianceColors,
  scoreObj?: SocketMatch
}

class EnergyImpactScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {alliance, scoreObj} = this.props;
    return (
      <Card fluid={true} className={alliance.toString().toLowerCase() + "-bg"}>
        <Card.Content className="center-items card-header"><Card.Header>{alliance} Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          {alliance === "Red" ? scoreObj.redScore : scoreObj.blueScore}
        </Card.Content>
      </Card>
    );
  }
}

export function mapStateToProps({scoringState}: IApplicationState) {
  return {
    scoreObj: scoringState.scoreObj
  };
}

export default connect(mapStateToProps)(EnergyImpactScorecard);