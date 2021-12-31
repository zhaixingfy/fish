/*global pList Bullet d2a a2d*/
// eslint-disable-next-line
class Scene {
  constructor(d = {}) {
    Object.assign(this, d)

    const me = this

    me.conf = {
      emitInterval: 100,
    }
    me.fps = 60
    me.fpsLastTime = Date.now()
    me.score = Number(localStorage.score) || 0
    me.countFrame = 0
    me.gd = me.canvas.getContext('2d')
    me.maxWidth = 1000
    me.mainSpace = 0

    me.fishs = []
    me.bullets = []
    me.nets = []
    me.coins = []
    me.coinTexts = []
    // me.cannons = []
    me.bottoms = Array(2).fill().map((_, idx) => {
      return {x: 0, y: 0, el: pList.bottom, scale: [idx === 1 ? -1 : 1, 1]}
    })
  }
  async ready() {
    const me = this

    await Promise.all(Object.values(pList).map((el) => {
      return new Promise((next) => {
        const img = el.img = new Image()
        el.totalFrame = el.totalFrame || 1
        el.x = el.x || 0
        el.y = el.y || 0
        img.onload = next
        img.onerror = () => {
          alert('图片加载失败： ' + el.src)
        }
        img.src = el.src
      })
    }))

    me.initEvents()
    me.play()

    return this
  }
  initEvents() {
    const me = this
    const {canvas} = me

    window.onresize = () => {
      const w = me.w = canvas.offsetWidth
      const h = me.h = canvas.offsetHeight

      canvas.width = w
      canvas.height = h

      me.maxWidth = Math.min(me.maxWidth, w)
      me.mainSpace = (w - me.maxWidth) / 2

      me.bottoms.forEach((v, idx) => {
        v.x = me.mainSpace + (idx + .5) * pList.bottom.width
        v.y = me.h - pList.bottom.height / 2
      })

      const paddingL = pList.bottom.width * 2
      const subSpace = (me.maxWidth - paddingL) / (me.cannons.length + 1)

      me.cannons.forEach((v, idx) => {
        v.x = me.mainSpace + paddingL + (idx + 1) * subSpace
        v.y = me.h - v.el.height / 2
      })
    }
    window.onresize()

    // 交互
    const fnDown = (e) => {
      const emit = (forceEmit) => {
        if (!forceEmit && me.fps < 55) return

        me.bullets = me.bullets.concat(me.cannons.map((v) => {
          v.countFrame = 0
          v.curFrame = 0
          
          return new Bullet({
            link: v.link.replace('cannon', 'bullet'),
            x: v.x,
            y: v.y,
            rotation: d2a(a2d(v.rotation) - 90),
            v: 10,
          })
        }))
      }

      fnMove(e)
      emit('forceEmit')
      clearInterval(me.timerEmit)
      me.timerEmit = setInterval(emit, me.conf.emitInterval)
      
      return false
    }

    const fnMove = (e) => {
      const x1 = e.clientX ?? e.targetTouches[0].clientX
      const y1 = e.clientY ?? e.targetTouches[0].clientY

      me.cannons.forEach((v) => {
        const {x: x2, y: y2} = v
        v.rotation = d2a(a2d(Math.atan2(y2 - y1, x2 - x1)) - 90)
      })

      return false
    }

    const fnUp = () => {
      clearInterval(me.timerEmit)
      return false
    }

    canvas.onmousedown = canvas.ontouchstart = fnDown
    document.onmousemove = document.ontouchmove = fnMove
    document.onmouseup = document.ontouchend = fnUp
  }
  pause() {
    cancelAnimationFrame(this.timerAni)
  }
  play() {
    const me = this
    const loopRender = () => {
      me.timerAni = requestAnimationFrame(() => {
        me.countFrame++
        me.render()
        loopRender()
      })
    }

    cancelAnimationFrame(me.timerAni)
    loopRender()
  }
  render() {
    const me = this
    const {canvas, gd} = me
    const objs = [me.fishs, me.bullets, me.nets, me.coins, me.coinTexts, me.cannons].flat()

    me.fps = Math.ceil(1000 / (Date.now() - me.fpsLastTime))
    me.fpsLastTime = Date.now()

    gd.clearRect(0, 0, canvas.width, canvas.height)

    objs.forEach((v) => {
      v.nextFrame(me)
      v.render(me)
    })

    me.renderForward()
  }
  renderForward() {
    const me = this
    const {gd} = me

    me.bottoms.forEach((v) => {
      const {el} = v

      gd.save()
      gd.translate(v.x, v.y)
      gd.scale(v.scale[0], v.scale[1])
      gd.drawImage(
        el.img,
        el.x, el.y, el.width, el.height,
        -el.width / 2, -el.height / 2, el.width, el.height,
      )
      gd.restore()
    })

    {
      const str = me.score.toString().padStart(11, 0)
      const btm = me.bottoms[0]
      const el = pList['numberBlack']

      gd.save()
      gd.translate(btm.x - btm.el.width / 2, btm.y)

      for (let i = 0; i < str.length; i++) {
        const n = 9 - str[i]

        gd.drawImage(
          el.img,
          0, n * el.height, el.width, el.height,
          -el.width / 2 + 24 + i * 23, el.height - 15, el.width, el.height,
        )
      }
      gd.restore()
    }
  }
}