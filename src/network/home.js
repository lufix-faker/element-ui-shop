import { request } from './request'

/* 获取左侧菜单数据 */
export function getMenusList() {
  return request({
    url: '/menus'
  })
}


/* 用户管理 --> 用户列表 */
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


/* 权限管理 --> 权限列表 */
/* 获取所有权限列表 */
export function getRightsList(type) {
  return request({
    url: `/rights/${type}`
  })
}


/* 权限管理 --> 角色列表 */
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


/* 商品管理 --> 商品分类 */
/* 获取商品数据 */
export function getCateList(queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}

/* 添加分类 */
export function addCate(form) {
  return request({
    url: '/categories',
    method: 'post',
    data: form
  })
}

/* 根据id查询分类 */
export function getCateById(id) {
  return request({
    url: `/categories/${id}`
  })
}

/* 编辑分类 */
export function editCate(id, obj) {
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data: obj
  })
}

/* 删除分类 */
export function removeCate(id) {
  return request({
    url: `/categories/${id}`,
    method: 'delete'
  })
}


/* 商品管理 --> 分类参数 */
/* 获取参数、属性 */
export function getAttributes(id, params) {
  return request({
    url: `/categories/${id}/attributes`,
    params: params
  })
}

/* 增加参数、属性 */
export function addAttribute(id, obj) {
  return request({
    url: `/categories/${id}/attributes`,
    method: 'post',
    data: obj
  })
}

/* 根据id查询参数、属性 */
export function getAttributesById(id, attrId, obj) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    params: obj
  })
}

/* 修改参数、属性 */
export function editAttribute(id, attrId, obj) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'put',
    data: obj
  })
}

/* 删除参数、属性 */
export function removeAttribute(id, attrId) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'delete'
  })
}


/* 商品管理 --> 商品列表 */
/* 获取商品列表 */
export function getGoodsList(obj) {
  return request({
    url: '/goods',
    params: obj
  })
}

/* 根据商品id删除商品 */
export function removeGoodById(id) {
  return request({
    url: `/goods/${id}`,
    method: 'delete'
  })
}

/* 添加商品 */
export function addGoods(form) {
  return request({
    url: '/goods',
    method: 'post',
    data: form
  })
}


/* 订单管理 -> 订单列表 */
/* 获取订单列表 */
export function getOrdersList(queryInfo) {
  return request({
    url: '/orders',
    params: queryInfo
  })
}

/* 查询物流进度 */
export function getProgress(id) {
  return request({
    url: `/kuaidi/${id}`
  })
}
