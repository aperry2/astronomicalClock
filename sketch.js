// thank you french astronomers
// https://ssp.imcce.fr/webservices/miriade/api/ephemcc/

// note: possibility of using phase angle?

let epoch;

let courseOfThePlanets = [];
let theMoon;
let mercury;
let venus;
let theSun;
let mars;
let jupiter;
let saturn;

let c;
let cx = 0;
let cy = 0;
let getData = true;
let theSigns;
let theSymbols = "ABCDEFGHIJKL";
let theArrayOfSymbols = [];
let colorsOfThePlanets = [];
let namesOfThePlanets = [];
let haveStargazed = false;
let planetaryPosition = [];
let clockPosition = [];

let userYear;
let userMonth;
let userDay;

// all our html goodies
let yearInput, monthInput, dayInput, button, message, about;

function preload() {
  theSigns = loadFont('Astro.ttf');
}

function setup() {
  userYear = year();
  userMonth = month();
  userDay = day();

  if (userYear < 10) {
    userYear = "0" + userYear;
  }

  if (userMonth < 10) {
    userMonth = "0" + userMonth;
  }

  if (userDay < 10) {
    userDay = "0" + userDay;
  }

  epoch = userYear + "-" + userMonth + "-" + userDay + "T" + formattedTime(); // UTC format, "now" is the default; correct format example: 1989-06-07T00:00:00.000

  theMoon = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=s:moon&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  mercury = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:mercury&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  venus = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:venus&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  theSun = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:sun&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  mars = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:mars&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  jupiter = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:jupiter&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  saturn = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:saturn&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";

  c = createCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = height / 2;

  // input data for natal charts
  yearInput = createInput();
  yearInput.value(year());
  yearInput.position(45, 130);
  yearInput.size(120);

  monthInput = createInput();
  monthInput.value(month());
  monthInput.position(10 + yearInput.x + yearInput.width, 130);
  monthInput.size(60);

  dayInput = createInput();
  dayInput.value(day());
  dayInput.position(20 + yearInput.x + yearInput.width + monthInput.width, 130);
  dayInput.size(60);

  button = createButton('submit');
  button.position(50 + yearInput.x + yearInput.width + monthInput.width + dayInput.width, 130);
  button.mousePressed(newEpoch);

  message = createElement('p', epoch);
  message.position(20, 0);
  message.html('enter a meaningful year, month, and day');

  about = createElement('h6');
  about.html(
    'made by <a href="https://www.alanjperry.com/">alan perry</a> in 2021<br><br> this digital, astronomical, analog clock displays the position of the planets from the perspective of an observer on earth, either now or on a meaningful day between the years 973 and 3026 C.E. best experienced on an HD monitor or a mobile device. press \'s\' to save an image of the clock.<br><br> ephemerides data generously provided by the observatory of paris miriade project'
  );
  about.position(width - 600, height - 230);

  // colors are assigned according to research by
  // Dr. Patrice Guiard, PhD
  colorsOfThePlanets[0] = color('#ffffff'); // moon/white
  colorsOfThePlanets[1] = color('#DFE0E7'); // mercury/brown
  colorsOfThePlanets[2] = color('#BFC1CE'); // venus/green
  colorsOfThePlanets[3] = color('#9FA2B6'); // sun/yellow
  colorsOfThePlanets[4] = color('#80839E'); // mars/red
  colorsOfThePlanets[5] = color('#606485'); // jupiter/orange
  colorsOfThePlanets[6] = color('#40456D'); // saturn/grey

  loadJSON(theMoon, observeTheFirmament);
  loadJSON(mercury, observeTheFirmament);
  loadJSON(venus, observeTheFirmament);
  loadJSON(theSun, observeTheFirmament);
  loadJSON(mars, observeTheFirmament);
  loadJSON(jupiter, observeTheFirmament);
  loadJSON(saturn, observeTheFirmament);

  noStroke();

  for (let i = 0; i < 7; i++) {
    planetaryPosition[i] = 0;
    clockPosition[i] = 0;
  }

  namesOfThePlanets[0] = 'R';
  namesOfThePlanets[1] = 'S';
  namesOfThePlanets[2] = 'T';
  namesOfThePlanets[3] = 'Q';
  namesOfThePlanets[4] = 'U';
  namesOfThePlanets[5] = 'V';
  namesOfThePlanets[6] = 'W';

  theArrayOfSymbols = theSymbols.split('');

  /*
  if (getData) {
    console.log(courseOfThePlanets[0].sso.name);
    console.log(courseOfThePlanets[0].data[0].RA);
    console.log(parseRA(courseOfThePlanets[0].data[0].RA));
  }
  */
}

