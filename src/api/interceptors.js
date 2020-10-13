import { getRefreshTokenFact } from './auth';
import localStorageService from '../services/localStorage';

// eslint-disable-next-line
export function setupInterceptors({ http, toastr, store, VueInstance }) {
  http.interceptors.push((request, next) => {
    const electronicSignatureSignIn = request.body && request.body.electronicSignatureSignIn?true:false;
    if (request.url && request.url.indexOf('refresh') < 0) {
      request.headers.set('Authorization', localStorageService.getItem('token'));
    }
    VueInstance.prototype.$Progress.start();
    next(response => {
      if (response.status === 401 && response.data.type === 'TOKENEXPIRED') {
        const { user, refreshToken } = store.getters;
        return getRefreshTokenFact(user.id, { refreshToken }).then(
          tokenReponse => {
            store.dispatch('userSetTokens', tokenReponse.body);
            return http(request);
          },
          () => {
            store.dispatch('userLogout');
          },
        );
      } if (response.status === 401 && (!response.data.type || response.data.type !== 'TOKENEXPIRED') && electronicSignatureSignIn === false) {
        store.dispatch('userLogout');
        VueInstance.prototype.$Progress.fail();
      } else if (response.status <= 0 && !window.navigator.onLine) {
        toastr.warning('Sorry! No internet connection.');
        VueInstance.prototype.$Progress.fail();
      } else if (response.status <= 0) {
        toastr.warning('Sorry! There is some server issue. Please try after some time.');
        VueInstance.prototype.$Progress.fail();
      } else {
        VueInstance.prototype.$Progress.finish();
      }
      return response;
    });
  });
}
