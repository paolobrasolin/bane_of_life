//=[ Rules ]====================================================================

const PRESETS = {
  RULES: {
    CONWAY:
`// This is the body of a JS function.
// c(dx,dy) gets a neighbour state.
// Tweak the rule then click on the board to restart!

neighbors = [
  [-1,-1],[ 0,-1],[ 1,-1],
  [-1, 0],        [ 1, 0],
  [-1, 1],[ 0, 1],[ 1, 1],
]

score = neighbors.
  map(([x,y]) => c(x,y)).
  reduce((u,v) => u+v)

if      (score <  2) return 0
else if (score == 2) return c(0,0)
else if (score == 3) return 1
else if (score >  3) return 0
`,
    PARITY:
`// This is the body of a JS function.
// c(dx,dy) gets a neighbour state.
// Tweak the rule then click on the board to restart!

neighbors = [
  [-1,-1],[ 0,-1],[ 1,-1],
  [-1, 0],        [ 1, 0],
  [-1, 1],[ 0, 1],[ 1, 1],
]

score = neighbors.
  map(([x,y]) => c(x,y)).
  reduce((u,v) => u+v)

return score % 2
`
  },
  SEEDS: {
    RANDOM:
`// TODO

return Math.random() < 0.5 ? 0 : 1
`,
    SINGLETON:
`// TODO
return x == floor(cols/2) && y == floor(rows/2) ? 1 : 0
`
  },
  EDGES: {
    WRAP:
`// TODO
xx = (cols + x) % cols
yy = (rows + y) % rows
return curr[xx][yy]
`,
    WALL:
`// TODO
if (x < 0 || x >= cols) return 0
if (y < 0 || y >= rows) return 0
return curr[x][y]
`
  },
}




//=[ Engine ]===================================================================

let cols
let rows
let curr
let next

let editorDefaults = {
  mode: "javascript",
  theme: "monokai",
  autoRefresh: true,
}

let rule
let ruleEditor

let seed
let seedEditor

let edge
let edgeEditor

function setup() {
  pixelDensity(1);
  createCanvas(512, 512);
  frameRate(16);

  cols = width
  rows = height

  curr = Array.from(Array(cols), () => new Array(rows))
  next = Array.from(Array(cols), () => new Array(rows))


  ruleEditor = CodeMirror(
    document.getElementById('rule_editor'),
    { ...editorDefaults, value: PRESETS.RULES.CONWAY },
  )

  seedEditor = CodeMirror(
    document.getElementById('seed_editor'),
    { ...editorDefaults, value: PRESETS.SEEDS.RANDOM },
  )

  edgeEditor = CodeMirror(
    document.getElementById('edge_editor'),
    { ...editorDefaults, value: PRESETS.EDGES.WRAP },
  )

  init()
}

document.addEventListener('click', function (event) {
  if (!event.target.matches('.interactor')) return;
  if (event.target.matches('#restart')) init()
  if (event.target.matches('#rule_conway')) ruleEditor.setValue(PRESETS.RULES.CONWAY)
  if (event.target.matches('#rule_parity')) ruleEditor.setValue(PRESETS.RULES.PARITY)
  if (event.target.matches('#seed_random')) seedEditor.setValue(PRESETS.SEEDS.RANDOM)
  if (event.target.matches('#seed_singleton')) seedEditor.setValue(PRESETS.SEEDS.SINGLETON)
  if (event.target.matches('#edge_wrap')) edgeEditor.setValue(PRESETS.EDGES.WRAP)
  if (event.target.matches('#edge_wall')) edgeEditor.setValue(PRESETS.EDGES.WALL)
  event.preventDefault();
}, false);

function draw() {
  black = color(0)
  white = color(255)

  background(white)

  step()
  flip()

  for (x = 0; x < cols; x++) {
    for (y = 0; y < rows; y++) {
      set(x, y, curr[x][y] ? black : white)
    }
  }

  updatePixels()
}

function mousePressed() {
  // init()
}

function init() {
  rule = new Function("c", ruleEditor.getValue())
  seed = new Function("x", "y", "cols", "rows", seedEditor.getValue())
  edge = new Function("x", "y", "cols", "rows", "curr", edgeEditor.getValue())

  for (x = 0; x < cols; x++) {
    for (y = 0; y < rows; y++) {
      curr[x][y] = seed(x, y, cols, rows)
    }
  }
}

function step() {
  for (x = 0; x < cols; x++) {
    for (y = 0; y < rows; y++) {
      next[x][y] = rule((dx,dy) => edge(x + dx, y + dy, cols, rows, curr))
    }
  }
}

function flip() {
  let temp = curr
  curr = next
  next = temp
}
