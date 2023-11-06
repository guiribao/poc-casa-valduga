import bcrypt from 'bcryptjs';

const PASSWORD_SALT = Number(process.env.PASSWORD_SALT);

export async function encrypt(senha: string) {
  let salt = await bcrypt.genSalt(PASSWORD_SALT);
  return await bcrypt.hash(senha, salt);
}

export async function compare(stringSenha: string, hash: string): Promise<Boolean> {
  return await bcrypt.compare(stringSenha, hash);
}
