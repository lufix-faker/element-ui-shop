import { request } from './request'

/* 获取左侧菜单数据 */
export function getMenusList() {
  return request({
    url: '/menus'
  })
}

/* 获取用户列表数据 */
export function getUsersList(queryInfo) {
  return request({
    url: '/users',
    params: queryInfo
  })
}

/* 修改用户状态 */
export function changeUserStatus(uid, type) {
  return request({
    // url: 'users/' + uid + '/state/' + type,
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

/* 添加用户 */
export function addUser(addForm) {
  return request({
    url: '/users',
    method: 'post',
    data: addForm
  })
}

/* 根据用户id查询用户信息 */
export function getUserMessageById(id) {
  return request({
    url: '/users/' + id
  })
}

/* 修改用户信息提交 */
export function changeUserMessage(id, obj) {
  return request({
    url: '/users/' + id,
    method: 'put',
    data: obj
  })
}

/* 根据id删除用户 */
export function removeUserById(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}