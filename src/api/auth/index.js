import { login } from './login';
import { confirmCode } from './confirmCode';
import { logout } from './logout';
import { deleteAccount } from './deleteAccount';
import { getSocketToken } from './getSocketToken';
import { changeEmail } from './changeEmail';

export const auth = {
  login,
  confirmCode,
  logout,
  getSocketToken,
  deleteAccount,
  changeEmail,
};
