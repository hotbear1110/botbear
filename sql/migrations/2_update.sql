CREATE TABLE IF NOT EXISTS `Ask` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User` varchar(255) DEFAULT NULL,
  `Channel` varchar(255) DEFAULT NULL,
  `Prompt` varchar(255) DEFAULT NULL,
  `Response` longtext DEFAULT NULL,
  `Timestamp` int(11) DEFAULT unix_timestamp(current_timestamp()),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Dalle` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User` varchar(255) DEFAULT NULL,
  `Channel` varchar(255) DEFAULT NULL,
  `Prompt` longtext DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `Timestamp` int(11) DEFAULT unix_timestamp(current_timestamp()),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Spotify` (
  `username` varchar(255) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `state` varchar(255) NOT NULL DEFAULT '0',
  `access_token` varchar(255) NOT NULL DEFAULT '',
  `refresh_token` varchar(255) NOT NULL DEFAULT '',
  `expires_in` varchar(255) DEFAULT NULL,
  'opt_in' varchar(255) DEFAULT 'false'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Yabbe_bans` (
  `Command` varchar(255) DEFAULT NULL,
  `User` varchar(255) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Yabbe_pet` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `User` varchar(255) DEFAULT NULL,
  `Pet` varchar(255) DEFAULT NULL,
  `Pet_name` varchar(255) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;