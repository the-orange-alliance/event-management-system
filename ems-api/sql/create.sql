CREATE TABLE IF NOT EXISTS "event" (
    event_key VARCHAR(15) PRIMARY KEY NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    venue VARCHAR(255),
    event_type_key VARCHAR(255),
    division_name VARCHAR(255) NULL,
    city VARCHAR(255),
    state_prov VARCHAR(255),
    country VARCHAR(4),
    website VARCHAR(255),
    fields INT,
    multi_action_fields INT,
    alliance_count INT,
    elims_alliance_count INT
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
    rookie_year INT
);

CREATE TABLE IF NOT EXISTS "alliance" (
    alliance_key VARCHAR(25) PRIMARY KEY NOT NULL,
    alliance_rank INT NOT NULL,
    team_key INT NOT NULL,
    alliance_name VARCHAR(5),
    alliance_name_long VARCHAR(50),
    is_captain INT,
    FOREIGN KEY (team_key) REFERENCES "team"(team_key)
);

CREATE TABLE IF NOT EXISTS "ranking" (
    rank_key INT PRIMARY KEY NOT NULL,
    team_key INT NOT NULL,
    ranking INT NOT NULL,
    ranking_points INT,
    total_points INT,
    coopertition_points INT,
    parking_points INT,
    played INT,
    FOREIGN KEY (team_key) REFERENCES "team"(team_key)
);

CREATE TABLE IF NOT EXISTS "match" (
    match_key VARCHAR(35) PRIMARY KEY NOT NULL,
    match_name VARCHAR(50) NOT NULL,
    match_detail_key VARCHAR(45) NOT NULL,
    tournament_level INT NOT NULL,
    scheduled_time VARCHAR(255),
    start_time VARCHAR(255),
    prestart_time VARCHAR(255),
    field_number INT,
    cycle_time REAL,
    red_score INT,
    red_minPen INT,
    red_majPen INT,
    blue_score INT,
    blue_minPen INT,
    blue_majPen INT,
    active INT
);

CREATE TABLE IF NOT EXISTS "match_participant" (
    match_participant_key VARCHAR(45) PRIMARY KEY NOT NULL,
    match_key VARCHAR(35) NOT NULL,
    team_key INT NOT NULL,
    disqualified INT,
    card_status INT,
    surrogate INT,
    FOREIGN KEY (match_key) REFERENCES "match"(match_key),
    FOREIGN KEY (team_key) REFERENCES "team"(team_key)
);

CREATE TABLE IF NOT EXISTS "match_detail" (
    match_detail_key VARCHAR(45) PRIMARY KEY NOT NULL,
	match_key VARCHAR(35) NOT NULL,
	red_solar_panel_one_ownership INT,
    red_solar_panel_two_ownership INT,
    red_solar_panel_three_ownership INT,
    red_solar_panel_four_ownership INT,
    red_solar_panel_five_ownership INT,
    red_wind_turbine_ownership INT,
    red_nuclear_reactor_ownership INT,
    red_combustion_low INT,
    red_combustion_high INT,
    red_robots_parked INT,
    red_coopertition_bonus INT,
    red_wind_powerline_activated INT,
    red_reactor_powerline INT,
    red_combustion_powerline INT,
    red_wind_turbine_cranked INT,
    blue_solar_panel_one_ownership INT,
    blue_solar_panel_two_ownership INT,
    blue_solar_panel_three_ownership INT,
    blue_solar_panel_four_ownership INT,
    blue_solar_panel_five_ownership INT,
    blue_wind_turbine_ownership INT,
    blue_nuclear_reactor_ownership INT,
    blue_combustion_low INT,
    blue_combustion_high INT,
    blue_robots_parked INT,
    blue_coopertition_bonus INT,
    blue_wind_powerline_activated INT,
    blue_reactor_powerline INT,
    blue_combustion_powerline INT,
    blue_wind_turbine_cranked INT,
    reactor_cubes INT,
    FOREIGN KEY (match_key) REFERENCES "match"(match_key)
);