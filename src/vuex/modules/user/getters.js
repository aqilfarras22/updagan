import jwtDecode from 'jwt-decode';

export const user = state => state.user;
export const token = state => state.token && jwtDecode(state.token);
export const refreshToken = state => state.refreshToken;
