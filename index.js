// 目的：通用的可视区域渲染长列表，以高度分页
/**
 * 效果：
 * 1. 高度一致
 * 2. 渲染元素包括当前可视区域以及上下两个可视高度的缓冲区
 * 3. 其余部分使用占位符
 * 4. 滚动到下一页则进行重新计算
 */

function heightPage({
  data,
  pageSize,
  itemH,
  container
}) {
  // 对滚动进行监听
  if (!container.onscroll) {
    container.onscroll = (e) => {
      let res = heightPage({
        data,
        pageSize,
        itemH,
        container
      })
      let phtStr = `<div style="height:${res.phTop}px"></div>`
      let phbStr = `<div style="height:${res.phBottom}px"></div>`
      let content = "";
      res.renderList.forEach(l => {
        content += `<p>${l}</p>`
      })
  
      container.innerHTML = phtStr + content + phbStr;
      console.log(res)
    }
  }
  // 总高度值
  let totalHeight = itemH * data.length;
  let pageH = pageSize * itemH;
  let h = container.offsetHeight;
  if (pageH < h) {
    console.log("单页高度小于可视高度")
    return false;
  }
  let scrollT = container.scrollTop;
  // 计算当前页
  let pageNow = Math.ceil(scrollT / pageH);
  // 组织要渲染的列表数据
  let renderList = [];
  let pre = [];
  let now = [];
  let next = [];
  if (pageNow !== 0) {
    pre = data.slice((pageNow - 1) * pageSize, pageNow * pageSize);
  } 
  now = data.slice((pageNow) * pageSize, (pageNow + 1) * pageSize);
  next = data.slice((pageNow + 1) * pageSize, (pageNow + 2) * pageSize);
  renderList = [...pre, ...now, ...next];
  // 计算上下占位符高度
  // 已经占用的高度
  let occured = itemH * renderList.length;
  let phTop, phBottom;
  if (pageNow === 0) {
    phTop = 0;
  } else {
    phTop = (pageNow - 1) * pageH
  }
  phBottom = totalHeight - phTop - occured;
  return {
    phBottom,
    phTop,
    renderList
  }
}