const SELECTED_KEYS = ["_id", "title", "content"];
const _ = require("underscore");

function filterByKey(document) {
  return _.pick(document, ...SELECTED_KEYS);
}
function filterByKeys(documents) {
  var picked = [];
  for (const doc of documents) {
    picked.push(filterByKey(doc));
  }
  return picked;
}

module.exports = { filterByKey, filterByKeys };
