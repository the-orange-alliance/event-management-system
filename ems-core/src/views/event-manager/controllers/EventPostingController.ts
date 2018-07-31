import Event from "../../../shared/models/Event";
import EMSProvider from "../../../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import {EMSEventTypes, TournamentLevels} from "../../../shared/AppTypes";
import HttpError from "../../../shared/models/HttpError";
import Team from "../../../shared/models/Team";
import ScheduleItem from "../../../shared/models/ScheduleItem";
import Match from "../../../shared/models/Match";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import Ranking from "../../../shared/models/Ranking";

class EventPostingController {
  private static _instance: EventPostingController;

  public static getInstance(): EventPostingController {
    if (typeof EventPostingController._instance === "undefined") {
      EventPostingController._instance = new EventPostingController();
    }
    return EventPostingController._instance;
  }

  private constructor() {}

  public createEventDatabase(eventType: EMSEventTypes, event: Event): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        EMSProvider.getEvent().then((response: AxiosResponse) => {
          if (response.data.payload && response.data.payload[0] && response.data.payload[0].event_key) {
            /* Resolve. The event database was originally created, and nothing needs to be done. This is
               completely safe.*/
            resolve(response.data.payload[0]);
          } else {
            EMSProvider.postEvent(event).then((eventResponse: AxiosResponse) => {
              resolve(eventResponse.data.payload[0]);
            }).catch((error: HttpError) => {
              // If we can't post the event, then something is wrong.
              reject(error);
            });
          }
        }).catch(() => {
          // If this errors out, then the database has not been created.
          EMSProvider.createEvent(eventType).then(() => {
            EMSProvider.postEvent(event).then((response: AxiosResponse) => {
              resolve(response.data.payload[0]);
            }).catch((error: HttpError) => {
              // If we can't post the event, then something is wrong.
              reject(error);
            });
          }).catch((error: HttpError) => {
            // If this errors out... Something is wrong.
            reject(error);
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public createTeamList(teams: Team[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.getTeams().then((response: AxiosResponse) => {
        if (response.data.payload && response.data.payload.length > 0) {
          resolve();
        } else {
          EMSProvider.postTeams(teams).then(() => {
            resolve();
          }).catch((error: HttpError) => {
            reject(error);
          });
        }
      }).catch(() => {
        EMSProvider.postTeams(teams).then(() => {
          resolve();
        }).catch((error: HttpError) => {
          reject(error);
        });
      });
    });
  }

  public createSchedule(type: TournamentLevels, scheduleItems: ScheduleItem[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.deleteScheduleItems(type).then(() => {
        EMSProvider.postScheduleItems(scheduleItems).then(() => {
          resolve();
        }).catch((error: HttpError) => {
          reject(error);
        })
      }).catch(() => [
        EMSProvider.postScheduleItems(scheduleItems).then(() => {
          resolve();
        }).catch((error: HttpError) => {
          reject(error);
        })
      ]);
    });
  }

  public createMatchSchedule(tournamentLevel: number, matches: Match[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.getMatches(tournamentLevel).then((matchesResponse: AxiosResponse) => {
        if (matchesResponse.data && matchesResponse.data.payload && matchesResponse.data.payload.length > 0) {
          resolve();
        } else {
          EMSProvider.postMatchSchedule(matches).then(() => {
            const participants: MatchParticipant[] = [];
            for (const match of matches) {
              for (const participant of match.participants) {
                participants.push(participant);
              }
            }
            EMSProvider.postMatchScheduleParticipants(participants).then(() => {
              resolve();
            }).catch((participantError: HttpError) => {
              reject(participantError);
            });
          }).catch((scheduleError: HttpError) => {
            reject(scheduleError);
          });
        }
      }).catch(() => {
        EMSProvider.postMatchSchedule(matches).then(() => {
          const participants: MatchParticipant[] = [];
          for (const match of matches) {
            for (const participant of match.participants) {
              participants.push(participant);
            }
          }
          EMSProvider.postMatchScheduleParticipants(participants).then(() => {
            resolve();
          }).catch((participantError: HttpError) => {
            reject(participantError);
          });
        }).catch((scheduleError: HttpError) => {
          reject(scheduleError);
        });
      });
    });
  }

  public deleteRanks(): Promise<any> {
    return EMSProvider.deleteRankings();
  }

  public createRanks(teams: Team[], eventKey: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const rankings: Ranking[] = [];
      for (const team of teams) {
        const teamRanking: Ranking = new Ranking();
        teamRanking.rankKey = eventKey + "-R" + team.teamKey;
        teamRanking.teamKey = team.teamKey;
        rankings.push(teamRanking);
      }
      EMSProvider.getRankings().then((rankRes: AxiosResponse) => {
        if (rankRes.data && rankRes.data.payload && rankRes.data.payload.length > 0) {
          resolve();
        } else {
          EMSProvider.postRankings(rankings).then(() => {
            resolve();
          }).catch((postError: HttpError) => {
            reject(postError);
          });
        }
      }).catch(() => {
        EMSProvider.postRankings(rankings).then(() => {
          resolve();
        }).catch((postError: HttpError) => {
          reject(postError);
        });
      });
    });
  }

}

export default EventPostingController.getInstance();