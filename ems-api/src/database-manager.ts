import * as path from "path";
import * as fs from "fs";
import * as SQL from "sqlite3";
import {getAppDataPath} from "appdata-path";

class DatabaseManager {
  private static _instance: DatabaseManager;

  private _db: SQL.Database;

  public static getInstance(): DatabaseManager {
    if (typeof DatabaseManager._instance === "undefined") {
      DatabaseManager._instance = new DatabaseManager();
    }
    return DatabaseManager._instance;
  }

  private constructor() {
    const isProd = process.env.NODE_ENV === "production";
    const fileName = isProd ? "production.db" : "development.db";
    this._db = new SQL.Database(path.resolve(getAppDataPath("") + "/ems-core/" + fileName));
  }

  public delete(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getQueryFromFile("delete.sql").then((queryStr: string) => {
        this._db.exec(queryStr, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  public createEventDatabase(eventType: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!fs.existsSync(path.join(__dirname, "../sql/" + eventType + ".sql"))) {
        reject("There does not exist an SQL file for the given event type.");
      }
      this.createBase().then(() => {
        this.alterFromEventType(eventType).then(() => {
          resolve();
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }

  public deleteAll(table: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query: string = "DELETE FROM \"" + table + "\";";
      this._db.all(query, (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          setTimeout(() => {
            resolve(rows);
          }, 250); // Give the DB time to process all the actions.
        }
      });
    });
  }

  public selectAll(table: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query: string = "SELECT * FROM \"" + table + "\";";
      this._db.all(query, (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public selectAllWhere(table: string, whereClause: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query: string = "SELECT * FROM \"" + table + "\" WHERE " + whereClause + ";";
      this._db.all(query, (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public selectAllOrderBy(table: string, orderByClause: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query: string = "SELECT * FROM \"" + table + "\" ORDER BY " + orderByClause + ";";
      this._db.all(query, (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public deleteAllWhere(table: string, whereClause: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query: string = "DELETE FROM \"" + table + "\" WHERE " + whereClause + ";";
      this._db.all(query, (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          setTimeout(() => {
            resolve(rows);
          }, 250); // Give the DB time to process all the actions.
        }
      });
    });
  }

  public insertValues(table: string, values: object[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let columns = "";
      for (let column in values[0]) {
        if (values[0].hasOwnProperty(column)) {
          columns += column + ",";
        }
      }
      columns = columns.substring(0, columns.length - 1);
      let rows = "";
      for (let row of values) {
        let valueStr = "(";
        for (let col in row) {
          if (row.hasOwnProperty(col)) {
            valueStr += "\"" + (row as any)[col] + "\",";
          }
        }
        valueStr = valueStr.substring(0, valueStr.length - 1) + "),";
        rows += valueStr;
      }
      rows = rows.substring(0, rows.length - 1);
      const query = `INSERT INTO "${table}" (${columns}) VALUES${rows};`;
      this._db.all(query, (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          setTimeout(() => {
            resolve(rows);
          }, 250); // Give the DB time to process all the actions.
        }
      });
    });
  }

  public updateWhere(table: string, records: any, whereClause: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let columns = "";
      for (let field in records) {
        if (records.hasOwnProperty(field)) {
          columns += field + "=\"" + records[field] + "\",";
        }
      }
      columns = columns.substring(0, columns.length - 1);
      const query = "UPDATE \"" + table + "\" SET " + columns + " WHERE " + whereClause + ";";
      this._db.all(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public selectAllFromJoin(tableOne: string, tableTwo: string, joinColumn: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query = `SELECT * FROM "${tableOne}", "${tableTwo}" WHERE "${tableOne}".${joinColumn}="${tableTwo}".${joinColumn};"`;
      this._db.all(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }


  public selectAllFromJoinWhere(tableOne: string, tableTwo: string, joinColumn: string, whereClause: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query = `SELECT * FROM "${tableOne}", "${tableTwo}" WHERE "${tableOne}".${joinColumn}="${tableTwo}".${joinColumn} AND ${whereClause};"`;
      this._db.all(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public selectAllFromThreeJoinWhere(tableOne: string, tableTwo: string, tableThree: string, joinColumn: string, whereClause: string): Promise<any[]> {
    return new Promise<any>((resolve, reject) => {
      const query = `SELECT * FROM "${tableOne}", "${tableTwo}", "${tableThree}" WHERE "${tableOne}".${joinColumn}="${tableTwo}".${joinColumn} AND "${tableOne}".${joinColumn}="${tableThree}".${joinColumn} AND ${whereClause};"`;
      this._db.all(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public selectAllFromJoinOrderBy(tableOne: string, tableTwo: string, joinColumn: string, orderByClause: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const query = `SELECT * FROM "${tableOne}", "${tableTwo}" WHERE "${tableOne}".${joinColumn}="${tableTwo}".${joinColumn} ORDER BY ${orderByClause};"`;
      this._db.all(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public getMatchAndParticipants(tournamentLevel: number, operator?: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      operator = operator || "=";
      const query: string = `SELECT "match".match_key, "match".match_detail_key, "match".match_name, "match".tournament_level, "match".scheduled_time, "match".start_time, "match".prestart_time, "match".field_number, "match".cycle_time, GROUP_CONCAT(match_participant.team_key) AS participants, GROUP_CONCAT(match_participant.match_participant_key) AS participant_keys, GROUP_CONCAT(match_participant.alliance_key) AS alliance_keys, GROUP_CONCAT(match_participant.station) AS stations, GROUP_CONCAT(match_participant.surrogate) AS surrogates FROM "match", "match_participant" WHERE "match".match_key = "match_participant".match_key AND "match".tournament_level${operator}"${tournamentLevel}" GROUP BY "match".match_key;`;
      this._db.all(query, (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public getMatchResultsForRankings(eventType: string, partialKey: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      let query = "";
      if (eventType === "fgc_2018") {
        query = EnerigyImpactRankingQuery;
      } else {
        reject(`There is currently no existing ranking query for ${eventType}.`);
      }
      this._db.all(query.replace("%", partialKey), (error: any, rows: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
  
  private createBase(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getQueryFromFile("create_base.sql").then((queryStr: string) => {
        this._db.exec(queryStr, (error) => {
          if (error) {
            reject(error);
          } else {
            setTimeout(() => resolve(), 1000);
          }
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  private alterFromEventType(eventType: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getQueryFromFile(eventType + ".sql").then((queryStr: string) => {
        this._db.exec(queryStr, (error) => {
          if (error) {
            reject(error);
          } else {
            setTimeout(() => resolve(), 1000);
          }
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  private getQueryFromFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(__dirname, "../sql/" + filePath);
      fs.readFile(fullPath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString().replace(/\n/g, "").replace(/\t/g, "").replace(/\r/g, ""));
        }
      });
    });
  }
}

export default DatabaseManager.getInstance();

export const EnerigyImpactRankingQuery = `SELECT "match".match_key, "match".red_score, "match".blue_score, "match_detail".red_coopertition_bonus, "match_detail".blue_coopertition_bonus, "match_detail".red_robots_parked, "match_detail".blue_robots_parked, GROUP_CONCAT("match_participant".team_key) AS participants, GROUP_CONCAT("match_participant".card_status) AS cards, GROUP_CONCAT("match_participant".disqualified) AS disqualifieds, GROUP_CONCAT("match_participant".surrogate) AS surrogates FROM "match", "match_detail", "match_participant" WHERE "match".match_key = "match_detail".match_key AND "match".match_key = "match_participant".match_key AND "match".tournament_level = "%" GROUP BY "match".match_key ORDER BY "match_participant".match_participant_key;`;