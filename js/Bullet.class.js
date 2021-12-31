// eslint-disable-next-line
class Bullet extends Sprite {
  nextFrame(scene) {
    super.nextFrame(scene)

    const me = this

    if (
      (me.x < 0 || me.x > scene.w) ||
      (me.y < 0 || me.y > scene.h)
    ) {
      scene.bullets.remove(me)
    }
  }
}