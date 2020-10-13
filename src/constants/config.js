export const defaultLocale = 'en'
export const localeOptions = [
  { id: 'en', name: 'English LTR', direction: 'ltr' },
  { id: 'es', name: 'Español', direction: 'ltr' },
  { id: 'enrtl', name: 'English RTL', direction: 'rtl' }
]

// TODO: for demonstration only, text strings will be migrated to internationalization
export const THREAD_BE_URL = 'http://127.0.0.1:80'
export const KPI1_FILENAME = 'Thread_Mock_KPI_1.csv'
export const FPI_S = 'FPI'
export const FIRST_DATA_S = 'First Data'
export const AVERAGE_DAYS_S = 'Average Days'
export const TL_FPI_LABEL = 'Site Active to FPI'
export const TL_FIRST_DATA_LABEL = 'Site Active to First Data'
export const SHOW_TOP_WITHDRAW_PARTICIPANT = 10
export const WITHDRAW_STUDY_PREFIX = 'withdrawal'
export const CLIENT_ID = 654111
const activityStatus = {}
activityStatus['Complete'] = 1
activityStatus['Upcoming'] = 2
activityStatus['Incomplete'] = 0
export const  ACTIVITY_STATUS = activityStatus;