const puppeteer = require('puppeteer')

const url = `https://movie.douban.com/cinema/nowplaying/hangzhou/`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()

  // 打开网页
  console.log('opening ' + url)
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  // 获取更多
  await sleep(3000)
  await page.waitForSelector('.more')
  for (let i = 0; i < 0; i++) {
    console.log('geting more ' + i)
    await sleep(3000)
    await page.click('.more')
  }

  // 遍历dom， 获取数据
  const result = await page.evaluate(() => {
    var $ = window.$
    var items = Array.from($('#nowplaying').find('.list-item'))
    var links = []

    items.forEach(item => {
      let it = $(item)
      let doubanId = it[0].id
      let title = it.data('title')
      let rate = Number(it.data('score'))
      let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
      links.push({
        doubanId,
        title,
        rate,
        poster
      })
    })
    return links
  })

  await browser.close()

  console.log(result)
  process.send({ result })
  process.exit(0)
})()
