/**
 * Just demo of speedo by changing values 
 */

let speed = 0;
let tacho = 0;
let gas = 0;
let mileage = 0;

let turnSignalsStates = {
    'left':  true,
    'right': true
}

let iconsStates = {
    // main circle
    'dippedBeam': 1,
    'brake':      1,
    'drift':      1,
    'highBeam':   1,
    'lock':       1,
    'seatBelt':   1,
    'engineTemp': 2,
    'stab':       1,
    'abs':        1,
    // right circle
    'gas':        2,
    'trunk':      1,
    'bonnet':     1,
    'doors':      1,
    // left circle
    'battery':    2,
    'oil':        2,
    'engineFail': 2
}

function redraw() {
    draw(speed, tacho, gas, mileage, turnSignalsStates, iconsStates);
}

const buttonRandom = document.getElementById('randomize');
const inputSpeed = document.getElementById('speed');
const inputTacho = document.getElementById('tacho');
const inputGas = document.getElementById('gas');
const inputMileage = document.getElementById('mileage');
const inputLeftSign = document.getElementById('leftSign');
const inputRightSign = document.getElementById('rightSign');
const inputDippedBeam = document.getElementById('dippedBeam');
const inputBrake = document.getElementById('brake');
const inputDrift = document.getElementById('drift');
const inputHighBeam = document.getElementById('highBeam');
const inputLock = document.getElementById('lock');
const inputSeatBelt = document.getElementById('seatBelt');
const inputEngineTemp = document.getElementById('engineTemp');
const inputStab = document.getElementById('stab');
const inputABS = document.getElementById('abs');
const inputGasIcon = document.getElementById('gasIcon');
const inputTrunk = document.getElementById('trunk');
const inputBonnet = document.getElementById('bonnet');
const inputDoors = document.getElementById('doors');
const inputBattery = document.getElementById('battery');
const inputOil = document.getElementById('oil');
const inputEngineFail = document.getElementById('engineFail');

buttonRandom.addEventListener('click', e => {
    speed = Math.random();
    inputSpeed.value = speed;
    tacho = Math.random();
    inputTacho.value = tacho;
    gas = Math.random();
    inputGas.value = gas;
    mileage = Math.round(Math.random() * 100000)
    inputMileage.value = mileage;
    redraw();
});

inputSpeed.addEventListener('input', e => {
    speed = e.target.value;
    redraw();
});

inputTacho.addEventListener('input', e => {
    tacho = e.target.value;
    redraw();
});

inputGas.addEventListener('input', e => {
    gas = e.target.value;
    redraw();
});

inputMileage.addEventListener('input', e => {
    mileage = e.target.value;
    redraw();
});

inputLeftSign.addEventListener('change', e => {
    turnSignalsStates.left = e.target.checked;
    redraw();
});

inputRightSign.addEventListener('change', e => {
    turnSignalsStates.right = e.target.checked;
    redraw();
});

inputDippedBeam.addEventListener('change', e => {
    iconsStates.dippedBeam = e.target.value;
    redraw();
});

inputBrake.addEventListener('change', e => {
    iconsStates.brake = e.target.value;
    redraw();
});

inputDrift.addEventListener('change', e => {
    iconsStates.drift = e.target.value;
    redraw();
});

inputHighBeam.addEventListener('change', e => {
    iconsStates.highBeam = e.target.value;
    redraw();
});

inputLock.addEventListener('change', e => {
    iconsStates.lock = e.target.value;
    redraw();
});

inputSeatBelt.addEventListener('change', e => {
    iconsStates.seatBelt = e.target.value;
    redraw();
});

inputEngineTemp.addEventListener('change', e => {
    iconsStates.engineTemp = e.target.value;
    redraw();
});

inputStab.addEventListener('change', e => {
    iconsStates.stab = e.target.value;
    redraw();
});

inputABS.addEventListener('change', e => {
    iconsStates.abs = e.target.value;
    redraw();
});

inputGasIcon.addEventListener('input', e => {
    iconsStates.gas = e.target.value;
    redraw();
});

inputTrunk.addEventListener('change', e => {
    iconsStates.trunk = e.target.value;
    redraw();
});

inputBonnet.addEventListener('change', e => {
    iconsStates.bonnet = e.target.value;
    redraw();
});

inputDoors.addEventListener('change', e => {
    iconsStates.doors = e.target.value;
    redraw();
});

inputBattery.addEventListener('change', e => {
    iconsStates.battery = e.target.value;
    redraw();
});

inputOil.addEventListener('change', e => {
    iconsStates.oil = e.target.value;
    redraw();
});

inputEngineFail.addEventListener('change', e => {
    iconsStates.engineFail = e.target.value;
    redraw();
});

redraw();