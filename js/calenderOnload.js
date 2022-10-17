let detailPopup
let d_table
let closeBtn
let isEmpty
let year = new Date().getFullYear()
let month = new Date().getMonth() + 1

const calenderBox = document.querySelector('.calendar-box')
const tableBox = document.getElementById('table-box')
const addMonthDom = document.getElementById('add-month')
const subMonthDom = document.getElementById('sub-month')
const addYearDom = document.getElementById('add-year')
const subYearDom = document.getElementById('sub-year')

if (data) {
  if (isEmpty) isEmpty = null
  console.log(year, month)
  tableBox.innerHTML = calendar(year, month)
} else {
  isEmpty = document.createElement('div')
  isEmpty.className = 'table-is-empty'
  isEmpty.innerHTML = '<span class="iconfont icon-sync-off"></span><span class="msg">首次安装需要同步数据</span>'
  tableBox.appendChild(isEmpty)
}

function addMonth() {
  month += 1
  if (month > 12) {
    month = 1
    year += 1
  }
  tableBox.innerHTML = calendar(year, month)
}
function subMonth() {
  month -= 1
  if (month < 1) {
    month = 12
    year -= 1
  }
  tableBox.innerHTML = calendar(year, month)
}

function addYear() {
  year += 1
  tableBox.innerHTML = calendar(year, month)
}
function subYear() {
  year -= 1
  tableBox.innerHTML = calendar(year, month)
}
function getYmd(e) {
  if (e.target.classList.contains('cal-day')) {
    if (detailPopup) {
      calenderBox.removeChild(detailPopup)
    }
    if (d_table) {
      detailPopup.removeChild(d_table)
    }
    detailPopup = document.createElement('div')
    closeBtn = document.createElement('div')
    detailPopup.className = 'detail-popup'
    closeBtn.className = 'close-btn handle-icon'
    closeBtn.innerHTML = '<span class="iconfont icon-arrow-left">'
    detailPopup.appendChild(closeBtn)
    detailPopup.style.top = e.target.offsetTop + 'px'
    detailPopup.style.left = e.target.offsetLeft + 'px'
    detailPopup.style.width = e.target.offsetWidth + 'px'
    detailPopup.style.height = e.target.offsetHeight + 'px'
    calenderBox.appendChild(detailPopup)
    d_table = document.createElement('table')
    d_table.style.tableLayout = 'fixed'
    d_table.className = 'detail-popup-table'
    detailPopup.appendChild(d_table)
    dataToTodayTable(data.all_data[ e.target.attributes[ 'ymd' ].nodeValue ])
    // console.log(data.all_data[e.target.attributes['ymd'].nodeValue])
    // alert(JSON.stringify(data.all_data[e.target.attributes['ymd'].nodeValue]))
    closeBtn.addEventListener('click', clearTable, true)
  }
}

function clearTable() {
  detailPopup.style.transform = 'scale(0)'
}

document.addEventListener('click', getYmd, false)
addMonthDom.addEventListener('click', addMonth, false)
subMonthDom.addEventListener('click', subMonth, false)
addYearDom.addEventListener('click', addYear, false)
subYearDom.addEventListener('click', subYear, false)

function handleTableData(data) {
  let createt_tbody = document.createElement('tbody')
  for (let td_item of data) {
    let tr = document.createElement('tr')
    Object.keys(td_item).map(key => {
      let td = document.createElement('td')
      td.style.overflow = 'hidden'
      td.style.textOverflow = 'ellipsis'
      td.innerText = td_item[ key ]
      tr.appendChild(td)
    })
    createt_tbody.appendChild(tr)
  }
  return createt_tbody
}

function dataToTodayTable(table_data) {
  if (!table_data || table_data.length == 0) {
    let _empty = document.createElement('div')
    _empty.className = 'plugin-empty'
    _empty.innerText = '今日还未填写'
    d_table.appendChild(_empty)
    return
  }
  let theader = document.createElement('thead')
  theader.innerHTML = '<th>ID</th><th width="100px">任务名称</th><th>时间</th><th>已填</th><th>预计剩余</th><th width="80px">备注</th>'
  d_table.appendChild(theader)
  d_table.appendChild(handleTableData(table_data))
}
