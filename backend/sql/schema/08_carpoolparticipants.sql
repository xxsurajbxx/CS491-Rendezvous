CREATE TABLE `CarpoolParticipants` (
  `CarpoolID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `JoinedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CarpoolID`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `CarpoolParticipants_ibfk_1` FOREIGN KEY (`CarpoolID`) REFERENCES `Carpools` (`CarpoolID`) ON DELETE CASCADE,
  CONSTRAINT `CarpoolParticipants_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci