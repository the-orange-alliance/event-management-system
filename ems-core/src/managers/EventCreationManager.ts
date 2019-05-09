import {
  AllianceMember, EMSProvider, Event, EventType, HttpError, Match, MatchParticipant, Ranking, ScheduleItem, Team,
  TournamentType
} from "@the-orange-alliance/lib-ems";

class EventCreationManager {
  private static _instance: EventCreationManager;

  public static getInstance(): EventCreationManager {
    if (typeof EventCreationManager._instance === "undefined") {
      EventCreationManager._instance = new EventCreationManager();
    }
    return EventCreationManager._instance;
  }

  private constructor() {}

  public createEventDatabase(eventType: EventType, event: Event): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        EMSProvider.getEvent().then((events: Event[]) => {
          if (events.length > 0) {
            /* Resolve. The event database was originally created, and nothing needs to be done. This is
               completely safe.*/
            resolve(events[0]);
          } else {
            EMSProvider.postEvent(event).then((res: any) => {
              resolve(res[0]);
            }).catch((error: HttpError) => {
              // If we can't post the event, then something is wrong.
              reject(error);
            });
          }
        }).catch(() => {
          // If this errors out, then the database has not been created.
          EMSProvider.createEvent(eventType).then(() => {
            EMSProvider.postEvent(event).then((res: any) => {
              resolve(res);
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
      EMSProvider.getTeams().then((emsTeams: Team[]) => {
        if (emsTeams.length > 0) {
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

  public createSchedule(type: TournamentType, scheduleItems: ScheduleItem[]): Promise<any> {
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
      EMSProvider.getMatchesByTournamentLevel(tournamentLevel).then((emsMatches: Match[]) => {
        if (emsMatches.length > 0) {
          resolve();
        } else {
          EMSProvider.postMatchSchedule(matches).then(() => {
            const participants: MatchParticipant[] = [];
            for (const match of matches) {
              for (const participant of match.participants) {
                // The 'team_key' portion of these gets filled out and confuses the database.
                participant.teamRank = undefined;
                participant.team = undefined;
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
              participant.teamRank = undefined;
              participant.team = undefined;
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

  public createElimsSchedule(matches: Match[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.postMatchSchedule(matches).then(() => {
        const participants: MatchParticipant[] = [];
        for (const match of matches) {
          if (typeof match.participants !== "undefined") {
            for (const participant of match.participants) {
              participants.push(participant);
            }
          }
        }
        EMSProvider.postMatchScheduleParticipants(participants).then(() => {
          EMSProvider.resetCardStatuses().then(() => {
            resolve();
          }).catch((cardError: HttpError) => {
            reject(cardError);
          });
        }).catch((participantError: HttpError) => {
          reject(participantError);
        });
      }).catch((scheduleError: HttpError) => {
        reject(scheduleError);
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
      EMSProvider.getRankings().then((emsRankings: Ranking[]) => {
        if (emsRankings.length > 0) {
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

  public postAlliances(members: AllianceMember[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.getAlliances().then((emsMembers: AllianceMember[]) => {
        if (emsMembers.length > 0) {
          resolve();
        } else {
          EMSProvider.postAllianceMembers(members).then(() => {
            resolve();
          }).catch((error: HttpError) => {
            reject(error);
          });
        }
      }).catch(() => {
        EMSProvider.postAllianceMembers(members).then(() => {
          resolve();
        }).catch((error: HttpError) => {
          reject(error);
        });
      });
    });
  }
}

export default EventCreationManager.getInstance();