import { login } from './login';
import { confirmCode } from './confirmCode';
import { logout } from './logout';
import { deleteAccount } from './deleteAccount';
import { getSocketToken } from './getSocketToken';
import { authWeb3 } from './authWeb3';
import { confirmWeb3 } from './confirmWeb3';

export const auth = {
  login,
  confirmCode,
  logout,
  getSocketToken,
  deleteAccount,
  authWeb3,
  confirmWeb3,
};
