/*
 * @Author: Joe
 * @Date: 2022-09-20 09:05:32
 * @LastEditTime: 2022-09-20 18:53:34
 * @LastEditors: Joe
 * @FilePath: /ZentaoTest/js/index.js
 */

window.onload = () => {
  initListData();
  getReq();
};

function initListData() {
  let iframe = document.querySelector('iframe');

  let tb_arr = [];
  let th_obj = {};
  const table = iframe.contentWindow.document.querySelector(
    'table.has-sort-head'
  ).children;
  const tHeader = table[0];
  const tBody = table[1];
  let handle_arr = {};
  const icon_obj = {
    'icon-task-recordEstimate icon-time': 'job_time',
    'icon-task-finish icon-checked': 'finish',
    'icon-task-start icon-play': 'start',
  };

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

  for (let handle_item of tb_arr) {
    let tb_handle = {};
    tb_handle['id'] = handle_item['0'].innerText.replace(' ', '');
    tb_handle['name'] = handle_item['2'].replace(' ', '');
    tb_handle['parentName'] = handle_item['3'];
    tb_handle['overTime'] = handle_item['6'].innerHTML;
    tb_handle['expect'] = Number(handle_item['8'].split(' ')[0]);
    tb_handle['used'] = Number(handle_item['9'].split(' ')[0]);
    tb_handle['surplus'] = Number(handle_item['10'].split(' ')[0]);
    handle_arr[handle_item['2'].replace(' ', '')] = tb_handle;
  }
  localStorage.setItem('catch_handle', JSON.stringify(handle_arr));
}

function getReq(params) {
  axios
    .get(
      'http://zentao.xzxyun.com/zentao/task-recordEstimate-2234.html?onlybody=yes'
    )
    .then((r) => {
      const str = r.data
      console.log(str)
      const _r = getStrTag(str)
      console.log(_r)
    })
    .catch((err) => {
      console.log(err);
    });
}


function getStrTag(str) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(str, "text/html");
  const title = dom.querySelector('h2')
  console.log()
  const tbody = dom.querySelector('tbody')
  let obj = {}
  for(let tr of tbody.children){
    let _arr = []
    for(let td of tr){
      // 
    }
    
  }
  // let reg = new RegExp('<(table|input)[^>]*>', 'g');
  // let text = str.replace(reg, "");
  //   <thead>
  //   <tr class='text-center'>
  //     <th class="w-id">ID</th>
  //     <th class="w-120px">日期</th>
  //     <th class="thWidth">总计消耗</th>
  //     <th class="thWidth">预计剩余</th>
  //     <th>备注</th>
  //     <th class='c-actions-2'>操作</th>
  //   </tr>
  // </thead>

  //或 2.
  // let testJson = str;
  // let changeJson = testJson.replace(/(?<=\>).+?(?=\<)/g, (str) => {
  //   console.log(str.replace(/\s/g, "&nbsp;").replace('&nbsp;', ''))
  //   return str.replace(/\s/g, "&nbsp;")
  // });
  // console.log(changeJson) //格式化后的Json字符串
  return arr
}
