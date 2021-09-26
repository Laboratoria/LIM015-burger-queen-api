const isValidEmail = (email) => {
  const emailRegExp = new RegExp(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, 'i');
  return emailRegExp.test(email);
};

const isValidPassword = (pass) => {
  // Mínimo ocho caracteres, al menos una letra, un número y un carácter especial
  const emailRegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&]{8,}$/g);
  return emailRegExp.test(pass);
};

const isValidateObjectId = (objectId) => {
  const isValidateObjectId = new RegExp('^[0-9a-fA-F]{24}$');
  return isValidateObjectId.test(objectId);
};

const idUserOrEmail = (parameter) => {
  const isValidateObjectId = new RegExp('^[0-9a-fA-F]{24}$');

  if (isValidateObjectId.test(parameter)) {
    return { _id: parameter };
  }
  return { email: parameter };
};

module.exports = {
  isValidEmail, isValidPassword, isValidateObjectId, idUserOrEmail,
};
