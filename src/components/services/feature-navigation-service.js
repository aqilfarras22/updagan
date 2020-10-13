import _ from 'lodash';
import toastr from 'toastr';

let features = [];

export function saveSelectedFeatures(featuresList) {
  features = featuresList;
}

export function getSelectedFeatures() {
  return features;
}

export function checkFeatureNavigation(routeName, selectedFeatures) {
  let returnVal = false;
  if (selectedFeatures.length > 0) {
    const featureIndex = _.findIndex(selectedFeatures, ['route', routeName]);
    const lastIndex = featureIndex === selectedFeatures.length;
    returnVal = lastIndex ? true : selectedFeatures[featureIndex + 1].route;
  } else {
    returnVal = false;
  }
  return returnVal;
}

export function buildStudyService(studyId, cb) {
  toastr.warning('Please wait while we trigger the build');
  this.$api.postStudyBuildFact(studyId).then(
    () => {
      toastr.success('Build triggered succesfully');
      cb(true);
    },
    buildError => {
      toastr.error(
        buildError.body && buildError.body.message
          ? buildError.body.message
          : 'Error while building the study',
      );
      cb(false);
    },
  );
}
