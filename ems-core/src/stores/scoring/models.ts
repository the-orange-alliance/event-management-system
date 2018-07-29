import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";

export interface IScoringState {
  activeMatch: Match,
  matchState: MatchState,
  matchDuration: moment.Duration
}