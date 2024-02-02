import users from '../../models/users.model';

class UserServiceClass {
  async findOneUserByEmail(email) {
    try {
      const result = await users.findOne({ where: { email: email } });
      return { success: true, result: result };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
  async createUser(email, name, transaction) {
    try {
      const result = await users.create(
        { email: email, name: name },
        { transaction: transaction },
      );
      return { success: true, result: result };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
  async verifyUserAccount(password, email, transaction) {
    try {
      const result = await users.update(
        {
          password: password,
          isVerified: true,
        },
        {
          where: { email: email },
          transaction: transaction,
        },
      );
      return { success: true, result: result };
    } catch (error) {
      return { success: false, result: error.message };
    }
  }
  async updateUserEmail() {}
  async verifyUserEmail() {}
}

const userService = new UserServiceClass();

export default userService;
