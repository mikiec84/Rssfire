import { delay } from 'redux-saga';
import { select, call, put, take, takeEvery, all } from 'redux-saga/effects';
import firebase from '../config/firebase';
import { fetchHelper, xmlParser } from '../utils/index';
import {
  SYSTEM_GET_SNAPSHOT,
  SYSTEM_GET_FEEDS,
  USER_PULL_REFRESH,
  USER_TOUCH_FEED_ITEM
} from './feed-type';

function* getSnapshot(action) {
  try {
    const snapshot = yield getSnapshotExec(action);
    const payload = snapshot.val();

    if (payload !== null) {
      const hasFeedsInSnapshot = snapshot.hasChild('feeds');

      // Success get database from firebase
      yield put({ type: SYSTEM_GET_SNAPSHOT.SUCCESS, payload, hasFeedsInSnapshot });

      if(hasFeedsInSnapshot) {
        console.log('# getSnapshot: put', SYSTEM_GET_FEEDS.PENDING);
        yield put({ type: SYSTEM_GET_FEEDS.PENDING, feeds: payload.feeds });
      }

    } else {
      yield put({ type: SYSTEM_GET_SNAPSHOT.ERROR, error: 'There\'s no user data.' });
    }
  } catch(error) {
    console.warn('# getSnapshot:', error);
    yield put({ type: SYSTEM_GET_SNAPSHOT.ERROR, error: error.message });
  }
}

function* getFeed(action) {
  // console.log('Action:', action);
  // {type: "SYSTEM_GET_FEEDS_PENDING", feeds: {...}, @@redux-saga/SAGA_ACTION: true}
  try {
    const feedsArray = yield call(getFeedExec, action.feeds);

    let unsortedFeeds = [];
    feedsArray.map(feed => {
      if(feed.payload) {
        unsortedFeeds.push(...feed.payload);
      }
    });

    // console.log('Un Sorted Feeds:', unsortedFeeds);

    const sortedFeeds = unsortedFeeds.sort((a,b) => {
      if(a.pubDate === undefined) return 1;
      if(a.pubDate > b.pubDate) return -1;
      if(a.pubDate < b.pubDate) return 1;
      return 0;
    });

    // console.log('Feeds:', sortedFeeds);

    if(action.type == 'SYSTEM_GET_FEEDS_PENDING') {
      yield put({ type: SYSTEM_GET_FEEDS.SUCCESS, payload: sortedFeeds });
    } else {
      yield put({ type: USER_PULL_REFRESH.SUCCESS, payload: sortedFeeds });
    }

  } catch (error) {
    if(action.type == 'SYSTEM_GET_FEEDS_PENDING') {
      yield put({ type: SYSTEM_GET_FEEDS.ERROR, error });
    } else {
      yield put({ type: USER_PULL_REFRESH.ERROR, error });
    }
  }
}

// Exec
function* getSnapshotExec(action) {
  return yield call(firebase.getSnapshot, action.uid);
}

function* getFeedExec(feeds) {
  return yield all(
    Object.keys(feeds).map(key => {
      let url = feeds[key]['url'];
       return call(fetchHelper, url);
    })
  );
}

export const feedSaga = [
  takeEvery(SYSTEM_GET_SNAPSHOT.PENDING, getSnapshot),
  takeEvery(SYSTEM_GET_FEEDS.PENDING, getFeed),
  takeEvery(USER_PULL_REFRESH.PENDING, getFeed)
];
