const Role = require('../models/Roles');

const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count > 0) return;
    await Promise.all([
      new Role({ name: 'user' }).save(),
      new Role({ name: 'admin' }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createRoles };
