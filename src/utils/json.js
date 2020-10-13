function camelCaseToText(text) {
  const result = text.replace(/([A-Z])/g, ' $1').replace(/[._]/g, ' ');
  return result.charAt(0).toUpperCase() + result.toLowerCase().slice(1);
}
function renameJsonKeys(json) {
  if (Array.isArray(json)) {
    return json.map(item => {
      if (typeof item === 'object') {
        return renameJsonKeys(item);
      }
      return item;
    });
  }
  const newJson = {};
  Object.keys(json).forEach(jsonKey => {
    let keyValue = json[jsonKey];
    if (Array.isArray(keyValue)) {
      keyValue = keyValue.map(item => {
        if (typeof item === 'object') {
          return renameJsonKeys(item);
        }
        return item;
      });
    } else if (typeof keyValue === 'object' && !Array.isArray(keyValue)) {
      keyValue = renameJsonKeys(keyValue);
    }
    newJson[camelCaseToText(jsonKey)] = keyValue;
  });
  return newJson;
}

export default renameJsonKeys;
