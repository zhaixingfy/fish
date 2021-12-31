/*global Scene Cannon Fish rand pList*/

new Scene({
  canvas: document.getElementById('canvas'),
  cannons: Array(1).fill().map((_, idx, arr) => {
    return new Cannon({link: 'cannon' + (arr.length > 1 ? idx % 7 + 1 : 7)})
  })
}).ready().then((me) => {
  const generateFish = () => {
    const row = Math.ceil(me.h / 50)
    const col = Math.ceil(me.w / 50)
    const maxFish = row * col
    const perFish = Math.ceil(maxFish / 50)
    const log = document.getElementById('log')
    log.innerHTML = `
      fps:${me.fps} &nbsp;
      fishs:${me.fishs.length.toString().padStart(4, 0)} &nbsp;
      perFish:${perFish.toString().padStart(4, 0)} &nbsp;
      maxFish:${maxFish.toString().padStart(4, 0)} &nbsp;
      bullets:${me.bullets.length.toString().padStart(4, 0)} &nbsp;
      nets:${me.nets.length.toString().padStart(3, 0)} &nbsp;
      coins:${me.coins.length.toString().padStart(3, 0)} &nbsp;
    `.trim()
    
    if (me.fps < 55) return
    if (me.fishs.length >= maxFish) return

    for (let i = 0; i <= perFish; i++) {
      let n = rand(1, 4096)

      for (let j = 11; j > -1; j--) {
        if (n > Math.pow(2, j)) {
          n = 12 - j
          break
        }
      }

      const link = 'fish' + n
      const el = pList[link]

      // const cx = me.w / 2
      // const cy = me.h / 2
      // const angle = rand(0, 360)

      let x1 = 0
      let y1 = 0

      let l = -el.width
      let r = me.w + el.width

      let t = -el.height
      let b = me.h + el.height

      if (location.origin.indexOf('localhost') > -1) {
        const angle = d2a(i * (360 / perFish))
        const r = Math.min(me.w, me.h) / 4
        x1 = Math.cos(angle) * r + me.w / 2
        y1 = Math.sin(angle) * r + me.h / 2
        // x1 = rand(0, me.w)
        // y1 = rand(0, me.h)
      } else {
        if (Math.random() < .5) {
          // 左右
          x1 = Math.random() < .5 ? l : r
          y1 = rand(t, b)
        } else {
          // 上下
          x1 = rand(l, r)
          // y1 = Math.random() < .5 ? t : b
          y1 = t
        }
      }

      const x3 = rand(0, me.w)
      const y3 = rand(0, me.h)

      me.fishs.unshift(new Fish({
        link,
        // usingCurve: true,
        v: rand(200, 800) / 500,
        points: [
          {x: x1, y: y1},
          {x: me.w / 2, y: me.h / 2},
          {x: x3, y: y3},
        ]
      }))
    }
  }

  me.timerGenerateFish = setInterval(generateFish, 500)

  {
    // let iLeft = 0

    // for (let i = 1; i < 13; i++) {
    //   const el = pList['fish' + i]

    //   iLeft += el.width / 2
    //   me.fishs.push(new Fish({
    //     link: 'fish' + i,
    //     // v: 15,
    //     points: [
    //       {x: iLeft, y: me.h / 2},
    //       {x: 0, y: 0},
    //       {x: 0, y: 0},
    //     ]
    //   }))
    //   iLeft += el.width / 2
    // }
  }

  // me.canvas.onmousedown({
  document.onmousemove({
    clientX: me.w / 2 + pList.bottom.width / 1.2,
    clientY: me.h / 1.3,
  })

  // me.coinTexts.push(new CoinText({
  //   x: 200,
  //   y: 200,
  //   num: 100,
  // }))
})