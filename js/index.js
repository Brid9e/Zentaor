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
let dialog
let d_table
let d_form
let iframe
let body
let doc
let nav
let today_h = 0
window.onload = () => {
  initDom()
  initLoading()
  initDialog()
  initListData();
};

function initDom() {
  iframe = document.querySelector('iframe');
  doc = iframe.contentWindow.document
  nav = doc.querySelector('#subNavbar').children[0]
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

function initLoading() {
  // 
  let _li = document.createElement('li')
  let _a = document.createElement('a')
  _li.className = 'loading'
  _a.className = 'loading'
  _a.innerHTML = `数据加载中...`
  _li.appendChild(_a)
  // nav.innerHTML = nav.innerHTML + `<li class="today-add" ></li>`
  nav.appendChild(_li)
}


async function initListData() {

  const id_arr = getTableAllId(doc)
  let page_data = {}
  await getPageAllDetails(id_arr).then(r => {
    page_data = r
  }).catch(err => {
    console.error(err)
  })
  const today = dayjs().format('YYYY-MM-DD')
  let today_add = []
  Object.keys(page_data).map(key => {
    if (key.split('_')[0] === today) {
      today_add.push(page_data[key])
      today_h += page_data[key].used
    }
  })
  let theader = document.createElement('thead')
  theader.innerHTML = '<th style="width:80px;">ID</th><th>任务名称</th><th style="width:100px;">时间</th><th style="width:80px;">已填</th><th style="width:80px;">预计剩余</th><th>备注</th>'
  d_table.appendChild(theader)
  d_table.appendChild(handleTableData(today_add))
  loadTodyDataModel()
  eventListener()
  localStorage.setItem('log_history', JSON.stringify(today_add));
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
 * @description: 获取创建以来所有数据（会调取大量接口，你需要一个强悍的公司服务器）
 *
 */
function getDetailAll() {
  axios
    .get(
      `http://zentao.xzxyun.com/zentao/my-work-task-assignedTo-deadline_desc-57-2000-1.html`
    )
    .then((r) => {
      const doc = htmlToDom(r.data)
      const a = getPageAllDetails(getTableAllId(doc))
      a.then(r => {
        console.log(r)
      })
    })
    .catch(err => {
      console.error(err)
    });
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
 * @Author: Joe 
 * @Description: 获取本页所有任务详情的数据
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
  return page_all_status
}

/**
 *
 * @Date: 2022-09-22 21:51:56 
 * @Author: Joe 
 * @Description: 监听事件，控制一些dom的动作
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





//监听background的消息
chrome.runtime.onMessage.addListener(function (senderRequest, sender, sendResponse) {//接收到bg
  console.log('demo已运行');
  var LocalDB = senderRequest.LocalDB;
  console.log(LocalDB);
  if (!!LocalDB) {
    console.log(LocalDB.Content);
    switch (LocalDB.Content) {
      case 'TEST':
        console.log('收到消息了');
        break;
      case 'content':
        console.log('执行操作');
        del()
        break;
    }
  } else {
    console.log(senderRequest)
  }
  sendResponse('已接收')
});
