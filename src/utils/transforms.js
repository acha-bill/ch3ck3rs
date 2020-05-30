function _transformOne (model) {
  return typeof model.toJSON !== 'undefined' ? model.toJSON() : model;
}
module.exports.transformOne = function (model) {
  return _transformOne(model);
};
module.exports.transformMany = function (models) {
  return models.map(model => _transformOne(model));
};
