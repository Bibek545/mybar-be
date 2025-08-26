import Joi from "joi"
import { responseClient } from "../responseClient.js"


export const validateData = ({req, res, next, obj}) => {
 //create schema or rules

    const schema = Joi.object(obj)

    //pass ypur data (req.body) to the schema
    const value = schema.validate(req.body)
    // console.log(value)
     

    //if pass go to the next() ot reponse the error from here


    if(value.error) {
        return responseClient({
            req,
            res,
            message: value.error.message, 
            statuscode:400,
        })
    }
    next();

}

