window.onload = () => {
  let iframe = document.querySelector('iframe')
  let tb_arr = []
  let th_obj = {}
  const table = iframe.contentWindow.document.querySelector('table.has-sort-head').children
  const tHeader = table[0]
  const tBody = table[1]
  let handle_arr = {}
  const icon_obj = {
    "icon-task-recordEstimate icon-time": "job_time",
    "icon-task-finish icon-checked": "finish",
    "icon-task-start icon-play": "start"
  }

  for (let index in tHeader.children[0].children) {
    th_obj[index] = tHeader.children[0].children[index].title
  }

  for (let tb_item_level of tBody.children) {
    let tb_obj = {}
    for (let index in tb_item_level.children) {
      tb_obj[index] = tb_item_level.children[index].title || tb_item_level.children[index]
    }
    tb_arr.push(tb_obj)
  }

  for (let handle_item of tb_arr) {
    let tb_handle = {}
    tb_handle["name"] = handle_item['2']
    tb_handle["parentName"] = handle_item['3']
    tb_handle["overTime"] = handle_item['6'].innerHTML
    tb_handle["expect"] = Number(handle_item['8'].split(' ')[0])
    tb_handle["used"] = Number(handle_item['9'].split(' ')[0])
    tb_handle["surplus"] = Number(handle_item['10'].split(' ')[0])
    handle_arr[handle_item['2']] = tb_handle
  }
  console.log(handle_arr)
  localStorage.setItem('catch_person', JSON.stringify(handle_arr))
  iframe.contentWindow.document.addEventListener('mousedown', (e) => {
    console.log(icon_obj[e.target.className] || '')
    if (icon_obj[e.target.className]) {
      // document.addEventListener('visibilitychange', () => {
      //   if (document.hidden == true) {
      //     console.log("离开页面")
      //   } else {
      //     console.log("进入页面")
      //   }
      // })
    }
  }, true)

}
