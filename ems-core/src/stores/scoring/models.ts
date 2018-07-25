import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";

export interface IScoringState {
  activeMatch: Match,
  matchState: MatchState
}