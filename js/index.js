/*
 * @Author: Joe
 * @Date: 2022-09-20 09:05:32
 * @LastEditTime: 2022-09-20 18:53:34
 * @LastEditors: Joe
 * @FilePath: /ZentaoTest/js/index.js
 */
let dialog
let d_table
window.onload = () => {
  let body = document.body;
  // let dialog_str = '<div class="pluts-dialog"> <span>这是一个弹框</span></div>'
  dialog = document.createElement('div')
  d_form = document.createElement('form')
  d_table = document.createElement('table')
  d_form.className = 'main-table table-task skip-iframe-modal'
  d_table.className = 'table has-sort-head table-fixed'
  dialog.className = 'pluts-dialog'
  d_table.innerHTML = '<thead><th>ID</th><th>任务名称</th><th>今日填报</th><th>预计剩余</th></thead><tbody><tr><td>1234</td><td>添加方案，应用数据没加上BR22015</td><td>4</td><td>8</td></tr></tbody>'
  d_form.appendChild(d_table)
  dialog.appendChild(d_form)
  body.appendChild(dialog)
  // const parser = new DOMParser();
  // const dom = parser.parseFromString(dialog_str, "text/html");
  // console.log(dom)
  // let plutsDialog = document.body.querySelector('.pluts-dialog')
  // console.log(plutsDialog)
  // appsBar.innerHTML = appsBar.innerHTML + '<span class="plugs-text">你好</span>'
  initListData();
};

async function initListData() {
  let iframe = document.querySelector('iframe');
  let tb_arr = [];
  let th_obj = {};
  const doc = iframe.contentWindow.document
  const table = doc.querySelector('table.has-sort-head').children;
  let nav = doc.querySelector('#subNavbar').children[0]
  const tHeader = table[0];
  const tBody = table[1];
  let handle_arr = {};

  for (let index in tHeader.children[0].children) {
    th_obj[index] = tHeader.children[0].children[index].title;
  }

  for (let tb_item_level of tBody.children) {
    let tb_obj = {};
    for (let index in tb_item_level.children) {
      tb_obj[index] =
        tb_item_level.children[index].title || tb_item_level.children[index];
    }
    tb_arr.push(tb_obj);
  }
  let id_arr = []
  for (let handle_item of tb_arr) {
    let tb_handle = {};
    const id = handle_item['0'].innerText.replace(' ', '')
    tb_handle['id'] = id;
    tb_handle['name'] = handle_item['2'].replace(' ', '');
    tb_handle['parentName'] = handle_item['3'];
    tb_handle['overTime'] = handle_item['6'].innerHTML;
    tb_handle['expect'] = Number(handle_item['8'].split(' ')[0]);
    tb_handle['used'] = Number(handle_item['9'].split(' ')[0]);
    tb_handle['surplus'] = Number(handle_item['10'].split(' ')[0]);
    handle_arr[id] = tb_handle;
    id_arr.push(id)
  }
  let page_all_status = {}
  for (let id of id_arr) {
    await getDetail(id).then(r => {
      page_all_status = { ...page_all_status, ...r }
    }).catch(err => {
      console.log(err)
    })
  }
  const today = dayjs().format('YYYY-MM-DD')
  let today_add = []
  let today_h = 0
  Object.keys(page_all_status).map(key => {
    if (key.split('_')[0] === today) {
      today_add.push(page_all_status[key])
    }
  })
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




function getStrTag(str, id) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(str, "text/html");
  const title = dom.querySelector('h2').children[1].innerText
  const tbody = dom.querySelector('tbody')
  let obj = {}
  for (let tr of tbody.children) {
    let _obj = {}
    let key = ''
    for (let index_td in tr.children) {
      _obj[index_td] = tr.children[index_td].innerText
    }
    let __obj = {}
    __obj['id'] = id
    __obj['title'] = title
    __obj['used'] = Number(_obj['2']?.split(' ')[0])
    __obj['time'] = _obj['1']
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
        resolve(getStrTag(r.data, id))
      })
      .catch(err => {
        console.log(err)
        reject(err)
      });
  })
}

