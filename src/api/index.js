// api接口文件
import axios from 'axios'
import qs from 'qs'
import { notification } from 'ant-design-vue'
import { apiHost } from '@/utils/config'
import { getCookie } from '@/utils/cookies'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// 通过axios.defaults.baseURL设置全局的基准路径
axios.defaults.baseURL = apiHost

// 设置请求拦截
axios.interceptors.request.use(function (config) {
  // 拦截到请求后，首先判断是否有token，如果有的话，就将它取出来，放进config.headers里面
  const token = getCookie('token')
  const corpId = getCookie('corpId')

  const token2 = sessionStorage.getItem('token')
  const corpId2 = sessionStorage.getItem('corpId')
  if (token) {
    config.headers['Authorization'] = token
    if (corpId) {
      config.headers['CorpId'] = corpId
    }
  } else if (token2) {
    config.headers['Authorization'] = token2
    if (corpId2) {
      config.headers['CorpId'] = corpId2
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  const res = error.response
  const errortext = codeMessage[res.status] || res.statusText
  notification.error({
    message: `服务器错误：${errortext}(STATUS CODE:${res.status})`,
    description: errortext
  })
  error.name = res.status.toString()
  error.message = errortext
  return error
})

export const token = (obj) => axios.get(`/auth/oauth/token?${qs.stringify(obj)}`).then(res => res.data)

export const rolelist = () => axios.get(`/system/role/list`).then(res => res.data)

// export const authlist = (param) => axios.get(`/system/auth/page?${qs.stringify(param)}`).then(res => res.data)
export const authlist = () => axios.get('/system/auth/list').then(res => res.data)

export const staffrolelist = (param) => axios.get(`/school/staff/getrolelist?${qs.stringify(param)}`).then(res => res.data)

export const addstaffrole = (param) => axios.post('/school/staff/addrole', param).then(res => res.data)

export const deletestaffrole = (id) => axios.delete(`/school/staff/deleterole?id=${id}`).then(res => res.data)

export const departmentauthlist = (param) => axios.get(`/school/department/getauthlist?${qs.stringify(param)}`).then(res => res.data)

export const adddepartmentauth = (obj) => axios.post('/school/department/addauth', obj).then(res => res.data)

export const deletedepartmentauth = (id) => axios.delete(`/school/department/deleteauth?id=${id}`).then(res => res.data)

export const corporationlist = () => axios.get('/school/corporation/list').then(res => res.data)

// 获取部门列表
export const departmentlist = () => axios.get('/school/department/list').then(res => res.data)
// 获取部门信息
export const departmentone = (id) => axios.get('/school/department/one?departmentid=' + id).then(res => res.data)
// 修改部门信息
export const departmentupdate = (obj) => axios.post('/school/department/update', obj).then(res => res.data)
// 删除部门信息
export const departmentdelete = (id) => axios.delete('/school/department/delete?departmentid=' + id).then(res => res.data)
// 添加子部门信息
export const departmentcreate = (obj) => axios.post('/school/department/create', obj).then(res => res.data)

export const departmentbyparentid = (id) => axios.get(`/school/department/listbyparentid?departmentid=${id}`).then(res => res.data)

export const getdepartmentandstafflist = () => axios.get('/school/department/getdepartmentandstafflist').then(res => res.data)

// 获取员工列表
export const stafflist = (obj) => axios.get(`/school/staff/list?${qs.stringify(obj)}`).then(res => res.data)

export const listbydepartmentid = (id) => axios.get('/school/staff/listbydepartmentid?depId=' + id).then(res => res.data)
// 获取员工列表
export const staffpage = (obj) => axios.get(`/school/staff/page?${qs.stringify(obj)}`).then(res => res.data)
// 添加员工信息
export const staffcreate = (obj) => axios.post('/school/staff/create', obj).then(res => res.data)
// 批量删除员工信息
export const staffbatchdelete = (obj) => axios.post('/school/staff/batchdelete', obj).then(res => res.data)
// 获取员工详情
export const staffone = (id) => axios.get('/school/staff/one?staffid=' + id).then(res => res.data)
// 编辑员工信息
export const staffupdate = (obj) => axios.post('/school/staff/update', obj).then(res => res.data)
// 删除员工详情
export const staffdelete = (id) => axios.delete('/school/staff/delete?staffid=' + id).then(res => res.data)

// 获取角色列表
export const rolepage = (obj) => axios.get(`/system/role/page?pageIndex=${obj.pageIndex}&pageSize=${obj.pageSize}`).then(res => res.data)
// 获取角色详情
export const roleone = (id) => axios.get('/system/role/one?id=' + id).then(res => res.data)
// 删除角色详情
export const roledelete = (id) => axios.delete('/system/role/delete?id=' + id).then(res => res.data)

// 获取学生列表
export const studentlist = () => axios.get('/school/student/list').then(res => res.data)
// 获取学生分页列表
export const studentpage = (obj) => axios.get(`/school/student/page?${qs.stringify(obj)}`).then(res => res.data)
export const studentpage2 = (obj) => axios.get(`/school/student/page?pageIndex=${obj.pageIndex}&pageSize=${obj.pageSize}&classId=${obj.classId}`).then(res => res.data)
// 新增学生基础信息
export const studentcreate = (obj) => axios.post('/school/student/create', obj).then(res => res.data)
// 获取学生基础信息
export const studentone = (id) => axios.get('/school/student/one?studentid=' + id).then(res => res.data)
// 更新学生基础信息
export const studentupdate = (obj) => axios.post('/school/student/update', obj).then(res => res.data)
// 获取学生监护人列表
export const studentkeeperlist = (id) => axios.get('/school/studentkeeper/list?studentId=' + id).then(res => res.data)
export const studentkeeperall = () => axios.get('/school/studentkeeper/all').then(res => res.data)
export const getstudentkeeperandclass = () => axios.get('/school/studentkeeper/getstudentkeeperandclass').then(res => res.data)
// 新增学生监护人
export const studentkeepercreate = (obj) => axios.post('/school/studentkeeper/create', obj).then(res => res.data)
// 删除学生监护人列表
export const studentkeeperdelete = (id) => axios.delete('/school/studentkeeper/delete?studentKeeperId=' + id).then(res => res.data)
// 获取监护人详细信息
export const studentkeeperone = (id) => axios.get('/school/studentkeeper/one?keeperid=' + id).then(res => res.data)
// 更新监护人详细信息
export const studentkeeperupdate = (obj) => axios.post('/school/studentkeeper/update', obj).then(res => res.data)

// 老师确认入学
export const confirmEntrance = (ids) => axios.get('/school/originstudent/confirmEntrance?originStudentIds=' + ids).then(res => res.data)
// 获取入学管理列表
export const originstudentpage = (obj) => axios.get(`/school/originstudent/page?${qs.stringify(obj)}`).then(res => res.data)
// 根据招生id获取学生监护人列表
export const getStudentKeeperList = (id) => axios.get('/school/originstudent/getStudentKeeperList?originStudentid=' + id).then(res => res.data)
// 新增学生单个录入
export const originstudentcreate = (obj) => axios.post('/school/originstudent/create', obj).then(res => res.data)
// 获取学生录入信息
export const originstudentone = (obj) => axios.get(`/school/originstudent/one?originstudentid=${obj.id}&entranceStats=${obj.entranceStats}`).then(res => res.data)
// 更新学生录入信息
export const originstudentupdate = (obj) => axios.post('/school/originstudent/update', obj).then(res => res.data)
// 删除学生录入信息
export const originstudentdelete = (id) => axios.delete('/school/originstudent/delete?originstudentid=' + id).then(res => res.data)

export const exportStudentTemplates = () => axios.get('/school/originstudent/exportStudentTemplates').then(res => res.data)

export const exportsplitclasses = () => axios.get('/school/originstudent/exportsplitclasses').then(res => res.data)

export const importsplitclasses = (key) => axios.get(`/school/originstudent/importsplitclasses?osskey=${key}`).then(res => res.data)

export const exportoriginstudent = () => axios.get('/school/originstudent/exportoriginstudent').then(res => res.data)

export const importsplitdormitory = (key) => axios.get(`/school/originstudent/importsplitdormitory?osskey=${key}`).then(res => res.data)

export const importoriginstudent = (key) => axios.get(`/school/originstudent/importoriginstudent?osskey=${key}`).then(res => res.data)
export const importphotos = (key) => axios.get(`/school/originstudent/importphotos?osskey=${key}`).then(res => res.data)
export const aliOSSSignature = () => axios.get(`/auth/oauth/aliOSSSignature`).then(res => res.data)

// 获取学生操作指引列表
export const processlist = () => axios.get('/school/process/list').then(res => res.data)

export const batchinsertprocesslist = (obj) => axios.post('/school/process/batchInsertProcess', obj).then(res => res.data)

// 创建入学时间
export const entrancemanagecreate = (obj) => axios.post('/school/entrancemanage/create', obj).then(res => res.data)
// 获取入学时间
export const getentrancemanage = (id) => axios.get('/school/entrancemanage/getentrancemanage?corpId=' + id).then(res => res.data)
// 修改入学时间
export const entrancemanageupdate = (obj) => axios.post('/school/entrancemanage/update', obj).then(res => res.data)
// 查询当前入学阶段信息
export const getentrancestageinfo = (id) => axios.get('/school/originstudent/getentrancestageinfo?corpId=' + id).then(res => res.data)
// 获取学生相关总人数
export const countStudentTotal = (step) => axios.get('/school/originstudent/countStudentTotal?entranceStage=' + step).then(res => res.data)
// 家长阶段重新入学
export const reEnrollment = (id) => axios.get('/school/originstudent/reEnrollment?originStudentIds=' + id).then(res => res.data)

// 获取年级分页列表
export const gradepage = (obj) => axios.get(`/school/grade/page?pageIndex=${obj.pageIndex}&pageSize=${obj.pageSize}`).then(res => res.data)
// 添加年级信息
export const gradecreate = (obj) => axios.post('/school/grade/create', obj).then(res => res.data)
// 获取年级列表
export const gradelist = () => axios.get('/school/grade/list').then(res => res.data)
// 添加班级信息
export const classcreate = (obj) => axios.post('/school/class/create', obj).then(res => res.data)
// 获取年级详情
export const gradeone = (id) => axios.get('/school/grade/one?gradeid=' + id).then(res => res.data)
// 更新年级信息
export const gradeupdate = (obj) => axios.post('/school/grade/update', obj).then(res => res.data)
// 删除年级详情
export const gradedelete = (id) => axios.delete('/school/grade/delete?gradeid=' + id).then(res => res.data)
// 获取班级列表
export const classlist = () => axios.get('/school/class/list').then(res => res.data)
// 获取班级详情
export const classone = (id) => axios.get('/school/class/one?classid=' + id).then(res => res.data)
// 更新班级信息
export const classupdate = (obj) => axios.post('/school/class/update', obj).then(res => res.data)
// 删除班级详情
export const classdelete = (id) => axios.delete('/school/class/delete?classid=' + id).then(res => res.data)
// 获取班级列表
export const classlistbygradeid = (id) => axios.get('/school/class/listbygradeid?gradeid=' + id).then(res => res.data)
// 升级
export const upgradeGrade = () => axios.get('/school/grade/upgradeGrade').then(res => res.data)

// 获取宿舍列表
export const dormitorylist = () => axios.get('/school/dormitoryPartition/listbyparentid').then(res => res.data)
// 获取分区列表
export const dormitoryPartitionlist = () => axios.get('/school/dormitoryPartition/list').then(res => res.data)
export const dormitoryPartitionpage = (obj) => axios.get(`/school/dormitoryPartition/page?pageIndex=${obj.pageIndex}&pageSize=${obj.pageSize}`).then(res => res.data)

export const listbyparentid = () => axios.get('/school/dormitoryPartition/listbyparentid').then(res => res.data)
// 添加分区
export const dormitoryPartitioncreate = (obj) => axios.post('/school/dormitoryPartition/create', obj).then(res => res.data)
// 添加宿舍
export const dormitorycreate = (obj) => axios.post('/school/dormitory/create', obj).then(res => res.data)
// 查看分区详情
export const dormitoryPartitionone = (id) => axios.get('/school/dormitoryPartition/one?id=' + id).then(res => res.data)
// 查看宿舍详情
export const dormitoryone = (id) => axios.get('/school/dormitory/one?id=' + id).then(res => res.data)
// 编辑分区
export const dormitoryPartitionupdate = (obj) => axios.post('/school/dormitoryPartition/update', obj).then(res => res.data)
// 编辑分区
export const dormitoryupdate = (obj) => axios.post('/school/dormitory/update', obj).then(res => res.data)
// 删除分区
export const dormitoryPartitiondelete = (id) => axios.delete('/school/dormitoryPartition/delete?id=' + id).then(res => res.data)
// 删除宿舍
export const dormitorydelete = (id) => axios.delete('/school/dormitory/delete?id=' + id).then(res => res.data)

// 获取德育汇总信息
export const getSummaryRecordByStudentId = (id) => axios.get('/moraledu/records/getSummaryRecordByStudentId?studentid=' + id).then(res => res.data)
// 获取德育记录分页列表
export const getRecordListPage = (obj) => axios.post('/moraledu/records/getRecordListPage', obj).then(res => res.data)
// 添加德育记录
export const recordsCreate = (obj) => axios.post('/moraledu/records/create', obj).then(res => res.data)
// 添加自定义德育记录
export const customCreate = (obj) => axios.post('/moraledu/records/customCreate', obj).then(res => res.data)
// 获取单个德育记录详情
export const recordsOne = (id) => axios.get('/moraledu/records/one?recordId=' + id).then(res => res.data)
// 撤销德育记录
export const revoke = (obj) => axios.put(`/moraledu/records/revoke?recordid=${obj.recordid}&cancelReason=${obj.cancelReason}`).then(res => res.data)

export const exportRecord = (obj) => axios.post('/moraledu/records/exportRecord', obj).then(res => res.data)
export const exportAllRecord = (obj) => axios.post('/moraledu/records/exportAllRecord', obj).then(res => res.data)

// 获取德育细则分组
export const groupsAll = () => axios.get('/moraledu/groups/all').then(res => res.data)
// 添加德育细则分组
export const groupsCreate = (obj) => axios.post('/moraledu/groups/create', obj).then(res => res.data)
// 获取单个德育细则分组
export const groupsOne = (id) => axios.get('/moraledu/groups/one?id=' + id).then(res => res.data)
// 更新德育细则分组
export const groupsUpdate = (obj) => axios.post('/moraledu/groups/update', obj).then(res => res.data)
// 删除德育细则分组
export const groupsDelete = (id) => axios.delete('/moraledu/groups/delete?id=' + id).then(res => res.data)
// 获取德育细则列表
export const rulesAllbygroupid = (id) => axios.get('/moraledu/rules/allbygroupid?groupId=' + id).then(res => res.data)
// 获取德育细则分页列表
export const rulesPage = (obj) => axios.post('/moraledu/rules/page', obj).then(res => res.data)
// 添加德育细则
export const rulesCreate = (obj) => axios.post('/moraledu/rules/create', obj).then(res => res.data)
// 获取单个德育细则
export const rulesOne = (id) => axios.get('/moraledu/rules/one?ruleId=' + id).then(res => res.data)
// 更新德育细则
export const rulesUpdate = (obj) => axios.post('/moraledu/rules/update', obj).then(res => res.data)
// 删除德育细则
export const rulesDelete = (id) => axios.delete('/moraledu/rules/delete?ruleId=' + id).then(res => res.data)
// 批量删除德育细则
export const deleteBatch = (ids) => axios.delete('/moraledu/rules/deletebatch?ruleids=' + ids).then(res => res.data)

// 获取公告历史列表
export const noticehistorypage = (obj) => axios.get(`/message/noticehistory/page?pageIndex=${obj.pageIndex}&pageSize=${obj.pageSize}`).then(res => res.data)
// 获取公告历史详情
export const noticehistoryone = (id) => axios.get('/message/noticehistory/one?noticeHistoryid=' + id).then(res => res.data)

// 获取公告列表
export const noticetemplateslist = () => axios.get('/message/noticetemplates/list').then(res => res.data)
// 添加公告信息
export const noticetemplatescreate = (obj) => axios.post('/message/noticetemplates/create', obj).then(res => res.data)
// 获取公告详情
export const noticetemplatesone = (id) => axios.get('/message/noticetemplates/one?noticeTemplatesId=' + id).then(res => res.data)
// 修改公告信息
export const noticetemplatesupdate = (obj) => axios.post('/message/noticetemplates/update', obj).then(res => res.data)
// 发送公告信息
export const noticehistorycreate = (obj) => axios.post('/message/noticehistory/create', obj).then(res => res.data)

// 获取公告组列表
export const noticegrouppage = (obj) => axios.get(`/message/noticegroup/page?pageIndex=${obj.pageIndex}&pageSize=${obj.pageSize}`).then(res => res.data)
export const noticegrouplist = (obj) => axios.get('/message/noticegroup/list').then(res => res.data)
// 创建公告组信息
export const noticegroupcreate = (obj) => axios.post('/message/noticegroup/create', obj).then(res => res.data)
// 获取公告组信息
export const noticegroupid = (id) => axios.get('/message/noticegroup/one?id=' + id).then(res => res.data)
// 修改公告组信息
export const noticegroupupdate = (obj) => axios.post('/message/noticegroup/update', obj).then(res => res.data)
// 删除公告组信息
export const noticegroupdelete = (id) => axios.delete('/message/noticegroup/delete?id=' + id).then(res => res.data)
