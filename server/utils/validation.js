const isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

const isUniqueName = (name, users) => {
  const nameTaken = users.find((user) => user.name === name);
  return ( !nameTaken ) ? true : false;
};

module.exports = {
  isRealString,
  isUniqueName
};
