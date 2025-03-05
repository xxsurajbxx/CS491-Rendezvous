CREATE TABLE IF NOT EXISTS Map (
    MapID INT AUTO_INCREMENT PRIMARY KEY,  
    EventID INT NOT NULL,                  -- foreign key referencing Events
    Latitude DECIMAL(10, 8) NOT NULL,      -- Latitude with precision up to 8 decimal places
    Longitude DECIMAL(11, 8) NOT NULL,     -- Longitude with precision up to 8 decimal places
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    CONSTRAINT fk_map_event FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE
);
