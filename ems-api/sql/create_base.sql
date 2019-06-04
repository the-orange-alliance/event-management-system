CREATE TABLE IF NOT EXISTS "event" (
    event_key VARCHAR(15) PRIMARY KEY NOT NULL,
    season_key VARCHAR(4) NOT NULL,
    region_key VARCHAR(4) NOT NULL,
    event_type VARCHAR(8) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    division_name VARCHAR(255) NULL,
    venue VARCHAR(255),
    event_type_key VARCHAR(25),
    city VARCHAR(255),
    state_prov VARCHAR(255),
    country VARCHAR(255),
    website VARCHAR(255),
    field_count INT
);

CREATE TABLE IF NOT EXISTS "team" (
    team_key INT PRIMARY KEY NOT NULL,
    event_participant_key VARCHAR(25) NOT NULL,
    has_card INT,
    team_name_short VARCHAR(255),
    team_name_long VARCHAR(255),
    robot_name VARCHAR(100),
    city VARCHAR(255),
    state_prov VARCHAR(255),
    country VARCHAR(255),
    country_code VARCHAR(2),
    rookie_year INT,
    card_status INT
);

CREATE TABLE IF NOT EXISTS "alliance" (
    alliance_key VARCHAR(25) PRIMARY KEY NOT NULL,
    alliance_rank INT NOT NULL,
    team_key INT NOT NULL,
    alliance_name_short VARCHAR(5),
    alliance_name_long VARCHAR(50),
    is_captain INT,
    FOREIGN KEY (team_key) REFERENCES "team"(team_key)
);

CREATE TABLE IF NOT EXISTS "ranking" (
    rank_key INT PRIMARY KEY NOT NULL,
    team_key INT NOT NULL,
    rank INT NOT NULL,
    rank_change INT,
    played INT,
    wins INT,
    losses INT,
    ties INT,
    FOREIGN KEY (team_key) REFERENCES "team"(team_key)
);

CREATE TABLE IF NOT EXISTS "schedule" (
    schedule_item_key VARCHAR(40) PRIMARY KEY NOT NULL,
    schedule_item_type VARCHAR(15) NOT NULL,
    schedule_item_name VARCHAR(100) NOT NULL,
    schedule_day INT NOT NULL,
    start_time VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    is_match INT NOT NULL
);

CREATE TABLE IF NOT EXISTS "match" (
    match_key VARCHAR(35) PRIMARY KEY NOT NULL,
    match_detail_key VARCHAR(45) NOT NULL,
    match_name VARCHAR(50) NOT NULL,
    tournament_level INT NOT NULL,
    scheduled_time VARCHAR(255),
    start_time VARCHAR(255),
    prestart_time VARCHAR(255),
    field_number INT,
    cycle_time REAL,
    red_score INT,
    red_min_pen INT,
    red_maj_pen INT,
    blue_score INT,
    blue_min_pen INT,
    blue_maj_pen INT,
    active INT,
    result INT,
    uploaded INT
);

CREATE TABLE IF NOT EXISTS "match_participant" (
    match_participant_key VARCHAR(45) PRIMARY KEY NOT NULL,
    match_key VARCHAR(35) NOT NULL,
    team_key INT NOT NULL,
    station INT NOT NULL,
    disqualified INT,
    card_status INT,
    surrogate INT,
    no_show INT,
    alliance_key VARCHAR(25),
    FOREIGN KEY (match_key) REFERENCES "match"(match_key)
);

CREATE TABLE IF NOT EXISTS "match_detail" (
    match_detail_key VARCHAR(45) PRIMARY KEY NOT NULL,
	match_key VARCHAR(35) NOT NULL,
    FOREIGN KEY (match_key) REFERENCES "match"(match_key)
);