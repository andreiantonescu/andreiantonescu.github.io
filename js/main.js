var type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg';
var two = new Two({
    type: Two.Types[type],
    fullscreen: true
}).appendTo(document.body);

var mass = 10;
var radius = two.height / 5;
var strength = 0.0625;
var drag = 0.0;

var background = two.makeGroup();
var foreground = two.makeGroup();

var physics = new Physics();
var points = [];
var i = 0;

for (i = 0; i < Two.Resolution; i++) {

    var pct = i / Two.Resolution;
    var theta = pct * Math.PI * 2;

    var ax = radius * Math.cos(theta);
    var ay = radius * Math.sin(theta);

    var variance = Math.random() * 0.5 + 0.5;
    var bx = variance * ax;
    var by = variance * ay;

    var origin = physics.makeParticle(mass, ax, ay)
    var particle = physics.makeParticle(Math.random() * mass * 0.66 + mass * 0.33, bx, by);
    var spring = physics.makeSpring(particle, origin, strength, drag, 0);

    origin.makeFixed();

    particle.shape = two.makeCircle(particle.position.x, particle.position.y, 5);
    particle.shape.noStroke().fill = '#fff';
    particle.position = particle.shape.translation;

    foreground.add(particle.shape)
    points.push(particle.position);

}

var outer = new Two.Path(points, true, true);
var color = getRandomColor();
outer.stroke = color.toString();
outer.fill = color.toString(0.5);
outer.scale = 1.75;
outer.linewidth = 10;

background.add(outer);

var inner = new Two.Path(points, true, true);
inner.noStroke();
inner.fill = getRandomColor().toString();
inner.scale = 1.25;

background.add(inner);

// _.extend(two.renderer.domElement.style, {
//     background: 'url(' + generateGrid() + ') center center'
// });

resize();

two
    .bind('resize', resize)
    .bind('update', function () {
        physics.update();
    })
    .play();

function resize() {
    background.translation.set(two.width / 2, two.height / 2);
    foreground.translation.copy(background.translation);
}

function getRandomColor() {
    var color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        toString: function (a) {
            if (a) {
                return 'rgba('
                    + color.r + ','
                    + color.g + ','
                    + color.b + ','
                    + a + ')';
            }
            return 'rgb('
                + color.r + ','
                + color.g + ','
                + color.b + ')';
        }
    };
    return color;
}

two.update();