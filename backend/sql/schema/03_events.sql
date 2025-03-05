CREATE TABLE Events (
    EventID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    DateTime DATETIME NOT NULL,
    Location VARCHAR(255) NOT NULL,
    HostUserID INT NOT NULL,
    TicketmasterLink VARCHAR(500) NULL,
    Description TEXT NULL,
    Image VARCHAR(255) NULL, -- storing file path or url of image
    IsPublic BOOLEAN NOT NULL DEFAULT TRUE -- boolean flag. TRUE = public, FALSE = private
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_host FOREIGN KEY (HostUserID) REFERENCES User(UserID) ON DELETE CASCADE
);