window.rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

window.d2a = (deg) => {
  return deg / 180 * Math.PI
}

window.a2d = (angle) => {
  return angle / Math.PI * 180
}

Array.prototype.remove = function(e) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === e) {
      this.splice(i, 1)
      i--
    }
  }
  return this
}