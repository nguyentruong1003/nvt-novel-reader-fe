export const SEARCH_TIME_WAIT = 400;  // (ms)

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

export const MAX_NUMBER_VALUE = Number.MAX_VALUE;

export const MAX_LENGTH_EDITOR = 2000;

export const BOOLEAN_STRING = {
  TRUE: 'true',
  FALSE: 'false',
};

export const METHODS = [
  {
    label: 'POST',
    value: 'POST'
  },
  {
    label: 'GET',
    value: 'GET'
  },
  {
    label: 'PUT',
    value: 'PUT'
  },
  {
    label: 'DELETE',
    value: 'DELETE'
  }
]

export const MODULES = [
  {
    label: 'IAM',
    value: 'iam'
  },
  {
    label: 'SYSTEM',
    value: 'system'
  },
  {
    label: 'NOTIFICATION',
    value: 'notification'
  },
  {
    label: 'TICKET',
    value: 'ticket'
  },
  {
    label: 'SURVEY',
    value: 'survey'
  },
  {
    label: 'BUILDING',
    value: 'building'
  },
  {
    label: 'STORAGE',
    value: 'storage'
  }
]

export const HTTPCODES = [
  {
    label: '500',
    value: 500
  },
  {
    label: '503',
    value: 503
  },
  {
    label: '400',
    value: 400
  },
  {
    label: '401',
    value: 401
  },
  {
    label: '403',
    value: 403
  },
  {
    label: '405',
    value: 405
  },
  {
    label: '200',
    value: 200
  },
]
export const ACTION = {
  CREATE: {
    event: 'create',
    buttonTitle: 'create',
    icon: 'plus-circle',
    includedButton: 'cancel'
  },
  UPDATE: {
    event: 'update',
    buttonTitle: 'save',
    icon: 'save',
    includedButton: 'cancel'
  },
  DELETE: 'delete',
  VIEW: {
    event: 'view',
    buttonTitle: 'update',
    icon: 'close-circle',
    includedButton: 'close'
  },

  STATE_UPLOAD : {
    DONE: '',
    INPROGESS: ''
  }
}