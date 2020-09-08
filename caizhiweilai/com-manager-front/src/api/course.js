import request from 'common/js/request'
import { COS } from './constants'
// 课程编码
export const coursecode = (data) => {
    return request({
      url: COS + '/front/pub/code/get/questioncode',
      method: 'post',
      params: data
    })
  }
// 创建课程
export const createcourse = (data) => {
    return request({
      url: COS + '/front/course/save',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      params: data
    })
  }

// 创建课程
export const courseList = (data) => {
    return request({
      url: COS + '/front/course/list',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      params: data
    })
  }
//   获取课程详情通过ID
export const coursedetails = (data) => {
    return request({
      url: COS + '/front/course/get',
      method: 'get',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: data
    })
  }
// 编辑课程 /front/course/update
export const editcourse = (data) => {
    return request({
      url: COS + '/front/course/update',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      params: data
    })
  }
//   删除课程
export const delcourse = (data) => {
    return request({
      url: COS + '/front/course/del',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      params: data
    })
  }
//   大纲列表
export const dgList = (data) => {
    return request({
      url: COS + '/front/outline/listbycoursrId',
      method: 'get',
      params: data
    })
  }
// 添加大纲
export const define = (data) => {
    return request({
      url: COS + '/front/outline/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   根据大纲ID获取任务列表
export const syllabus = (data) => {
    return request({
      url: COS + '/front/task/byoutlineid',
      method: 'get',
      params: data
    })
  }
//   任务类型
export const tastType = (data) => {
    return request({
      url: COS + '/front/task/type/list',
      method: 'get',
      params: data
    })
  }
//   新建任务
export const newTast = (data) => {
    return request({
      url: COS + '/front/task/save',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   实操系统列表
export const scxtList = (data) => {
    return request({
      url: COS + '/front/operation/list',
      method: 'get',
      params: data
    })
  }
//   选择试卷列表
export const testPaper = (data) => {
    return request({
      url: COS + '/front/paper/list',
      method: 'get',
      params: data
    })
  }
//   根据任务ID获取任务详情
export const byIdDetails = (data) => {
    return request({
      url: COS + '/front/task/byPrimaryKey',
      method: 'get',
      params: data
    })
  }
//   编辑任务
export const editTast = (data) => {
    return request({
      url: COS + '/front/task/update',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   编辑大纲
export const editGg = (data) => {
    return request({
      url: COS + '/front/outline/update',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   删除大纲
export const delGg = (data) => {
    return request({
      url: COS + '/front/outline/del',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
//   资源文件列表
export const zywj = (data) => {
    return request({
      url: COS + '/front/task/Knowledgefiles',
      method: 'get',
      params: data
    })
  }
  // 删除任务下的资源文件
  export const delFiles = (data) => {
    return request({
      url: COS + '/front/task/delResourceFile',
      method: 'get',
      params: data
    })
  }
  // 查询试卷列表
  export const querySjList = (data) => {
    return request({
      url: COS + '/front/paper/list',
      method: 'get',
      params: data
    })
  }
  // 统计任务下面的资源文件个数
  export const tjNumber = (data) => {
    return request({
      url: COS + '/front/task/statistics',
      method: 'get',
      params: data
    })
  }
  // 知识点文件
  export const obtainmc = (data) => {
    return request({
      url: COS + '/front/task/queryResNameByIds',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
  // l  根据ID删除任务
  export const delTast = (data) => {
    return request({
      url: COS + '/front/task/del',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
  // 保存企业信息
  // export const saveInfo = (data) => {
  //   return request({
  //     url: COS + '/front/enterprise/information/save',
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     params: data
  //   })
  // }
  // 任务拖拽排序
  export const dragSortTable = (data) => {
    return request({
      url: COS + '/front/task/updateSort',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    })
  }
    // 获取企业信息
    export const getInfo = (data) => {
      return request({
        url: COS + '/front/enterprise/information/get',
        method: 'get',
        params: data
      })
    }
    // 获取个性化资源文件信息
    export const fileInfo = (data) => {
      return request({
        url: COS + '/front/task/personalizefile/info',
        method: 'get',
        params: data
      })
    }
    // 任务绑定个性化文件
    export const personaupdate = (data) => {
      return request({
        url: COS + '/front/task/personalizefile/update',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        params: data
      })
    }
    // 查询一级行业
    export function getFirstIndustry () {
      return request({
          url: COS + '/front/national/standard/allnational',
          method: 'get'
      })
    }
    // 查询二三级行业
    export function getOtherIndustry (data) {
      return request({
          url: COS + '/front/national/standard/querybypid?pid=' + data,
          method: 'get'
      })
    }
    // 导入课程
    export function exportCourse (data) {
      return request({
          url: COS + '/front/course/exporturl',
          method: 'get',
          params: data
      })
    }
    // 根据课程ID查询企业信息，排除已经绑定的
    export const bycourseidInfo = (data) => {
      return request({
        url: COS + '/front/company/info/bycourseid',
        method: 'get',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: data
      })
    }
    // 查询所有有结束节点的账套列表
    export const endList = (data) => {
      return request({
        url: COS + '/front/case/end/list',
        method: 'get',
        params: data
      })
    }
    // 功能实训
    export const alllistFunc = (data) => {
      return request({
        url: COS + '/front/train/func/alllist',
        method: 'get',
        params: data
      })
    }
    // 表单信息下拉列表
    export const infoFrom = (data) => {
      return request({
        url: COS + '/front/task/form/list/info',
        method: 'get',
        params: data
      })
    }
    // 表单删除
    export const delFrom = (data) => {
      return request({
        url: COS + '/front/task/del/form',
        method: 'get',
        params: data
      })
    }
    // 大纲排序
    export const outlineSort = (data) => {
      return request({
        url: COS + '/front/outline/updateSort',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        params: data
      })
    }
    // 删除任务下的账套信息
    export const delAccount = (data) => {
      return request({
        url: COS + '/front/task/del/account',
        method: 'get',
        params: data
      })
    }
