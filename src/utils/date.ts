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
  const minC = Number.parseInt(String(diffValue / minute));
  const hourC = Number.parseInt(String(diffValue / hour));
  const dayC = Number.parseInt(String(diffValue / day));
  const weekC = Number.parseInt(String(diffValue / week));
  const monthC = Number.parseInt(String(diffValue / month));
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
    // const Nhour =
    //   datetime.getHours() < 10
    //     ? `0${datetime.getHours()}`
    //     : datetime.getHours();
    // const Nminute =
    //   datetime.getMinutes() < 10
    //     ? `0${datetime.getMinutes()}`
    //     : datetime.getMinutes();
    // const Nsecond =
    //   datetime.getSeconds() < 10
    //     ? `0${datetime.getSeconds()}`
    //     : datetime.getSeconds();
    result = `${Nyear}-${Nmonth}-${Ndate}`;
  }
  return result;
}
