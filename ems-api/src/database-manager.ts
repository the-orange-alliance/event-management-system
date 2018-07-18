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