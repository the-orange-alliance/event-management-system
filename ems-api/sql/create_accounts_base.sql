CREATE TABLE IF NOT EXISTS "auth_tokens" (
	"token"	VARCHAR(255) PRIMARY KEY NOT NULL,
	"expires"	DATE NOT NULL,
	"user_id"	INT NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"user_id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
	"username"	        VARCHAR(255) NOT NULL,
	"password"	        VARCHAR(255) NOT NULL,
	"can_control_match"	INTEGER NOT NULL DEFAULT 0,
	"can_control_fms"	INTEGER NOT NULL DEFAULT 0,
	"can_ref"	        INTEGER NOT NULL DEFAULT 0,
	"can_control_event"	INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "api_keys" (
    "key"	            VARCHAR(255) PRIMARY KEY NOT NULL,
    "owner_user_id"	    INTEGER NOT NULL,
    "description"	    VARCHAR(255) NOT NULL,
	"can_control_match"	BIT NOT NULL DEFAULT 0,
	"can_control_fms"	BIT NOT NULL DEFAULT 0,
	"can_ref"	        BIT NOT NULL DEFAULT 0,
	"can_control_event"	BIT NOT NULL DEFAULT 0
);
