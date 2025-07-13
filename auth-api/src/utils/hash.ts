import bcrypt from 'bcrypt';

const saltRounds = 10;
console.log(`Using bcrypt salt rounds: ${saltRounds}`);

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (plain: string, hash: string) => {
  return await bcrypt.compare(plain, hash);
};
