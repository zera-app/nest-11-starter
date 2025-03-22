import * as bcrypt from 'bcryptjs';

export class HashUtils {
  static generateHash(value: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(value, saltRounds);
  }

  static compareHash(value: string, hash: string): boolean {
    return bcrypt.compareSync(value, hash);
  }
}
