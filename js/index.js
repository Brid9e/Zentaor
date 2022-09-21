/*
 * @Author: Joe
 * @Date: 2022-09-20 09:05:32
 * @LastEditTime: 2022-09-21 13:53:39
 * @LastEditors: Joe
 * @FilePath: /Zentaor/js/index.js
 */
let dialog
let d_table
let d_form
window.onload = () => {
  let body = document.body;
  dialog = document.createElement('div')
  d_form = document.createElement('form')
  d_table = document.createElement('table')
  d_form.className = 'main-table table-task skip-iframe-modal'
  d_table.className = 'table has-sort-head table-fixed'
  dialog.className = 'plugin-dialog'
  d_form.appendChild(d_table)
  dialog.appendChild(d_form)
  body.appendChild(dialog)
  // const parser = new DOMParser();
  // const dom = parser.parseFromString(dialog_str, "text/html");
  // console.log(dom)
  // let plutsDialog = document.body.querySelector('.plugin-dialog')
  // console.log(plutsDialog)
  // appsBar.innerHTML = appsBar.innerHTML + '<span class="plugs-text">你好</span>'
  // getDetailAll();
  initListData();
};

async function initListData() {
  let iframe = document.querySelector('iframe');
  const doc = iframe.contentWindow.document
  let nav = doc.querySelector('#subNavbar').children[0]
  const id_arr = getTableAllId(doc)
  let page_data = {}
  await pageStatus(id_arr).then(r => {
    page_data = r
  }).catch(err => {
    console.error(err)
  })
  const today = dayjs().format('YYYY-MM-DD')
  let today_add = []
  let today_h = 0
  Object.keys(page_data).map(key => {
    if (key.split('_')[0] === today) {
      today_add.push(page_data[key])
    }
  })
  let theader = document.createElement('thead')
  theader.innerHTML = '<th>ID</th><th>任务名称</th><th>时间</th><th>已填</th><th>预计剩余</th><th>备注</th>'
  d_table.appendChild(theader)
  d_table.appendChild(handleTableData(today_add))

  let log_history = { ...JSON.parse(localStorage.log_history || '{}') }
  log_history[today] = today_add
  for (let h of today_add) {
    today_h += h.used
  }

  let _li = document.createElement('li')
  let _a = document.createElement('a')
  _li.className = 'today-add'
  _a.className = 'today-add'
  _a.innerHTML = `今日已填<span class="label label-light label-badge" style="pointer-events: none;">${today_h}h</span>`
  _li.appendChild(_a)
  // nav.innerHTML = nav.innerHTML + `<li class="today-add" ></li>`
  nav.appendChild(_li)
  nav.addEventListener('mousemove', (e) => {
    if (e.target.className === 'today-add') {
      dialog.style.display = 'block'
    }
  })
  nav.addEventListener('mouseout', (e) => {
    if (e.target.className === 'today-add') {
      dialog.style.display = 'none'
    }
  })
  localStorage.setItem('log_history', JSON.stringify(log_history));
}

function getStrTag(str) {
  const dom = htmlToDom(str)
  const title = dom.querySelector('h2')?.children[1].innerText
  const id = dom.querySelector('h2')?.children[0].innerText
  const tbody = dom.querySelector('tbody')
  const thead = dom.querySelector('thead')
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

function getDetailAll() {
  axios
    .get(
      `http://zentao.xzxyun.com/zentao/my-work-task-assignedTo-deadline_desc-57-2000-1.html`
    )
    .then((r) => {
      const doc = htmlToDom(r.data)
      console.log(doc)
      const a = pageStatus(getTableAllId(doc))
      a.then(r => {
        console.log(r)
      })
    })
    .catch(err => {
      console.error(err)
    });
}

function htmlToDom(str) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(str, "text/html");
  return dom
}

function getTableAllId(document) {
  let id_arr = [];
  const table = document.querySelector('table#taskTable').children;
  const tBody = table[1];
  for (let tb_item_level of tBody.children) id_arr.push(tb_item_level.attributes.getNamedItem('data-id').value);
  return id_arr
}

async function pageStatus(id_arr) {
  let page_all_status = {}
  for (let id of id_arr) {
    await getDetail(id).then(r => {
      page_all_status = { ...page_all_status, ...r }
    }).catch(err => {
      console.error(err)
    })
  }
  return page_all_status
}
