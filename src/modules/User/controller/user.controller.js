import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

//update account.- you can update ( email , mobileNumber , recoveryEmail , DOB , lastName , firstName)- if user update the email , mobileNumber make sure that the new data doesn’t conflict with any existing data in your  database
export const updateAccount = asyncHandler(async (req, res, next) => {
    // Get the user ID and role from the authenticated user
    const { _id, role } = req.user;

    // Check if user exists and is not deleted
    const user = await userModel.findOne({ _id, isDeleted: false });
    if (!user) {
        return next(new Error("User not found or deleted", { cause: 404 }));
    }
    // Ensure that the user's role is either User or Company HR
    if (role !== "User" && role !== "HR") {
        return next(new Error("You are not authorized to update this account", { cause: 403 }));
    }
    // Destructure the allowed fields from the request body
    const { email, mobileNumber, firstName, lastName } = req.body;
    // Check if the updated email conflicts with existing data
    if (email) {
        const existingUserWithEmail = await userModel.findOne({ email });
        if (existingUserWithEmail && existingUserWithEmail._id.toString() !== req.user._id) {
            return next(new Error('Email is already in use', { cause: 400 }));
        }
    }
    // Check if the updated mobile number conflicts with existing data
    if (mobileNumber) {
        const existingUserWithMobileNumber = await userModel.findOne({ mobileNumber });
        if (existingUserWithMobileNumber && existingUserWithMobileNumber._id.toString() !== req.user._id) {
            return next(new Error('Mobile number is already in use', { cause: 400 }));
        }
    }
    // Manually update the username field based on the updated firstName and lastName
    const updatedUsername = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    // Update the user account fields including the username
    const updatedUser = await userModel.findByIdAndUpdate(
        _id,
        { ...req.body, username: updatedUsername },
        { new: true }
    );
    return res.status(200).json({ message: 'Done', user: updatedUser });
});
//Get user account data 
export const getUserAccountData = asyncHandler(async (req, res, next) => {
	const { _id } = req.user;
	const user = await userModel.findOne({ _id, isDeleted: false });
	if (!user) {
		return next(new Error("email is deleted", { cause: 404 }));
	}
	return res.status(200).json({  message: "Done",user });
}); 

//Delete account
export const deleteAccount = asyncHandler(async (req, res, next) => {

    // Get the user ID and role from the authenticated user
    const { _id, role } = req.user;
    // Ensure that the user's role is either User or Company HR
    if (role !== "User" && role !== "HR") {
        return next(new Error("You are not authorized to delete this account", { cause: 403 }));
    }
    // Delete the user account
    await userModel.findByIdAndDelete(_id);
    return res.status(200).json({ message: "Done" });
});

