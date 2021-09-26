const verifyEmailAndId = (parameter) => {
  const emailRegExp = new RegExp(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, 'i');
  const idRegex = new RegExp(/^[0-9a-fA-F]{24}$/);
  if (emailRegExp.test(parameter) === true) {
    return { email: parameter };
  }
  if (idRegex.test(parameter) === true) {
    return { _id: parameter };
  }
  return false;
};

const verifyEmail = (email) => {
  const emailRegExp = new RegExp(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, 'i');
  if (emailRegExp.test(email) === true) {
    return true;
  }
  return false;
};

const verifyPassword = (password) => {
  const passRegExp = new RegExp(/[A-Za-z\d$@$!%*?&]{8,15}/, 'i');
  if (passRegExp.test(password) === true) {
    return true;
  }
  return false;
};

const verifyId = (id) => {
  const idRegex = new RegExp(/^[0-9a-fA-F]{24}$/);
  if (idRegex.test(id) === true) {
    return true;
  }
  return false;
};

module.exports = {
  verifyEmailAndId,
  verifyEmail,
  verifyPassword,
  verifyId,
};
