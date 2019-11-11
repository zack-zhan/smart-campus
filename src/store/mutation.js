const mutations = {
  setSchoolName: (state, name) => {
    state.schoolName = name
  },

  setAddGradeDirector: (state, name) => {
    state.grade.addGradeDirector = name
  },
  setEditGradeDirector: (state, name) => {
    state.grade.editGradeDirector = name
  },
  setAddClassDirector: (state, name) => {
    state.grade.addClassDirector = name
  },
  setEditClassDirector: (state, name) => {
    state.grade.editClassDirector = name
  },

  setNoticeMode: (state, mode) => {
    state.notice.mode = mode
  },
  setNoticeTitle: (state, title) => {
    state.notice.title = title
  },
  setNoticeContent: (state, content) => {
    state.notice.content = content
  },

  setNoticeTeacher: (state, item) => {
    if (state.notice.teacher.findIndex(x => x.key === item.key) === -1) {
      state.notice.teacher.push(item)
    }
  },
  setNoticeGroup: (state, item) => {
    state.notice.group.push(item)
  },
  setNoticePatriarch: (state, title) => {
    state.notice.patriarch.push(title)
  },
  clearTeacher: state => {
    state.notice.teacher = []
  },
  clearNoticeGroup: state => {
    state.notice.group = []
  },
  clearNoticePatriarch: state => {
    state.notice.patriarch = []
  },
  clearReceivers: state => {
    state.notice.teacher = []
    state.notice.group = []
    state.notice.patriarch = []
  },

  setBulletingroupTeacher: (state, item) => {
    if (state.bulletingroup.teacher.findIndex(x => x.key === item.key) === -1) {
      state.bulletingroup.teacher.push(item)
    }
  },
  clearBulletingTeacher: state => {
    state.bulletingroup.teacher = []
  },
  editBulletingroupTeacher: (state, item) => {
    if (state.bulletingroup.editTeacher.findIndex(x => x.key === item.key) === -1) {
      state.bulletingroup.editTeacher.push(item)
    }
  },
  clearBulletingroupTeacher: state => {
    state.bulletingroup.editTeacher = []
  },

  setAddRecord: (state, item) => {
    state.record.addRecord.push(item)
  },
  clearAddRecord: state => {
    state.record.addRecord = []
  },
  setAddCustomRecord: (state, item) => {
    state.record.addCustomRecord.push(item)
  },
  clearAddCustomRecord: state => {
    state.record.addCustomRecord = []
  }
}

export default mutations
