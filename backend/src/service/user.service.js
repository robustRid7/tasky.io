const User = require("../model/user");
const CustomError = require("../common/error");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.variables');
const { resetPasswordMail } = require("./email.service");

const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new CustomError(500, error.message || "Error creating user");
  }
};

const findUserByUserId = async (userId) => {
  const user = await User.findOne({ userId });
  if (!user) {
    throw new CustomError(404, "User not found");
  }
  return user;
};

const checkEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const verifyEmail = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.userId });
  
    if (!user) {
      throw new CustomError(404, "User not found");
    }
  
    if (user.isVerified) {
      throw new CustomError(400, "Email is already verified");
    }
    user.isVerified = true;
    await user.save();
  
    return { message: "Email verified successfully! You can now log in." };
  };

  const checkByUserId = async (userId) => {
    try {
      if (!userId) {
        throw new Error("UserId is required!");
      }
      const isExists = await User.exists({ userId });
      return !isExists;
    } catch (error) {
      console.error("Error checking user ID:", error);
      throw new Error("Error checking user ID availability.");
    }
  };

  const loginUser = async ({ userId, password }) => {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        throw new CustomError(404, 'User not found, Please register first!');
      }
  
      if (!await bcrypt.compare(password, user.password)) {
        throw new CustomError(403, 'Invalid credentials!');
      }
  
      const token = jwt.sign(
        { userId: user.userId, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
      );

      const { password: _, ...userWithoutPassword } = user.toObject();

      return { user:userWithoutPassword, token };
    } catch (error) {
      throw new CustomError(error.statusCode || 500, error.message || 'Internal Server Error');
    }
  };
  
const sendResetPasswordMail = async ({userId, password}) => {
  try {
    let user = await User.findOne({userId}).lean();
    if(!user) throw new CustomError(404, 'No User Found!');
    await resetPasswordMail({userId, password, email: user.email, name: user.name});

  } catch (error) {
    throw error;
  }
}

const verifyAndUpdatePass = async ({ token }) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = await User.findOne({userId: decoded.userId});
    user.password = decoded.password;
    await user.save()
  } catch (error) {
    throw error;
  }
}

const userInfo = async ({ userId, id }) => {
  try {
    if (!userId) {
      throw new CustomError(400, 'User ID is required!');
    }
    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      throw new CustomError(404, 'User not found!');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

const updateProfile = async ({ userId, firstName, lastName, email, profilePicture, id, password }) => {
  try {
    let userData = await User.findById(id);
    if (!userData) {
      throw new CustomError(404, 'User not found!');
    }

    if (userId) userData.userId = userId;
    if (firstName) userData.firstName = firstName;
    if (lastName) userData.lastName = lastName;
    if (email) userData.email = email;
    if (profilePicture) userData.profilePicture = profilePicture;
    if (password) userData.password = password;

    await userData.save();
    const { password: _, ...userWithoutPassword } = userData.toObject();

    return { message: "Profile updated successfully", user: userWithoutPassword };
  } catch (error) {
    throw error;
  }
}

  
module.exports = { createUser, findUserByUserId, verifyEmail, checkByUserId, checkEmail, loginUser, sendResetPasswordMail,
  verifyAndUpdatePass, userInfo, updateProfile,
 };
