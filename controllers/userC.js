const userSchema = require('../models/userSchema')
const bcrypt = require('bcrypt'); 
const Joi = require('joi'); 

//get all users
const allUsers = async (req, res) => {
    try {
      const users = await userSchema.find();
      if (!users) {
        return res.status(500).json({ success: false });
      }
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message, success: false });
    }
  };

  // Sign Up
  const signUp = async (req, res) => {
    try {
      // 1. Extract user data from request body
      const { name, email, password, phone,isAdmin,street, apartment, zip, city, country } = req.body;
  
      // 2. Hash the password using bcrypt
      const saltRounds = 10; // Adjust salt rounds as needed
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // 3. Create new user object with hashed password
      const user = new userSchema({
        ...req.body,
        password: hashedPassword
      });
  
      // 4. Save the user and handle errors
      const savedUser = await user.save();
      if (!savedUser) {
        return res.status(500).json({ success: false, message: "Failed to create user" });
      }
  
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone,
          isAdmin: savedUser.isAdmin,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message, success: false });
    }
  };
  
  


// login
// const handleLogin = async (req, res) => {
//     const cookies = req.cookies;
//     console.log(req.body);
//     const email = req.body.email;
//     const password = req.body.password;
//     console.log(password);
//     if (!email || !password)
//       return res
//         .status(400)
//         .json({ message: "email and password are required." });
//     const foundUser = await UserSchema.findOne({ email: email });
//     console.log(foundUser);
//     if (!foundUser) return res.sendStatus(401); //Unauthorized
//     // evaluate password
//     const match = await bcrypt.compare(password, foundUser.password);
//     // const match = password === foundUser.password
//     console.log(match);
//     if (match) {
//       console.log(foundUser);
//       const roles = Object.values(foundUser.roles).filter(Boolean);
//       // create JWTs
//       const accessToken = jwt.sign(
//         {
//           UserInfo: {
//             email: foundUser.email,
//             roles: roles,
//           },
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "1y" } //10m
//       );
//       const newRefreshToken = jwt.sign(
//         { email: foundUser.email },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: "1y" } //10d
//       );
  
//       let newRefreshTokenArray = !cookies?.jwt
//         ? foundUser.refreshToken
//         : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);
  
//       if (cookies?.jwt) {
//         /* 
//               Scenario added here: 
//                   1) User logs in but never uses RT and does not logout 
//                   2) RT is stolen
//                   3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
//               */
  
//         const refreshToken = cookies.jwt;
//         const foundToken = await UserSchema.findOne({ refreshToken }).exec();
  
//         // Detected refresh token reuse!
//         if (!foundToken) {
//           console.log("attempted refresh token reuse at login!");
//           // clear out ALL previous refresh tokens
//           newRefreshTokenArray = [];
//         }
  
//         res.clearCookie("jwt", {
//           httpOnly: true,
//           sameSite: "None",
//           secure: true,
//         });
//       }
  
//       // Saving refreshToken with current user
//       foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//       await foundUser.save();
  
//       // Creates Secure Cookie with refresh token
//       res.cookie("jwt", newRefreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//         maxAge: 24 * 60 * 60 * 1000,
//       });
  
//       // Send authorization roles and access token to user
//       res.json({ accessToken, success: true });
//     } else {
//       console.log("23912039qsidbdak");
//       res.sendStatus(401);
//     }
//   };
const Login = async (req, res) => {
    const { email, password } = req.body;
  
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
  
    // Find the user by email
    const foundUser = await userSchema.findOne({ email: email });
  
    if (!foundUser) {
      return res.sendStatus(401); // Unauthorized
    }
  
    // Compare password using bcrypt
    const match = await bcrypt.compare(password, foundUser.password);
  
    if (match) {
      // Login successful
      console.log("User logged in successfully!");
      console.log(foundUser._id);
      return res.status(201).json({ 
        message: "User Logged in Succesfully!" ,
        id: foundUser._id,
      });
  
  
    } else {
      console.log("Invalid password");
      res.sendStatus(401); // Unauthorized
    }
  };

  const Logout = async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not logged in" });
      }
  
      // Invalidate session
      req.session.destroy();
  
      res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Logout failed" });
    }
  };
  



  module.exports = {
    allUsers,
    signUp,
    Login,
    Logout
  }