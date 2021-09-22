const isValidEmail = (email) => {
  const emailRegExp = new RegExp(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, 'i');
  return emailRegExp.test(email);
};

const isValidPassword = (email) => {
  // Mínimo ocho caracteres, al menos una letra, un número y un carácter especial
  const emailRegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&]{8,}$/g);
  return emailRegExp.test(email);
};

module.exports = { isValidEmail, isValidPassword };
