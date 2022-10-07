document.addEventListener('DOMContentLoaded', function () {
  playBackgroundMusic();
  addBackgroundSmoke();
}, false);

(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

playBackgroundMusic = function() {
  var clicked = false
  document.addEventListener('click', function () {
    if (!clicked) {
      document.querySelector('.js-background-music').play();
      makeItRain();
      addMoreSmoke();
    }

    clicked = true
  });
}

makeItRain = function() {
  new Sakura('body');
}

addMoreSmoke = function() {
  document.querySelector('.js-less-smoke').classList.add('inactive');
  document.querySelector('.js-more-smoke').classList.remove('inactive');
  document.querySelector('.js-more-smoke').classList.add('active');
  drawSmokeLine();
}

randomIntFromInterval = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

addBackgroundSmoke = function() {
  var canvas = document.querySelector('.js-background-smoke')
  var ctx = canvas.getContext('2d')
  canvas.width = innerWidth
  canvas.height = innerHeight

  var party = smokemachine(ctx, [231, 233, 235])
  party.start()
  party.setPreDrawCallback(function(dt){
    var x = randomIntFromInterval(0, innerWidth)
    var y = randomIntFromInterval(0, innerHeight)
    var time = randomIntFromInterval(.5, 5)

    party.addSmoke(x, y, time)
  })

  onmousemove = function (e) {
    var x = e.clientX
    var y = e.clientY
    var n = .5
    var t = Math.floor(Math.random() * 200) + 3800
    party.addsmoke(x, y, n, t)
  }

  onresize = function() {
    canvas.width = innerWidth
    canvas.height = innerHeight
  }
}


function drawSmokeLine() {
  var canvas = document.querySelector('.js-more-smoke'),
  ctx = canvas.getContext("2d");

  var smokeWidth = 300;
  var smokeHeight = 400;

  canvas.width = smokeWidth;
  canvas.height = smokeHeight;

  var parts = [],
  minSpawnTime = 40,
  lastTime = new Date().getTime(),
  maxLifeTime = Math.min(5000, (canvas.height/(1.5*60)*1000)),
  emitterX = canvas.width / 2,
  emitterY = canvas.height - 10,
  smokeImage = new Image();

  function spawn() {
    if (new Date().getTime() > lastTime + minSpawnTime) {
      lastTime = new Date().getTime();
      parts.push(new smoke(emitterX, emitterY));
    }
  }

  function render() {
    var len = parts.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    while (len--) {
      if (parts[len].y < 0 || parts[len].lifeTime > maxLifeTime) {
        parts.splice(len, 1);
      } else {
        parts[len].update();

        ctx.save();
        var offsetX = -parts[len].size/2,
        offsetY = -parts[len].size/2;

        ctx.translate(parts[len].x-offsetX, parts[len].y-offsetY);
        ctx.rotate(parts[len].angle / 180 * Math.PI);
        ctx.globalAlpha  = parts[len].alpha;
        ctx.drawImage(smokeImage, offsetX,offsetY, parts[len].size, parts[len].size);
        ctx.restore();
      }
    }
    spawn();
    requestAnimationFrame(render);
  }

  function smoke(x, y, index) {
    this.x = x;
    this.y = y;

    this.size = 1;
    this.startSize = 32;
    this.endSize = 40;

    this.angle = Math.random() * 359;

    this.startLife = new Date().getTime();
    this.lifeTime = 0;

    this.velY = -1 - (Math.random()*0.5);
    this.velX = Math.floor(Math.random() * (-6) + 3) / 10;
  }

  smoke.prototype.update = function () {
    this.lifeTime = new Date().getTime() - this.startLife;
    this.angle += 0.2;

    var lifePerc = ((this.lifeTime / maxLifeTime) * 100);

    this.size = this.startSize + ((this.endSize - this.startSize) * lifePerc * .1);

    this.alpha = 1 - (lifePerc * .01);
    this.alpha = Math.max(this.alpha,0);

    this.x += this.velX;
    this.y += this.velY;
  }

  smokeImage.src = "assets/images/smoke.png";
  smokeImage.onload = function () {
    render();
  }

  window.onresize = resizeMe;
  window.onload = resizeMe;
  function resizeMe() {
    canvas.height = smokeHeight;
  }
}
