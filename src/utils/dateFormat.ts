export function timeAgo(dateTimeStamp: number) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = Date.now();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var minC = Number.parseInt(String(diffValue / minute));
  var hourC = Number.parseInt(String(diffValue / hour));
  var dayC = Number.parseInt(String(diffValue / day));
  var weekC = Number.parseInt(String(diffValue / week));
  var monthC = Number.parseInt(String(diffValue / month));
  let result;
  const en = true;
  if (monthC >= 1 && monthC <= 3) {
    result = `${monthC}${
      en ? ` month${monthC === 1 ? "" : "s"}  ago` : "月前"
    }`;
  } else if (weekC >= 1 && weekC <= 3) {
    result = `${weekC}${en ? ` week${weekC === 1 ? "" : "s"}  ago` : "周前"}`;
  } else if (dayC >= 1 && dayC <= 6) {
    result = ` ${dayC}${en ? ` day${dayC === 1 ? "" : "s"}  ago` : "天前"}`;
  } else if (hourC >= 1 && hourC <= 23) {
    result = `${hourC}${en ? ` hour${hourC === 1 ? "" : "s"}  ago` : "小时前"}`;
  } else if (minC >= 1 && minC <= 59) {
    result = `${minC}${en ? ` minute${minC === 1 ? "" : "s"}  ago` : "分钟前"}`;
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚";
  } else {
    console.log(monthC, weekC, dayC, hourC, dateTimeStamp);
    var datetime = new Date();
    datetime.setTime(dateTimeStamp);
    var Nyear = datetime.getFullYear();
    var Nmonth =
      datetime.getMonth() + 1 < 10
        ? `0${datetime.getMonth() + 1}`
        : datetime.getMonth() + 1;
    var Ndate =
      datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
    var Nhour =
      datetime.getHours() < 10
        ? `0${datetime.getHours()}`
        : datetime.getHours();
    var Nminute =
      datetime.getMinutes() < 10
        ? `0${datetime.getMinutes()}`
        : datetime.getMinutes();
    var Nsecond =
      datetime.getSeconds() < 10
        ? `0${datetime.getSeconds()}`
        : datetime.getSeconds();
    result = `${Nyear}-${Nmonth}-${Ndate}`;
  }
  return result;
}
