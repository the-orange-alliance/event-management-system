import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";
import SocketMatch from "../../shared/models/scoring/SocketMatch";

export interface IScoringState {
  activeMatch: Match,
  matchState: MatchState,
  matchDuration: moment.Duration,
  scoreObj: SocketMatch
}