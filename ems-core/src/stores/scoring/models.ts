import {Match, MatchState, MatchParticipant, MatchDetails} from "@the-orange-alliance/lib-ems";
import moment from "moment";

export interface IScoringState {
  activeMatch: Match,
  activeParticipants: MatchParticipant[],
  activeDetails: MatchDetails
  matchState: MatchState,
  matchDuration: moment.Duration
}