//
//
// END OF SETUP
//
//

function draw() {
  fill(color('#DFE0E7'), 5);
  rect(0, 0, width, height);

  starburst(cx - 320, cy - 320);
  starburst(cx + 320, cy - 320);
  starburst(cx - 320, cy + 320);
  starburst(cx + 320, cy + 320);

  starburst(cx - 460, cy);
  starburst(cx + 460, cy);
  starburst(cx, cy - 460);
  starburst(cx, cy + 460);

  starburst(cx - 640, cy - 320);
  starburst(cx + 640, cy - 320);
  starburst(cx - 640, cy + 320);
  starburst(cx + 640, cy + 320);

  starburst(cx - 780, cy);
  starburst(cx + 780, cy);
  starburst(cx, cy - 780);
  starburst(cx, cy + 780);


  starburst(cx - 960, cy - 320);
  starburst(cx + 960, cy - 320);
  starburst(cx - 960, cy + 320);
  starburst(cx + 960, cy + 320);

  starburst(cx - 320, cy - 640);
  starburst(cx + 320, cy - 640);
  starburst(cx - 320, cy + 640);
  starburst(cx + 320, cy + 640);

  if (hour() === 0 && minute() === 0 && second() === 0) {
    loadJSON(theMoon, observeTheFirmament);
    loadJSON(mercury, observeTheFirmament);
    loadJSON(venus, observeTheFirmament);
    loadJSON(theSun, observeTheFirmament);
    loadJSON(mars, observeTheFirmament);
    loadJSON(jupiter, observeTheFirmament);
    loadJSON(saturn, observeTheFirmament);
  }

  textAlign(CENTER, CENTER);

  strokeWeight(0);

  colorsOfThePlanets.reverse();
  for (let i = 0; i < 7; i++) {
    fill(colorsOfThePlanets[i]);
    circle(cx, cy, 841 - (i * 4));
  }
  colorsOfThePlanets.reverse();

  fill(color('#BFC1CE'));
  circle(cx, cy, 820);

  for (let i = 0; i < theArrayOfSymbols.length; i++) {
    textFont(theSigns);
    textSize(60);
    let angle = radians(15 + (i * 30));
    let x = cx + cos(angle) * 365;
    let y = cy + sin(angle) * 365;
    stroke(0);
    strokeWeight(0);
    fill(color('#202654'));
    text(theArrayOfSymbols[i], x, y);
  }

  strokeWeight(0);
  fill(color('#00073C'));
  circle(cx, cy, 650);

  for (let i = 0; i < 7; i++) {
    fill(colorsOfThePlanets[i]);
    if (i === 3) {
      fill(red(colorsOfThePlanets[i]) + 20, green(colorsOfThePlanets[i]) + 20, blue(colorsOfThePlanets[i]) + 20);
    }
    circle(cx, cy, 630 - (i * 60));
  }

  fill(color('#202654'));
  circle(cx, cy, 210);

  fill(color('#00073C'));
  circle(cx, cy, 160);

  drawIndicators();

  drawPlanets();

  drawClockFace();

  noStroke();
  fill(color('#202654'));
  circle(cx, cy, 10);

  epoch = userYear + "-" + userMonth + "-" + userDay + "T" + formattedTime();
}

