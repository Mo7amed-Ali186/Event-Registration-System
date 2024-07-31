import joi from 'joi';
import { generalFields } from '../../utils/generalFields.js';

export const signUpSchema = joi.object({
    firstName:joi.string().min(2).max(20).required(),
    lastName:joi.string().min(2).max(20).required(),
    username:joi.string().min(2).max(20),
    email:generalFields.email.required(),
    password:generalFields.password,
    mobileNumber:joi.string(),
    role:joi.string(),
    dob: joi.string().pattern(new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/)),
confirmPassword:joi.string().valid(joi.ref('password')).required(),
}).required();
  
export const logInSchema = joi.object({
    emailOrMobileNumber:generalFields.email,
    emailOrMobileNumber:joi.string().required(),
    password:generalFields.password,
}).required();

