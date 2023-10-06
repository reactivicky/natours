module.exports = function (fn) {
  return function (req, res, next) {
    fn(req, res).catch(next);
  };
};
