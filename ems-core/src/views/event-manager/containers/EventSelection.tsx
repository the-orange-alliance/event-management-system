import * as React from "react";
import {Grid} from "semantic-ui-react";
import EventSelectionSetupCard from "../../../components/EventSelectionSetupCard";
import EventConfigurationCard from "../../../components/EventConfigurationCard";
import fgc_2018 from "../../../resources/FGC_ei.png";
import ftc_1718 from "../../../resources/FTC_rr.png";
import ftc_1819 from "../../../resources/FTC_roverruckus.png";
import ftc_logo from "../../../resources/FTC_logo.png";

const Placeholder = () => {
  return (
    <span>Placeholder text.</span>
  );
};

class EventSelection extends React.Component {
  public render() {
    return (
      <div className="step-view">
        <EventSelectionSetupCard title={"1. Choose a Configuration Preset"} content={this.renderConfigCards()}/>
        <EventSelectionSetupCard title={"2. Data Download (Optional)"} content={<Placeholder/>}/>
      </div>
    );
  }

  private renderConfigCards(): JSX.Element {
    return (
      <Grid columns={16}>
        <Grid.Row>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"FIRST Global Energy Impact"} color={"green"} imgUrl={fgc_2018}/>
          </Grid.Column>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"FIRST Tech Challenge Relic Recovery"} color={"brown"} imgUrl={ftc_1718}/>
          </Grid.Column>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"FIRST Tech Challenge Rover Ruckus"} color={"orange"} imgUrl={ftc_1819}/>
          </Grid.Column>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"Custom FTC Event"} color={"black"} imgUrl={ftc_logo}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default EventSelection;