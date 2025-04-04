const { createUser, findUserByUserId, checkByUserId, checkEmail, loginUser, sendResetPasswordMail,
  verifyAndUpdatePass, userInfo, updateProfile,
 } = require("../service/user.service");
 const { getImageService } = require("../service/imgs.service");
const CustomError = require("../common/error");
const { signupValidator, loginValidator, resetPassWordValidator,
  updateUserProfileValidator,
 } = require("../validator/user.validator");
const { sendVerificationEmail } = require("../service/email.service");

const signup = async (req, res) => {
    try {
      const { error, value } = signupValidator.validate(req.body);
      if (error) {
        throw new CustomError(400, error.details[0].message);
      }
  
      const { firstName, lastName, userId, password, email } = value;
  
      const existingUser = await checkEmail(email);
      if (existingUser) {
        throw new CustomError(400, "This email is already registerd!!");
      }
  
      const profilePicture = req.file ? req.file.path : null;
  
      const newUser = await createUser({ firstName, lastName, userId, password, profilePicture, email });
      //await sendVerificationEmail(newUser)
  
      res.status(201).send({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(error.statusCode || 500).send({ message: error.message || "Internal Server Error" });
    }
  };

const verifyUserViaEmailLink = async function (req, res) {
    try {
        let { token } = req.query;
        if(!token){
            throw new CustomError(400, "Invalid Link!")
        }
    } catch (error) {
        res.status(error.statusCode || 500).send({ message: error.message || "Internal Server Error" });
    }
}

const isUserIdAvailable = async function (req, res) {
  try {
    let { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "Please provide userId!" });
    }
    let isAvailable = await checkByUserId(userId);

    return res.status(200).json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking userId availability:", error);
    return res.status(error.statusCode || 500).json({ 
      message: error.message || "Internal Server Error" 
    });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { userId, password } = value;
    const { user, token } = await loginUser({ userId, password });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

const sendResetPasswordLink = async (req, res) => {
  try {
    let { error, value } = resetPassWordValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    await sendResetPasswordMail(value)
    res.status(200).json({ message: "Password reset link sent successfully, Please check you email!" });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Internal Server Error',
    });
  }
}

const verifyResetLink = async function (req, res) {
  try {
    let { token } = req.query;
    
    if (!token) {
      throw new CustomError(400, 'Invalid or expired link!');
    }
    await verifyAndUpdatePass({ token });

    res.status(200).json({
      message: 'Password reset link verified successfully and Password is reset!',
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const { userId, id } = req.user;

    if (!userId) {
      throw new CustomError(400, 'User ID is required!');
    }

    const userInfoData = await userInfo({ userId, id });

    res.status(200).json({
      message: 'User profile fetched successfully',
      user: userInfoData,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};

const updateUserProfile = async function (req, res) {
  try {
    const { userId, id } = req.user;

    let { error, value } = updateUserProfileValidator.validate(req.body);

    value.profilePicture = req?.file?.path ?? null;
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let updatedUser = await updateProfile({ id, ...value });

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser.user,
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getImageController = (req, res) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required!" });
    }

    const imagePath = getImageService(filename);

    res.sendFile(imagePath);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { signup, isUserIdAvailable, login, sendResetPasswordLink, verifyResetLink, userProfile,
  updateUserProfile, getImageController,
 };
