CREATE TABLE Friends (
    FriendID INT AUTO_INCREMENT PRIMARY KEY,
    User1ID INT NOT NULL,
    User2ID INT NOT NULL,
    Status ENUM('Accepted', 'Pending') NOT NULL DEFAULT 'Pending',
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_friends_user1 FOREIGN KEY (User1ID) REFERENCES User(UserID) ON DELETE CASCADE, --foreign key that makes sure that user1 exists. if user is deleted, all friendships involving them are also deleted
    CONSTRAINT fk_friends_user2 FOREIGN KEY (User2ID) REFERENCES User(UserID) ON DELETE CASCADE,
    CONSTRAINT unique_friendship_pair UNIQUE (User1ID, User2ID) -- makes sure there are no duplicate friendships
);