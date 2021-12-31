/*global pList*/

// eslint-disable-next-line
class Sprite {
  constructor(d = {}) {
    Object.assign(this, d)

    const me = this

    me.el = pList[me.link]
    me.x = me.x || 0
    me.y = me.y || 0
    me.v = me.v || 0
    me.rotation = me.rotation || 0
    me.vx = Math.cos(me.rotation) * me.v
    me.vy = Math.sin(me.rotation) * me.v

    me.countFrame = me.countFrame || 0
    me.curFrame = me.curFrame || 0
  }
  nextFrame() {
    const me = this

    if (me.v === 0) return

    me.x += me.vx
    me.y += me.vy
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
      el.x, (me.curFrame * el.height || el.y), el.width, el.height,
      -el.width / 2, -el.height / 2, el.width, el.height,
    )
    gd.restore()
  }
}