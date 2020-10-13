import Vue from 'vue';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';

Vue.filter('formatGMTDate', value => momentTimeZone(value)
  .tz('Greenwich')
  .format('MMM DD, YYYY h:mm A z'),
);
Vue.filter('formatUTCDate', value => momentTimeZone(value)
  .tz('UTC')
  .format('MMM DD, YYYY hh:mm A z'),
);

Vue.filter('dateFormat', (value, type) => {
  const formatType = type || 'MM/DD/YYYY';
  return moment.utc(value).format(formatType);
});

Vue.filter('queryToolDateFormat', value => momentTimeZone(value)
  .tz('EST')
  .format('MM/DD/YYYY'),
);

Vue.filter('phone', phone => {
  const tempPhone = phone.replace(/[^0-9]/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  return tempPhone;
});

Vue.filter('convertToPST', value => momentTimeZone(value)
  .tz('America/Los_Angeles')
  .format('DD MMM YYYY, hh:mm A'),
);
Vue.filter('dueDateIndicator', value => momentTimeZone(value)
  .tz('Greenwich')
  .format('DD MMM YYYY'),
);
Vue.filter('dob', value => momentTimeZone(value)
  .format('MMMM DD, YYYY'),
);
Vue.filter('onlyMonth', value => momentTimeZone(value)
  .format('MMM DD'),
);
Vue.filter('stripTags', value => {
  let tempDivElement = document.createElement("div");
  tempDivElement.innerHTML = value;
  let innerText = tempDivElement.innerText;
  tempDivElement.remove();
  return innerText;
});

Vue.filter('toEST', value => momentTimeZone(value)
  .tz('EST')
  .format('DD MMM YYYY hh:mm A'),
);

Vue.filter('dateFUTC', value => momentTimeZone(value)
    .format('MMM DD, YYYY hh:mm A'),
);

Vue.filter('dateUTC', value => momentTimeZone(value)
    .format('MMM DD, YYYY')
);

