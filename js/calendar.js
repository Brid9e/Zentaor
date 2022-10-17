/*
 * @Author: Joe
 * @Date: 2022-10-16 08:24:45
 * @LastEditors: Joe
 * @LastEditTime: 2022-10-16 08:38:11
 * @FilePath: /Zentaor/js/calendar.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved. 
 */

let data
try {
  data = JSON.parse(localStorage.log_history)
} catch {
  data = null
}
const today = dayjs().format('YYYY-MM-DD');

function calendar(y, m) {
  if (!data) {
    return
  }
  let w = new Date(y, m - 1).getDay();

  let html = '<div class="cal-box">';

  console.log(data)
  html += '<table class="cal-main" >';
  html += `<tr class="cal-title"><th colspan="7"><span>${y}年${m}月</span><span>${data.month_data[ `${y}-${m > 9 ? m : '0' + m}` ] ? `本月已填：<span>${data.month_data[ `${y}-${m > 9 ? m : '0' + m}` ] || ''}</span>` : '本月还未填写'} </span></th></tr>`;
  html += '<tr class="cal-week"><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>';

  let max = new Date(y, m, 0).getDate();

  // 开始<tr>标签
  html += '<tr>';
  for (let d = 1; d <= max; ++d) {
    // 如果该月的第1天不是星期日，则填充空白
    if (w && d == 1) {
      html += '<td class="cal-empty" colspan="' + w + '"> </td>';
    }
    html += `<td class="cal-day ${`${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}` == today ? 'is-today' : ''}" ymd='${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}'><p>${d}</p><span>${data.day_data[ `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}` ] || ''}</span> </td>`;
    // 如果星期六不是该月的最后一天，则换行
    if (w == 6 && d != max) {
      html += '</tr><tr>';
      // 该月的最后一天，闭合<tr>标签
    } else if (d == max) {
      html += '</tr>';
    }
    w = (w + 1 > 6) ? 0 : w + 1;
  }
  html += '</table>';
  html += '</div>';
  return html;
}
