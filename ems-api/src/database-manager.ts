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