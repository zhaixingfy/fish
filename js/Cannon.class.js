// eslint-disable-next-line
class Cannon extends Sprite {
  constructor() {
    super(...arguments)

    const me = this

    me.fric = 1
  }
  nextFrame(scene) {
    const me = this

    scene.countFrame % me.fric === 0 && me.countFrame++
    me.curFrame = me.countFrame < 5 ? me.countFrame : 0
  }
}