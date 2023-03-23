import { getExtensionsInfo } from './getExtensionInfo';
import { getExtensionsList } from './getExtensionsList';
import { postCustomMsg } from './postCustomMsg';
import { putMempoolChangeStatus } from './putMempoolChangeStatus';
import { getDevAppsList } from './getDevAppsList';
import { connectToDevCenter } from './connectDevCenter';
import { getDevAccount } from './getDevAccount';
import { connectDevApp } from './connectDevApp';
import { disconnectApp } from './disconnectApp';
import { disconnectAccount } from './disconnectAccount';

export const extensions = {
  getExtensionsInfo,
  getExtensionsList,
  postCustomMsg,
  putMempoolChangeStatus,
  connectToDevCenter,
  getDevAppsList,
  getDevAccount,
  connectDevApp,
  disconnectApp,
  disconnectAccount,
};
