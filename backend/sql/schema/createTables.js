const mysql = require('mysql2');
const dbUrl = 'mysql://srb34:CS491CityN@vApp@sql.njit.edu:3306/srb34';
const connection = mysql.createConnection(dbUrl);

const createTables = [
    `CREATE TABLE IF NOT EXISTS User (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        FacebookID VARCHAR(255) UNIQUE NULL,
        Email VARCHAR(255) UNIQUE NOT NULL,
        HashedPassword VARCHAR(255) NOT NULL,
        Name VARCHAR(255) NOT NULL,
        Address TEXT NULL,
        Description TEXT NULL,
        Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS Friends (
        FriendID INT AUTO_INCREMENT PRIMARY KEY,
        User1ID INT NOT NULL,
        User2ID INT NOT NULL,
        Status ENUM('Accepted', 'Pending') NOT NULL DEFAULT 'Pending',
        Timestamp TIMESmysTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_friends_user1 FOREIGN KEY (User1ID) REFERENCES User(UserID) ON DELETE CASCADE,
        CONSTRAINT fk_friends_user2 FOREIGN KEY (User2ID) REFERENCES User(UserID) ON DELETE CASCADE,
        CONSTRAINT unique_friendship_pair UNIQUE (User1ID, User2ID) -- Ensures friendships are unique
    );`,

    `CREATE TABLE IF NOT EXISTS Events (
        EventID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        DateTime DATETIME NOT NULL,
        Location VARCHAR(255) NOT NULL,
        HostUserID INT NOT NULL,
        TicketmasterLink VARCHAR(500) NULL,
        Description TEXT NULL,
        Image VARCHAR(255) NULL,
        IsPublic BOOLEAN NOT NULL DEFAULT TRUE,
        Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_events_host FOREIGN KEY (HostUserID) REFERENCES User(UserID) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS RSVP (
        RSVP_ID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        EventID INT NOT NULL,
        Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_rsvp_user FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
        CONSTRAINT fk_rsvp_event FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
        CONSTRAINT unique_rsvp UNIQUE (UserID, EventID)
    );`
];


createTables.forEach(query => {
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error creating tables:", err.sqlMessage);
        } else {
            console.log("Table created successfully.");
        }
    });
});

connection.end();
