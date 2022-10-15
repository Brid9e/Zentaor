/*
 * @author: Joe
 * @date: 2022-09-20 09:05:32
 * @LastEditTime: 2022-09-21 13:53:39
 * @LastEditors: Joe
 * @FilePath: /Zentaor/js/index.js
 */

/**
 *
 * @date: 2022-09-22 21:12:27 
 * @author: Joe 
 * @description: 初始化一些全局使用的数据
 *
 */

// chrome.runtime.onInstalled.addListener(() => {

//   // console.log(window.localStorage)

//   // console.log('Default background color set to %cgreen', `color: ${color}`);
// });
// window.addEventListener('click', () => {
//   console.log(window.location.href)
// })
console.log('is loading...')
let dialog
let d_table
let d_form
let iframe
let body
let doc
let nav
let today_h = 0
let today
let allPage = 0
let allItem = 0
let pageSize = 0
let _history = {}
let isChange = false
window.onload = () => {
  chrome.syncDatas = (type) => {
    const _href = window.location.href
    if (_href !== 'http://zentao.xzxyun.com/zentao/my-work-task.html') {
      if (!type) return
      alert('您只能在任务界面同步数据！')
      return
    }
    today_h = 0
    _history = {}
    if (nav) {
      nav.removeChild(nav.lastElementChild)
    }
    today = dayjs().format('YYYY-MM-DD')
    initDom()
    initLoading()
    initDialog()
    initListData()
  }
  chrome.syncDatas()
};


async function initDom() {
  iframe = document.querySelector('iframe');
  doc = iframe.contentWindow.document
  nav = doc.querySelector('#subNavbar').children[0]
  allPage = doc.querySelector('.pager').children[4].children[0].children[1].innerText
  allItem = doc.querySelector('.pager').children[0].children[0].children[0].innerText
  pageSize = doc.querySelector('.pager').children[1].children[0].children[0].children[0].innerText
  iframe.addEventListener('load', async () => {
    const _href = window.location.href
    if (_href !== 'http://zentao.xzxyun.com/zentao/my-work-task.html') return
    chrome.syncDatas(false)
  })
}

function initDialog() {
  body = document.body;
  dialog = document.createElement('div')
  d_form = document.createElement('form')
  d_table = document.createElement('table')
  d_form.className = 'main-table table-task skip-iframe-modal'
  d_table.className = 'table has-sort-head table-fixed'
  dialog.className = 'plugin-dialog'
  d_form.appendChild(d_table)
  dialog.appendChild(d_form)
  body.appendChild(dialog)
}

async function initLoading() {
  // 
  let _li = document.createElement('li')
  let _a = document.createElement('a')
  _li.className = 'loading'
  _a.className = 'loading'
  _a.innerHTML = `数据加载中...`
  _li.appendChild(_a)
  // nav.innerHTML = nav.innerHTML + `<li class="today-add" ></li>`
  nav.appendChild(_li)
  console.log(nav)
}

/**
 *
 * @Date: 2022-09-25 21:14:08 
 * @author: Joe 
 * @description: 初始化数据，它会获取所有分页的数据，并进一步处理
 *
 */
async function initListData() {
  let id_arr = []
  let today_add = []
  for (let i = 1; i <= allPage; i++) {
    const id_item = await getDetailAll(i)
    id_arr = [...id_arr, ...id_item]
  }
  let page_data = {}
  await getPageAllDetails(id_arr).then(r => {
    page_data = r
  }).catch(err => {
    console.error(err)
  })
  Object.keys(page_data).map(key => {
    _history[key.split('_')[0]] ? _history[key.split('_')[0]].push(page_data[key]) : _history[key.split('_')[0]] = [page_data[key]]
  })
  if (_history[today]) {
    today_add = _history[today]
  }
  dataToTodayTable(today_add)
  loadTodyDataModel()
  eventListener()
  saveToLocal(_history)
  saveMonthLocal(_history)
}


/**
 *
 * @date: 2022-09-22 21:47:08 
 * @author: Joe 
 * @description: Dom列表转为json数据
 *
 */
function getStrTag(str) {
  const dom = htmlToDom(str)
  const title = dom.querySelector('h2')?.children[1].innerText
  const id = dom.querySelector('h2')?.children[0].innerText
  const tbody = dom.querySelector('tbody')
  // const thead = dom.querySelector('thead')
  let obj = {}
  for (let tr of tbody.children) {
    let _obj = {}
    for (let index_td in tr.children) {
      _obj[index_td] = tr.children[index_td].innerText
    }
    let __obj = {}
    __obj['id'] = id
    __obj['title'] = title
    __obj['time'] = _obj['1']
    __obj['used'] = Number(_obj['2']?.split(' ')[0])
    __obj['surplus'] = Number(_obj['3']?.split(' ')[0])
    __obj['desc'] = _obj['4']
    obj[`${_obj[1]}_${Math.random()}`] = __obj
  }
  Object.keys(obj).map(key => {
    if (!dayjs(key.split('_')[0], 'YYYY-MM-DD').isValid()) delete obj[key]
  })
  return obj
}


/**
 *
 * @date: 2022-09-22 21:46:49 
 * @author: Joe 
 * @description: 获取每项任务的详情列表
 *
 */
function getDetail(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `http://zentao.xzxyun.com/zentao/task-recordEstimate-${id}.html?onlybody=yes`
      )
      .then((r) => {
        resolve(getStrTag(r.data))
      })
      .catch(err => {
        console.error(err)
        reject(err)
      });
  })
}

/**
 *
 * @date: 2022-09-22 21:47:51 
 * @author: Joe 
 * @description: 处理表格数据，并插入表格
 *
 */
