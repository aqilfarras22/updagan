import localStorageService from '@/services/localStorage';
const idleLogout = ({ swal, store }) => {
  const IDLE_TIMEOUT = 900;
  let idleSecondsCounter = 0;

  window.document.onclick = () => {
    idleSecondsCounter = 0;
  };
  window.document.onmousemove = () => {
    idleSecondsCounter = 0;
  };
  window.document.onkeypress = () => {
    idleSecondsCounter = 0;
  };

  function CheckIdleTime() {
    idleSecondsCounter++; // eslint-disable-line
    const oPanel = window.document.getElementById('SecondsUntilExpire');
    if (idleSecondsCounter >= IDLE_TIMEOUT && oPanel) {
      idleSecondsCounter = 0;

      if (window.location.hash.indexOf('login') < 0) {
        swal({
          title: 'Your session has expired due to inactivity. Any unsaved work may not be saved.',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#34537d',
          confirmButtonText: 'OK',
        }).then(
          () => {
            store.dispatch('userLogout');
          },
          () => {
            store.dispatch('userLogout');
          },
        );
      } else {
        store.dispatch('userLogout');
      }
    }
  }
  window.setInterval(CheckIdleTime, 1000);
};

export default idleLogout;
