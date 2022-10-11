import { login } from './login';
import { confirmCode } from './confirmCode';
import { logout } from './logout';
import { deleteAccount } from './deleteAccount';
import { getSocketToken } from './getSocketToken';
import { changeEmail } from './changeEmail';
import { authWeb3 } from './authWeb3';
import { confirmWeb3 } from './confirmWeb3';

export const auth = {
  login,
  confirmCode,
  logout,
  getSocketToken,
  deleteAccount,
  changeEmail,
  authWeb3,
  confirmWeb3,
};