function handleTableData(data) {
  let createt_tbody = document.createElement('tbody')
  for (let td_item of data) {
    let tr = document.createElement('tr')
    Object.keys(td_item).map(key => {
      let td = document.createElement('td')
      td.innerText = td_item[key]
      tr.appendChild(td)
    })
    createt_tbody.appendChild(tr)
  }
  return createt_tbody
}

/**
 *
 * @date: 2022-09-22 21:48:15 
 * @author: Joe 
 * @description: 获取分页下的某一页所有数据，用于总页数循环获取所有数据 resolve一个值为id的LIST，如：['1233', '1234', '1526', ...]
 *
 */
async function getDetailAll(_page) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `http://zentao.xzxyun.com/zentao/my-work-task-assignedTo-deadline_desc-${allItem}-${pageSize}-${_page}.html`
      )
      .then((r) => {
        const doc = htmlToDom(r.data)
        const _idList = getTableAllId(doc)
        resolve(_idList)
      })
      .catch(err => {
        reject(err)
      });
  })

}


/**
 *
 * @date: 2022-09-22 21:49:00 
 * @author: Joe 
 * @description: Html字符串转为存在#document根节点的完整dom结构
 *
 */
function htmlToDom(str) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(str, "text/html");
  return dom
}

/**
 *
 * @date: 2022-09-22 21:50:21 
 * @author: Joe 
 * @description: 获取本页所有任务Id
 *
 */
function getTableAllId(document) {
  let id_arr = [];
  const table = document.querySelector('table#taskTable').children;
  const tBody = table[1];
  for (let tb_item_level of tBody.children) id_arr.push(tb_item_level.attributes.getNamedItem('data-id').value);
  return id_arr
}


/**
 *
 * @Date: 2022-09-22 21:52:10 
 * @author: Joe 
 * @description: 获取本页所有任务详情的数据
 *
 */
async function getPageAllDetails(id_arr) {
  let page_all_status = {}
  for (let id of id_arr) {
    await getDetail(id).then(r => {
      page_all_status = { ...page_all_status, ...r }
    }).catch(err => {
    })
  }
  // console.log(page_all_status)
  return page_all_status
}

/**
 *
 * @Date: 2022-09-22 21:51:56 
 * @author: Joe 
 * @description: 监听事件，控制一些dom的动作
 *
 */
function eventListener() {
  nav.addEventListener('mouseenter', (e) => {
    if (e.target.className === 'today-add') {
      dialog.style.display = 'block'
      dialog.style.top = e.target.parentNode.offsetHeight + 55 + 'px'
      dialog.style.left = e.target.parentNode.offsetLeft - 400 + 'px'
    }
  }, true)
  nav.addEventListener('mouseout', (e) => {
    if (e.target.className === 'today-add') {
      dialog.style.display = 'none'
    }
  })
}

/**
 *
 * @date: 2022-09-22 21:45:51 
 * @author: Joe 
 * @description: 生成【今日已填】菜单项
 *
 */
function loadTodyDataModel() {
  let _li = document.createElement('li')
  let _a = document.createElement('a')
  _li.className = 'today-add'
  _a.className = 'today-add'
  _a.innerHTML = `今日已填<span class="label label-light label-badge" style="pointer-events: none;">${today_h}h</span>`
  _li.appendChild(_a)
  nav.removeChild(nav.lastElementChild)
  // nav.innerHTML = nav.innerHTML + `<li class="today-add" ></li>`
  nav.appendChild(_li)
}

/**
 *
 * @Date: 2022-09-23 00:15:59 
 * @author: Joe 
 * @description: 将当日的填报记录存入storage
 *
 */
function saveToLocal(_history) {
  if (!localStorage.log_history) {
    localStorage.setItem('log_history', JSON.stringify(_history));
  } else {
    localStorage['log_history'] = JSON.stringify(_history)
  }
}


/**
 *
 * @Date: 2022-10-14 23:09:36 
 * @Author: Joe 
 * @Description: 计算每月总工时，并存入本地缓存
 *
 */
function saveMonthLocal(_history) {
  const _obj = {}
  const _obj_day = {}
  Object.keys(_history).map(key => {
    let time_add = 0
    let time_add_day = 0
    for (let val of _history[key]) {
      time_add += val.used
      time_add_day += val.used
    }
    !_obj_day[key] ? _obj_day[key] = time_add_day : _obj_day[key] = _obj_day[key] + time_add_day
    const month_keys = key.split('-')
    const month_item = month_keys[0] + '-' + month_keys[1]
    !_obj[month_item] ? _obj[month_item] = time_add : _obj[month_item] = _obj[month_item] + time_add
  })
  const _finalData = { month_data: _obj, day_data: _obj_day }
  localStorage.setItem('log_month_history', JSON.stringify(_finalData))

  // chrome.runtime.sendMessage(_finalData, (res) => { console.log(res) });
}

/**
 *
 * @Date: 2022-09-25 20:51:24 
 * @author: Joe 
 * @description: 数据插入表格
 *
 */
function dataToTodayTable(today_add) {
  if (!today_add || today_add.length == 0) {
    let _empty = document.createElement('div')
    _empty.className = 'plugin-empty'
    _empty.innerText = '今日还未填写'
    d_table.appendChild(_empty)
    return
  }
  let theader = document.createElement('thead')
  theader.innerHTML = '<th style="width:80px;">ID</th><th>任务名称</th><th style="width:100px;">时间</th><th style="width:80px;">已填</th><th style="width:80px;">预计剩余</th><th>备注</th>'
  d_table.appendChild(theader)
  d_table.appendChild(handleTableData(today_add))
}