function newEpoch() {
  userYear = yearInput.value();
  userMonth = monthInput.value();
  userDay = dayInput.value();

  // INPOP theories only accept these dates:
  // INPOP: 973-06-04 12h (2076601.0) to 3026-07-25 12h (2826489.0)

  if (userYear < 974) {
    userYear = 974;
  }

  if (userYear > 3025) {
    userYear = 3025;
  }

  if (userYear < 1000) {
    userYear = "0" + userYear;
  }

  if (userMonth < 10) {
    userMonth = "0" + userMonth;
  }

  if (userDay < 10) {
    userDay = "0" + userDay;
  }

  epoch = userYear + "-" + userMonth + "-" + userDay + "T" + formattedTime();

  theMoon = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=s:moon&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  mercury = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:mercury&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  venus = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:venus&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  theSun = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:sun&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  mars = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:mars&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  jupiter = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:jupiter&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";
  saturn = "https://ssp.imcce.fr/webservices/miriade/api/ephemcc.php?-name=p:saturn&-type=&-ep=" + epoch + "&-nbd=1&-step=1d&-tscale=UTC&-observer=@500&-theory=INPOP&-teph=1&-tcoor=1&-oscelem=astorb&-mime=json&-output=--iso&-from=MiriadeDoc";

  loadJSON(theMoon, observeTheFirmament);
  loadJSON(mercury, observeTheFirmament);
  loadJSON(venus, observeTheFirmament);
  loadJSON(theSun, observeTheFirmament);
  loadJSON(mars, observeTheFirmament);
  loadJSON(jupiter, observeTheFirmament);
  loadJSON(saturn, observeTheFirmament);
}

function observeTheFirmament(stars) {
  if (stars.sso.name === 'Moon') {
    courseOfThePlanets[0] = stars;
    planetaryPosition[0] = parseRA(stars.data[0].RA);
  } else if (stars.sso.name === 'Mercury') {
    courseOfThePlanets[1] = stars;
    planetaryPosition[1] = parseRA(stars.data[0].RA);
  } else if (stars.sso.name === 'Venus') {
    courseOfThePlanets[2] = stars;
    planetaryPosition[2] = parseRA(stars.data[0].RA);
  } else if (stars.sso.name === 'Sun') {
    courseOfThePlanets[3] = stars;
    planetaryPosition[3] = parseRA(stars.data[0].RA);
  } else if (stars.sso.name === 'Mars') {
    courseOfThePlanets[4] = stars;
    planetaryPosition[4] = parseRA(stars.data[0].RA);
  } else if (stars.sso.name === 'Jupiter') {
    courseOfThePlanets[5] = stars;
    planetaryPosition[5] = parseRA(stars.data[0].RA);
  } else if (stars.sso.name === 'Saturn') {
    courseOfThePlanets[6] = stars;
    planetaryPosition[6] = parseRA(stars.data[0].RA);
  }
  haveStargazed = true;
}

function formattedTime() {
  let hourString;
  let minuteString;
  let secondString;

  if (hour() < 10) {
    hourString = "0" + hour();
  } else if (hour() >= 10) {
    hourString = hour();
  }

  if (minute() < 10) {
    minuteString = "0" + minute();
  } else if (minute() >= 10) {
    minuteString = minute();
  }

  if (second() < 10) {
    secondString = "0" + second();
  } else if (second() >= 10) {
    secondString = second();
  }

  let timeString = hourString + ":" + minuteString + ":" + secondString + ".000";
  return timeString;
}

function formattedDate() {
  let dateString = yearString + "-" + monthString + "-" + dayString;
  return dateString;
}

function drawClockFace() {
  let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  stroke(color('#9FA2B6'));
  strokeWeight(1);
  line(cx, cy, cx + cos(s) * 90, cy + sin(s) * 90);
  strokeWeight(2);
  line(cx, cy, cx + cos(m) * 70, cy + sin(m) * 70);
  strokeWeight(4);
  line(cx, cy, cx + cos(h) * 50, cy + sin(h) * 50);

  for (let i = 0; i < 12; i++) {
    noStroke();
    textSize(50);
    let angle = radians(30 + (i * 30));
    textAlign(CENTER, CENTER);
    let x = cx + cos(angle - HALF_PI) * 365;
    let y = cy + sin(angle - HALF_PI) * 365;
    textAlign(CENTER, CENTER);
    fill(color('#00073C'));
    text(i + 1, x, y);
  }
}

