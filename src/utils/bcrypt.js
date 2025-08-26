import bcrypt from "bcryptjs";
const saltRound = 15;

const hashPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, saltRound);
}

export default hashPassword;

export const comparePassword = (plainPassword, hashPassword) => {
    return bcrypt.compareSync(plainPassword, hashPassword);
}