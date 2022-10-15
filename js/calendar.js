
let data = JSON.parse(localStorage.log_history || '{}')
const today = dayjs().format('YYYY-MM-DD');
// 定义年历生成函数
function calendar(y, m) {

  // 获取指定年份1月1日的星期数值
  let w = new Date(y, m - 1).getDay();

  let html = '<div class="cal-box">';

  // 拼接每个月份的表格
  // for (let m = 1; m <= 12; ++m) {
  html += '<table class="cal-main" >';
  html += `<tr class="cal-title"><th colspan="7"><span>${y}年${m}月</span><span>${data.month_data[`${y}-${m > 9 ? m : '0' + m}`] ? `本月已填：<span>${data.month_data[`${y}-${m > 9 ? m : '0' + m}`] || ''}</span>` : '本月还未填写'} </span></th></tr>`;
  html += '<tr class="cal-week"><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>';

  // 获取月份m共有多少天
  let max = new Date(y, m, 0).getDate();

  html += '<tr>';                         // 开始<tr>标签
  for (let d = 1; d <= max; ++d) {
    if (w && d == 1) {                  // 如果该月的第1天不是星期日，则填充空白
      html += '<td class="cal-empty" colspan="' + w + '"> </td>';
    }
    html += `<td class="cal-day ${`${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}` == today ? 'is-today' : ''}" ymd='${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}'><p>${d}</p><span>${data.day_data[`${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`] || ''}</span> </td>`;
    if (w == 6 && d != max) {           // 如果星期六不是该月的最后一天，则换行
      html += '</tr><tr>';
    } else if (d == max) {               // 该月的最后一天，闭合<tr>标签
      html += '</tr>';
    }
    w = (w + 1 > 6) ? 0 : w + 1;
  }
  html += '</table>';
  // }
  html += '</div>';
  return html;
}
