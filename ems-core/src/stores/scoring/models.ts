import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";
import MatchParticipant from "../../shared/models/MatchParticipant";
import MatchDetails from "../../shared/models/MatchDetails";

export interface IScoringState {
  activeMatch: Match,
  activeParticipants: MatchParticipant[],
  activeDetails: MatchDetails
  matchState: MatchState,
  matchDuration: moment.Duration
}