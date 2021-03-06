// function for async tasks
// like fetch data from internet

import { all } from 'redux-saga/effects';

import { authSaga } from './auth/index';
import { feedSaga } from './feed/index';
import { subscribeSaga } from './subscribe/index';
import { drawerSaga } from './drawer/index';

const rootSaga = function* rootSaga() {
  yield all([
    ...authSaga,
    ...feedSaga,
    ...subscribeSaga,
    ...drawerSaga
  ]);
}

export default rootSaga;
