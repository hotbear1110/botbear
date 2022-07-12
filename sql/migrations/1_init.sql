CREATE TABLE IF NOT EXISTS `Aliases` (
  `Aliases` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Cdr` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `Channel` varchar(255) DEFAULT NULL,
  `RemindTime` bigint(20) DEFAULT NULL,
  `Mode` int(11) DEFAULT floor(0),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Commands` (
  `Name` varchar(255) DEFAULT NULL,
  `Command` longtext DEFAULT NULL,
  `Perm` int(11) DEFAULT NULL,
  `Category` varchar(255) DEFAULT NULL,
  `Cooldown` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Cookies` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `User` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `Channel` varchar(255) DEFAULT NULL,
  `RemindTime` bigint(20) DEFAULT NULL,
  `Mode` int(11) DEFAULT floor(0),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Latency` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Latency` double DEFAULT NULL,
  `Time` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `MyPing` (
  `username` varchar(255) DEFAULT NULL,
  `game_pings` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `MyPoints` (
  `username` varchar(255) DEFAULT NULL,
  `points` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `NukeList` (
  `ID` varchar(1) DEFAULT NULL,
  `User` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Streamers` (
  `username` varchar(255) DEFAULT NULL,
  `uid` int(255) DEFAULT NULL,
  `islive` int(11) DEFAULT NULL,
  `liveemote` varchar(255) DEFAULT NULL,
  `titleemote` varchar(255) DEFAULT NULL,
  `gameemote` varchar(255) DEFAULT NULL,
  `offlineemote` varchar(255) DEFAULT NULL,
  `live_ping` longtext DEFAULT NULL,
  `offline_ping` longtext DEFAULT '[""]',
  `banphraseapi` varchar(255) DEFAULT 'https://pajlada.pajbot.com',
  `banphraseapi2` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `title_ping` longtext DEFAULT NULL,
  `game` varchar(255) DEFAULT NULL,
  `game_ping` longtext DEFAULT NULL,
  `game_time` bigint(20) DEFAULT NULL,
  `emote_list` longtext DEFAULT NULL,
  `emote_removed` longtext DEFAULT NULL,
  `disabled_commands` longtext DEFAULT NULL,
  `trivia_cooldowns` bigint(20) DEFAULT 30000,
  `offlineonly` int(11) DEFAULT 0,
  `seventv_sub` int(11) NOT NULL DEFAULT 0,
  `title_time` bigint(20) DEFAULT NULL,
  `command_default` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Suggestions` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `User` varchar(255) DEFAULT NULL,
  `Suggestion` longtext DEFAULT NULL,
  `Status` enum('Unfinished','Finished','Duplicate','Trashed','Unhandled') NOT NULL DEFAULT 'Unfinished',
  `Description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Users` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `permission` int(11) NOT NULL DEFAULT 100,
  `date_spotted` int(11) DEFAULT unix_timestamp(current_timestamp()),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;