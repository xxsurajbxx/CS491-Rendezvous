import { Request, Response } from "express";
import { pool } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { username, address, description, currentPassword, newPassword, firstName, lastName } = req.body;

  if (!userId) {
    res.status(400).json({ status: "fail", message: "Missing userId" });
    return;
  }

  try {
    // getting current user data
    const [rows] = await pool.query("SELECT Username, Name, Address, Description, Email, HashedPassword FROM Users WHERE UserID = ?", [userId]);
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ status: "fail", message: "User not found" });
      return;
    }

    const user = rows[0] as any;

    // tracking changes
    const updates: string[] = [];
    const params: any[] = [];
    let usernameChanged = false;
    let nameChanged = false;
    let addressChanged = false;

    if (username && username !== user.Username) {
      updates.push("Username = ?");
      params.push(username);
      usernameChanged = true;
    }

    if (address && address !== user.Address) {
      updates.push("Address = ?");
      params.push(address);
      addressChanged = true;
    }

    if (description && description !== user.Description) {
      updates.push("Description = ?");
      params.push(description);
    }

    const [currentFirst, ...rest] = user.Name.split(" ");
    const currentLast = rest.join(" ");

    let updatedFirstName = firstName || currentFirst;
    let updatedLastName = lastName || currentLast;
    const newFullName = `${updatedFirstName} ${updatedLastName}`.trim();

    if (newFullName !== user.Name) {
      updates.push("Name = ?");
      params.push(newFullName);
      nameChanged = true;
    }

    // update password if provided and correct
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.HashedPassword);
      if (!isMatch) {
        res.status(401).json({ status: "fail", message: "Current password is incorrect" });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updates.push("HashedPassword = ?");
      params.push(hashedNewPassword);
    }

    // updating if anything is changed
    if (updates.length > 0) {
      const updateQuery = `UPDATE Users SET ${updates.join(", ")} WHERE UserID = ?`;
      params.push(userId);
      await pool.query(updateQuery, params);
    }

    if (usernameChanged || addressChanged || nameChanged) {
      const token = jwt.sign(
        { userId: userId, email: user.Email, name: user.Name, address: address || user.Address, },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ status: "success", message: "Profile updated successfully", token });
      return;
    }

    res.json({ status: "success", message: "Profile updated successfully" });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};