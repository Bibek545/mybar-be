import sessionSchema from "./sessionSchema.js";

// creating a new schema
export const createNewSession = (sessionObj) => {
    return sessionSchema(sessionObj).save();
}

export const deleteSession = (filter)=> {
    return sessionSchema.findOneAndDelete(filter);
}

export const deleteMultipleSession = (filter)=> {
  return sessionSchema.deleteMany(filter);
}

export const getSession = (filter)=> {
    return sessionSchema.findOne(filter);
}