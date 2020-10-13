const selectedProducts = [];
const selectedFeatures = [];

function setProducts(productName) {
  if (selectedProducts.indexOf(productName) >= 0) {
    selectedProducts.splice(selectedProducts.indexOf(productName), 1);
  } else {
    selectedProducts.push(productName);
  }
}

function getProducts() {
  return selectedProducts;
}

function setFeatures(featureName) {
  if (selectedFeatures.indexOf(featureName) >= 0) {
    selectedFeatures.splice(selectedFeatures.indexOf(featureName), 1);
  } else {
    selectedFeatures.push(featureName);
  }
}

function getFeatures() {
  return selectedFeatures;
}

module.exports = {
  setProducts,
  getProducts,
  setFeatures,
  getFeatures,
};
