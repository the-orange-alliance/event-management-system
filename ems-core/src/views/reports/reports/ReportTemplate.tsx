import * as React from "react";
import {Dimmer, Divider, Grid, Loader} from "semantic-ui-react";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Event} from "@the-orange-alliance/lib-ems";
import moment from "moment";

interface IProps {
  event?: Event,
  children: JSX.Element,
  generated: boolean,
  name: string,
  updateHTML: (htmlStr: string) => void
}

class ReportTemplate extends React.Component<IProps> {
  private _ref: React.RefObject<any>;

  constructor(props: IProps) {
    super(props);
    this._ref = React.createRef();
  }

  public componentDidUpdate() {
    this.props.updateHTML(this._ref.current.innerHTML);
  }

  public render() {
    const {event, children, generated, name} = this.props;
    return (
      <div ref={this._ref} className="new-page">
        <Dimmer active={!generated}>
          <Loader />
        </Dimmer>
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <h1 className="report-header">{event.eventName}</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <h2 className="report-sub-header">{name}</h2>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider/>
        {children}
        <Divider/>
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <span>Report generated by EMS &copy; {moment().format("YYYY")}</span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    event: configState.event
  };
}

export default connect(mapStateToProps)(ReportTemplate);
