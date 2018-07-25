import {ActionCreator} from "redux";
import {ISetActiveMatch} from "./types";
import Match from "../../shared/models/Match";
import {SET_ACTIVE_MATCH} from "./constants";

export const setActiveMatch: ActionCreator<ISetActiveMatch> = (activeMatch: Match) => ({
  type: SET_ACTIVE_MATCH,
  payload: {
    activeMatch: activeMatch
  }
});