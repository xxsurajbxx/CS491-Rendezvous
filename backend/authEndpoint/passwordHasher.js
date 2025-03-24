import bcrypt from "bcryptjs";

const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10); // generate salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt); // hash password
    console.log("Hashed Password:", hashedPassword); 
};

// replace with test password. put the returned hash into the users table under a test user
hashPassword("testpassword"); 
