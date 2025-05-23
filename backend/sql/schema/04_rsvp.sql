CREATE TABLE RSVP (
    RSVP_ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    EventID INT NOT NULL,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Attending', 'Cancelled', 'Over') NOT NULL DEFAULT 'Attending';
    CONSTRAINT fk_rsvp_user FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    CONSTRAINT fk_rsvp_event FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
    CONSTRAINT unique_rsvp UNIQUE (UserID, EventID) -- user cannot rsvp multiple times to the same events
);