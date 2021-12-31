// eslint-disable-next-line
class Coin extends Sprite {
  constructor() {
    super(...arguments)

    const me = this

    me.fric = 2
    me.isGold = /2$/.test(me.link)
  }
  nextFrame(scene) {
    const me = this
    const btm = scene.bottoms[0]
    let {x: tox, y: toy} = btm

    tox += btm.el.width / 2
    toy += btm.el.height / 3

    scene.countFrame % me.fric === 0 && me.countFrame++
    me.curFrame = me.countFrame % 10

    if (me.countFrame > 15) {
      let vx = (tox - me.x) / 25
      let vy = (toy - me.y) / 25

      vx = Math[vx > 0 ? 'ceil' : 'floor'](vx)
      vy = Math[vy > 0 ? 'ceil' : 'floor'](vy)

      me.x += vx
      me.y += vy

      if (Math.abs(tox - me.x) < 5 && Math.abs(toy - me.y) < 5) {
        scene.coins.remove(me)
        scene.score += me.isGold ? 10 : 1
        localStorage.score = scene.score
      }
    }
  }
}