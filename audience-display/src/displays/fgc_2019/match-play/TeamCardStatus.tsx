import * as React from "react";

import NO_CARD from "../res/Penalty_Blank.png";
import YELLOW_CARD from "../res/Penalty_Yellow_Dot.png";
import RED_CARD from "../res/Penalty_Red_Dot.png";

interface IProps {
  cardStatus: number
}

class TeamCardStatus extends React.Component<IProps> {

  private getCardImage(cardStatus: number) {
    switch (cardStatus) {
      case 0:
        return NO_CARD;
      case 1:
        return YELLOW_CARD;
      case 2:
        return RED_CARD;
      default:
        return NO_CARD;
    }
  }

  public render() {
    return (
      <div className="team-card">
        <div className="card-container">
          <img alt={'team card status'} src={this.getCardImage(this.props.cardStatus)} className="fit-h"/>
        </div>
      </div>
    );
  }
}

export default TeamCardStatus;
