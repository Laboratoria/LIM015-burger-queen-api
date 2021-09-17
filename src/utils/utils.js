const isValidEmail = (email) => {
  const emailRegExp = new RegExp(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, 'i');
  return emailRegExp.test(email);
};

const isValidPassword = (email) => {
  const emailRegExp = new RegExp(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g);
  return emailRegExp.test(email);
};

module.exports = { isValidEmail, isValidPassword };
