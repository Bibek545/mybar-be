import userSchema from "./userSchema.js";

//creating a new user 
export const createNewUser = (userobj) => {
    return userSchema(userobj).save();
}

//update the user
export const updateUser = (filter, update)=> {
    return userSchema.findOneAndUpdate(filter, update, {new: true});
}

//get user by email

export const getUserByEmail = (email) => {
    return userSchema.findOne({email});
}

export const getOneUser =(filter)=> {
    return userSchema.findOne(filter);
} 