/*global Net Coin rand*/
// eslint-disable-next-line
class Fish extends Sprite {
  constructor() {
    super(...arguments)

    const me = this
    const [
      {x: x1, y: y1},
      // eslint-disable-next-line
      {x: x2, y: y2},
      {x: x3, y: y3},
    ] = me.points

    me.x = x1
    me.y = y1
    me.rotation = Math.atan2(y3 - y1, x3 - x1)
    me.blood = me.el.blood

    me.updateSpeed(me.v)
  }
  updateSpeed(v) {
    const me = this

    me.v = v
    me.vx = Math.cos(me.rotation) * v
    me.vy = Math.sin(me.rotation) * v
    me.fric = Math.floor(10 - me.v)
    me.fric < 1 && (me.fric = 1)
  }
  nextFrame(scene) {
    const me = this
    const {el} = me
    const halfFrame = el.totalFrame / 2
    const size = Math.max(el.width, el.height)
    
    if (me.blood > 0) {
      me.x += me.vx
      me.y += me.vy
    }

    if (scene.countFrame % me.fric !== 0) return

    me.countFrame++
    me.curFrame = me.countFrame % halfFrame
    me.curFrame = me.curFrame + (me.blood > 0 ? 0 : halfFrame)

    if (
      (me.blood <= 0 && me.countFrame >= halfFrame) ||
      (me.x < -size || me.x > scene.w + size) ||
      (me.y < -size || me.y > scene.h + size)
    ) scene.fishs.remove(me)
  }
  render(scene) {
    const me = this
    const {el} = me
    const {gd} = scene

    gd.save()
    gd.translate(me.x, me.y)
    me.rotation && gd.rotate(me.rotation)
    me.scale && gd.scale(me.scale[0], me.scale[1])
    gd.drawImage(
      el.img,
      el.x, me.curFrame * el.height, el.width, el.height,
      -el.width / 2, -el.height / 2, el.width, el.height,
    )

    gd.beginPath()
    gd.rect(
      el.rec.x - el.rec.width / 2,
      el.rec.y - el.rec.height / 2,
      el.rec.width,
      el.rec.height,
    )
    // gd.fillStyle = 'rgba(0,255,0,.2)'
    // gd.fill()
    gd.restore()

    // 鱼死了，不需要碰撞检测
    if (me.blood <= 0) return

    for (let i = 0; i < scene.bullets.length; i++) {
      const v = scene.bullets[i]

      if (!gd.isPointInPath(v.x, v.y)) continue

      scene.bullets.splice(i, 1)
      i--

      scene.nets.push(new Net({
        link: v.link.replace('bullet', 'net'),
        x: v.x,
        y: v.y,
      }))

      me.blood -= v.el.hurt

      if (me.blood <= 0) {
        me.countFrame = 0

        const reward = el.reward
        const gold = Math.floor(reward / 10)
        const silver = reward % 10
        const total = gold + silver

        scene.coinTexts.push(new CoinText({
          x: v.x,
          y: v.y,
          num: total,
        }))

        for (let i = 0; i < total; i++) {
          setTimeout(() => {
            scene.coins.push(new Coin({
              link: 'coin' + (i < silver ? 1 : 2),
              x: rand(v.x - 50, v.x + 50),
              y: rand(v.y - 50, v.y + 50),
            }))
          }, (i + 1) * 150)
        }

        break
      }
    }
  }
}