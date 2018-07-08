import * as React from "react";
import {Card, Popup, SemanticCOLORS} from "semantic-ui-react";

interface IProps {
  title: string,
  color: SemanticCOLORS,
  imgUrl: string
}

class EventConfigurationCard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Card className="square-card" fluid={true} color={this.props.color}>
          <Popup trigger={
            <Card.Content className="square-card-content">
              <img className="config-card-image" src={this.props.imgUrl} />
            </Card.Content>
          } content={this.props.title} position="bottom center"/>
      </Card>
    );
  }
}

export default EventConfigurationCard;