import {request} from './request'

export function Login(loginForm) {
  return request({
    url: 'login',
    method: 'post',
    data: loginForm
  })
}