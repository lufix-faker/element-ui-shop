import { request } from './request'

/* 获取左侧菜单数据 */
export function getMenusList() {
  return request({
    url: '/menus'
  })
}


/* 用户管理 */
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
    url: `/users/${id}`,
    method: 'delete'
  })
}

/* 为用户分配角色 */
export function allotRole(id, rid) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: rid
  })
}


/* 权限管理 */
/* 获取所有权限列表 */
export function getRightsList(type) {
  return request({
    url: `/rights/${type}`
  })
}

/* 获取所有角色列表 */
export function getRolesList() {
  return request({
    url: '/roles'
  })
}

/* 添加角色 */
export function addRole(addRoleForm) {
  return request({
    url: '/roles',
    method: 'post',
    data: addRoleForm
  })
}

/* 根据id获取角色信息 */
export function getRoleMessageById(id) {
  return request({
    url: `/roles/${id}`
  })
}

/* 编辑角色信息 */
export function editRole(id, obj) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data: obj
  })
}

/* 删除角色 */
export function removeRoleById(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

/* 删除角色指定权限 */
export function removeRightById(roleId, rightId) {
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

/* 分配权限 */
export function allotRights(roleId, rids) {
  return request({
    url: `/roles/${roleId}/rights`,
    method: 'post',
    data: rids
  })
}

