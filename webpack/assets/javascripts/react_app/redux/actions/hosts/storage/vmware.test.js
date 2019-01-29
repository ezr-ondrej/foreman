import { ajaxRequestAction } from '../../common';
import {
  datastoresUrl,
  storagePodsUrl,
  basicConfig,
  initAction,
  changeClusterAction,
  state1,
  fetchDatastoreParams,
  fetchStoragePodsParams,
} from './vmware.fixtures';

import * as actions from './vmware';

jest.mock('../../common');

afterEach(() => {
  ajaxRequestAction.mockReset();
});

describe('vmware storage hosts actions', () => {
  describe('initController', () => {
    it('initializes the container', () => {
      const dispatch = jest.fn();
      const dispatcher = actions.initController(
        basicConfig,
        'cluster',
        null,
        null
      );

      dispatcher(dispatch);

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenCalledWith(initAction);
    });
  });

  describe('changeCluster', () => {
    it('changes the cluster and refetches the storages', () => {
      const dispatch = jest.fn();
      const dispatcher = actions.changeCluster('newCluster');

      dispatcher(dispatch, () => state1);

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenCalledWith(changeClusterAction);
    });
  });

  describe('fetchDatastores', () => {
    it('doesnt make the ajax request when cluster is not set', () => {
      const dispatch = jest.fn();
      const dispatcher = actions.fetchDatastores(datastoresUrl, null);

      dispatcher(dispatch);

      expect(ajaxRequestAction).not.toBeCalled();
    });

    it('makes the ajax request to the right url', () => {
      const dispatch = jest.fn();
      const dispatcher = actions.fetchDatastores(datastoresUrl, 'cluster');

      dispatcher(dispatch);

      expect(ajaxRequestAction).toBeCalledWith({
        dispatch,
        ...fetchDatastoreParams,
      });
    });
  });

  describe('fetchStoragePods', () => {
    it('doesnt make the ajax request when cluster is not set', () => {
      const dispatch = jest.fn();
      const dispatcher = actions.fetchStoragePods(storagePodsUrl, null);

      dispatcher(dispatch);

      expect(ajaxRequestAction).not.toBeCalled();
    });

    it('makes the ajax request to the right url', () => {
      const dispatch = jest.fn();
      const dispatcher = actions.fetchStoragePods(storagePodsUrl, 'cluster');

      dispatcher(dispatch);

      expect(ajaxRequestAction).toBeCalledWith({
        dispatch,
        ...fetchStoragePodsParams,
      });
    });
  });
});
