import swal from 'sweetalert2';

export const tokensWhichAllowedToRoute = [
  'createPassword',
  'forgotPassword',
  'login',
  'resetPassword',
  'forgot-password-otp',
  'reset-password-otp',
  'participant-reset-password',
  'verify-participant',
  'verify-participant-v2',
  'privacy-policy',
  'terms-of-use',
];

export const beforeEach = ({
  store,
  api,
  toastr,
}) => async (to, from, next) => {
  // get client ID on required pages and if user is not logged in
  if (!store.getters.token) {
    if (tokensWhichAllowedToRoute.indexOf(to.name) === -1) {
      let nxtRoute = {
        name: 'login',
      };
      let isLogOut = window.localStorage.getItem('thread-logOut');
      window.localStorage.removeItem('thread-logOut');
      if (from.name == null && !isLogOut) {
        nxtRoute.query = {
          redirectTo: to.path,
        };
      }
      next(nxtRoute);
    } else if (tokensWhichAllowedToRoute.indexOf(to.name) >= 0) {
      await api
        .getClientIdFact()
        .then(result => {
          store.dispatch('clientIdSuccess', result.body.id);
          store.dispatch('clientName', result.body.name);
        })
        .catch(error => {
          toastr.error(
            error.body && error.body.message ? error.body.message : 'Error while getting clients.',
          );
        });
    }
  }
  // before each route hook
  if (from.name) {
    if (from.name.includes('configure-new-form') && !to.name.includes('configure-new-form')
      && ((JSON.parse(window.localStorage.getItem('thread-edcData'))
        && JSON.parse(window.localStorage.getItem('thread-edcData').length))
        || (window.localStorage.getItem('thread-edcFormName')
          && window.localStorage.getItem('thread-edcFormName').length))
      || JSON.parse(window.localStorage.getItem('thread-edcFormEditMode'))) {
      swal({
        title: 'You have not saved your progress. Are you sure you want to leave? Your changes will not be saved. ',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then(({
        dismiss,
      }) => {
        if (dismiss === 'cancel') {
          next(false);
        }
        if (!dismiss) {
          store.dispatch('clearEDCData');
          next();
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

export const afterEach = () => {
  // (to, from)
};
