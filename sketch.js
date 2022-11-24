let data;
let minLevel, maxLevel, changeLevel;
let seaHeight;
let obj;
let currentX = 0;
let drawH;
let blueVariation;

function preload() {
  data = loadTable("sealevels.csv", "csv", "header");
}

function setup() {
  let myCanvas = createCanvas(1000, 600);
  myCanvas.parent("canvas");
  rectMode(CORNERS);
  noStroke();

  textSize(16);

  let allLevels = [];
  for (let i = 0; i < data.rows.length; i++) {
    let level = parseFloat(data.rows[i].obj.level);
    let uncertainty = parseFloat(data.rows[i].obj.uncertainty);
    data.rows[i].obj.level = level;
    data.rows[i].obj.uncertainty = uncertainty;
    allLevels.push(data.rows[i].obj.level);
  }
  minLevel = min(allLevels);
  maxLevel = max(allLevels);
  changeLevel = maxLevel - minLevel;
  seaHeight = minLevel;
}

function draw() {
  noStroke();
  fill(255);

  rect(0, 0, width, height);
  //it's minus 1 because of the header + the way it starts from zero, so the last element will be row 133
  // console.log(data.rows[133])
  let mouse2data = map(currentX, 20, width - 20, 0, data.rows.length - 1, true);
  let index = floor(mouse2data);
  let current = data.rows[index].obj;
  let level = current.level;
  let uncertainty = current.uncertainty;
  let year = current.year;
  let h = map(level, minLevel, maxLevel, height - 100, 100);
  drawH = seaHeight + (h - seaHeight) * 0.1;




  //island

  // push();
  // textSize(300)
  // text('🌴', width/2.5, 520); 
  // fill(200,120,70);
  // ellipse (width/2, height, width/1.2, 500)
  // pop()



  blueVariation = 150 + drawH / 5;
  // console.log(blueVariation)

  fill(0, 61, blueVariation);
  let sea = rect(0, drawH, width, height);

  let uncertaintyH = map(uncertainty, minLevel, maxLevel, height - 100, 100);
  fill(255, 255, 255, 100);
  rect(0, drawH, width, drawH + uncertainty);

  let baselineH = map(
    data.rows[0].obj.level,
    minLevel,
    maxLevel,
    height - 100,
    100
  );
  fill(200, 100);
  textAlign(LEFT);
  text("Baseline", 20, baselineH - 4);
  textAlign(RIGHT);
  text("1880", width - 20, baselineH - 4);
  stroke(200, 100);
  line(0, baselineH, width, baselineH);

  if (index >= 110) {
    let ninetiesH = map(
      data.rows[100].obj.level,
      minLevel,
      maxLevel,
      height - 100,
      100
    );
    let ninetiesChange = floor(data.rows[100].obj.level - minLevel);
    noStroke();
    textAlign(LEFT);
    text("+" + ninetiesChange + "mm", 20, ninetiesH - 4);
    textAlign(RIGHT);
    text("1980", width - 20, ninetiesH - 4);
    stroke(200, 100);
    line(0, ninetiesH, width, ninetiesH);
  }

  if (index >= 130) {
    let endH = map(
      data.rows[133].obj.level,
      minLevel,
      maxLevel,
      height - 100,
      100
    );
    let endChange = floor(data.rows[133].obj.level - minLevel);
    noStroke();
    textAlign(LEFT);
    text("+" + endChange + "mm", 20, endH - 4);
    textAlign(RIGHT);
    text(data.rows[133].obj.year, width - 20, endH - 4);
    stroke(200, 100);
    line(0, endH, width, endH);
  }

  let yearStepSize = (width - 40) / (data.rows.length - 1);
  let yearIndicatorX = 20 + index * yearStepSize;
  textAlign(CENTER);
  stroke(255);
  line(20, height - 50, width - 20, height - 50);
  line(yearIndicatorX, height - 54, yearIndicatorX, height - 50);
  stroke(255, 50);

  fill(255);
  text(year, yearIndicatorX, height - 58);
  seaHeight = drawH;

  fill(0);

  //title text
  textSize(16);
  textAlign(LEFT);
  textStyle(BOLD);
  text("Sea Level", 20, 20);
  textStyle(NORMAL);
  text("1880—2013", 20, 40);

  if (mouseIsPressed === true) {
    stroke(255, 0, 0);
    line(yearIndicatorX, height - 51, yearIndicatorX, mouseY);
    fill(255, 0, 0);
    noStroke();
    text(int(level) + 170 + "mm", mouseX, mouseY);
  }
}

function mouseMoved() {
  currentX = mouseX;
}

function touchMoved(e) {
  //console.log('touch', e);
  if (e.touches) {
    currentX = e.touches[0].pageX;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}