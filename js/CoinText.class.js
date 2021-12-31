// eslint-disable-next-line
class CoinText extends Sprite {
  constructor(d = {}) {
    d.link = 'coinText'
    super(...arguments)

    const me = this

    me.scale = [0, 0]
  }
  nextFrame(scene) {
    const me = this

    me.countFrame++
    me.scale[0] = me.scale[1] = (me.countFrame < 22 ? me.countFrame / 22 : 1) * .75

    if (me.countFrame > 40) {
      scene.coinTexts.remove(this)
    }
  }
  render(scene) {
    const me = this
    const {el} = me
    const {gd} = scene
    const str = 'x' + me.num
    const offsetX = -str.length * el.width / 2

    gd.save()
    gd.translate(me.x, me.y)
    gd.scale(me.scale[0], me.scale[1])
    for (let i = 0; i < str.length; i++) {
      const s = str[i]

      gd.drawImage(
        el.img,
        (s === 'x' ? 10 : s) * el.width, 0, el.width, el.height,
        offsetX + i * el.width, -el.height / 2, el.width, el.height,
      )
    }
    gd.restore()
  }
}