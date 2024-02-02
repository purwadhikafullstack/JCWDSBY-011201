import tokens from '../../models/tokens.model';

class TokenServiceCLass {
  async createToken(token, userId, method, transaction) {
    try {
      const currDate = new Date().getTime();
      const validUntil = new Date(currDate + 3600 * 1 * 1000);
      const result = await tokens.create(
        {
          token: token,
          userId: userId,
          method: method,
          validUntil: validUntil,
        },
        { transaction: transaction },
      );
      return { success: true, result: result };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
  async deactivateToken(userId, method, transaction) {
    try {
      const result = await tokens.update(
        { isValid: false },
        {
          where: { userId: userId, method: method },
          transaction: transaction,
        },
      );
      return { success: true, result: result };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
}

const tokenService = new TokenServiceCLass();
export default tokenService;