function drawPlanets() {
  let angle = 0;
  let x = 0;
  let y = 0;
  let targetPosition = 0;

  for (let i = 0; i < 7; i++) {
    //easing formulae
    targetPosition = planetaryPosition[i];
    let deltaPosition = targetPosition - clockPosition[i];
    clockPosition[i] += deltaPosition * 0.01;

    strokeWeight(0);
    angle = radians(clockPosition[i]);
    x = cx + cos(angle) * (120 + i * 30);
    y = cy + sin(angle) * (120 + i * 30);
    fill(colorsOfThePlanets[i]);
    circle(x, y, 30);
    textAlign(CENTER, CENTER);
    textSize(30);
    textFont(theSigns);
    fill(0);
    text(namesOfThePlanets[i], x, y - 2);
  }
}

function parseRA(RA) {
  let splitRA = split(RA, ':');
  let hours = int(splitRA[0]);
  let minutes = int(splitRA[1]);
  let seconds = int(splitRA[2]);
  let degreeNotation = (hours + minutes / 60 + seconds / 3600) * 15;
  return degreeNotation;
}

function drawIndicators() {
  let indicatorFar = 300;
  let indicatorHours = 100;
  let indicatorMinutes = 290;

  strokeWeight(2);
  stroke(color('#999CB1'));
  for (let i = 0; i < 12; i++) {
    let angle = radians(i * 30);
    let tx1 = cx + cos(angle) * indicatorFar;
    let ty1 = cy + sin(angle) * indicatorFar;
    let tx2 = cx + cos(angle) * indicatorHours;
    let ty2 = cy + sin(angle) * indicatorHours;
    line(tx1, ty1, tx2, ty2);
  }
  for (let i = 0; i < 72; i++) {
    let angle = radians(i * 5);
    let tx1 = cx + cos(angle) * indicatorFar;
    let ty1 = cy + sin(angle) * indicatorFar;
    let tx2 = cx + cos(angle) * indicatorMinutes;
    let ty2 = cy + sin(angle) * indicatorMinutes;
    line(tx1, ty1, tx2, ty2);
  }

  /*
  let firstPointOfAriesX = cx + cos(radians(0)) * indicatorFar;
  let firstPointOfAriesY = cy + sin(radians(0)) * indicatorFar;
  line(cy, cy, firstPointOfAriesX, firstPointOfAriesY);
  */
}

function keyTyped() {
  if (key === 's') {
    saveCanvas(c, 'TimeRecord' + epoch, 'jpg');
  } else if (key === 'r') {
    console.log(planetaryPosition[0]);
  }
}

function starburst(xLoc, yLoc) {
  let spinRate = frameCount / 3; // or min(mouseX, mouseY / 60);

  let targetX = -second();

  let position;

  strokeWeight(1);
  stroke(color('#9FA2B6'));
  for (let i = 0; i < 96; i++) {
    position = 3.75 + i * 3.75 + targetX;
    let angle = radians(position);
    let tx1 = xLoc;
    let ty1 = yLoc;
    let tx2 = xLoc + cos(angle) * 70;
    let ty2 = yLoc + sin(angle) * 70;
    line(tx1, ty1, tx2, ty2);
  }

  strokeWeight(2);
  stroke(color('#80839E'));
  for (let i = 0; i < 48; i++) {
    position = 7.5 + i * 7.5 + targetX;
    let angle = radians(position);
    let tx1 = xLoc;
    let ty1 = yLoc;
    let tx2 = xLoc + cos(angle) * 80;
    let ty2 = yLoc + sin(angle) * 80;
    line(tx1, ty1, tx2, ty2);
  }

  strokeWeight(3);
  stroke(color('#40456D'));
  for (let i = 0; i < 24; i++) {
    position = 15 + i * 15 + targetX;
    let angle = radians(position);
    let tx1 = xLoc;
    let ty1 = yLoc;
    let tx2 = xLoc + cos(angle) * 90;
    let ty2 = yLoc + sin(angle) * 90;
    line(tx1, ty1, tx2, ty2);
  }

  strokeWeight(4);
  stroke(color('#202654'));
  for (let i = 0; i < 12; i++) {
    position = i * 30 + targetX;
    let angle = radians(position);
    let tx1 = xLoc;
    let ty1 = yLoc;
    let tx2 = xLoc + cos(angle) * 100;
    let ty2 = yLoc + sin(angle) * 100;
    line(tx1, ty1, tx2, ty2);
  }
}
