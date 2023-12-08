export function timeAgo(dateTimeStamp: number) {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const now = Date.now();
  const diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  const minC = Number((diffValue / minute).toFixed(0));
  const hourC = Number((diffValue / hour).toFixed(0));
  const dayC = Number((diffValue / day).toFixed(0));
  const weekC = Number((diffValue / week).toFixed(0));
  const monthC = Number((diffValue / month).toFixed(0));
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
    result = "just now";
  } else {
    const datetime = new Date();
    datetime.setTime(dateTimeStamp);
    const Nyear = datetime.getFullYear();
    const Nmonth =
      datetime.getMonth() + 1 < 10
        ? `0${datetime.getMonth() + 1}`
        : datetime.getMonth() + 1;
    const Ndate =
      datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
    result = `${Nyear}-${Nmonth}-${Ndate}`;
  }
  return result;
}

export function timeCountdown(dateTimeStamp: number) {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const now = Date.now();
  const diffValue = dateTimeStamp - now;
  if (diffValue < 0 || Number.isNaN(dateTimeStamp)) {
    return;
  }
  const minC = Number((diffValue / minute).toFixed(0));
  const hourC = Number((diffValue / hour).toFixed(0));
  const dayC = Number((diffValue / day).toFixed(0));
  let result;
  if (minC <= 1) {
    return "1min";
  }
  result = `${minC % 60}min`;
  if (hourC >= 1) {
    result = `${hourC % 24}h ${result}`;
  }
  if (dayC >= 1) {
    result = `${dayC}d ${result}`;
  }
  return result;
}
