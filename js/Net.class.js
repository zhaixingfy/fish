// eslint-disable-next-line
class Net extends Sprite {
  nextFrame(scene) {
    const me = this
    const totalFrame = 24
    const halfFrame = totalFrame / 2

    me.countFrame++

    const scale = (
      me.countFrame < halfFrame ?
        me.countFrame :
        halfFrame - (me.countFrame - halfFrame)
    ) / halfFrame

    me.scale = [scale, scale]

    if (me.countFrame > totalFrame) {
      scene.nets.remove(me)
    }
  }
}