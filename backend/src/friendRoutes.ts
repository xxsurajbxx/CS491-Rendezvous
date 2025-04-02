import express from "express";
import { addFriend } from "./addFriendsEndpoint";
import { viewFriendRequests } from "./viewFriendRequests";
import { respondToRequest } from "./friendRequestActions";
import { getFriends } from "./friendsListEndpoint";
import { deleteFriend } from "./deleteFriendEndpoint";
import { countIncomingFriendRequests } from "./incomingFriendRequests";
const router = express.Router();

// add friend
router.post("/add", async (req, res) => {
    await addFriend(req, res);
});

// view pending friend requests
router.get("/requests/:userId", async (req, res) => {
    await viewFriendRequests(req, res);
});

// respond to a request (accept or reject)
router.post("/respond/:friendId", async (req, res) => {
    await respondToRequest(req, res);
});

// view all accepted friends
router.get("/all/:userId", async (req, res) => {
    await getFriends(req, res);
});

// delete a friend
router.delete("/delete/:friendId", async (req, res) => {
    await deleteFriend(req, res);
});

// count incoming friend requests
router.get("/requests/count/:userId", async (req, res) => {
    await countIncomingFriendRequests(req, res);
  });

export default router;
