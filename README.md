# HTML5 Canvas Car Speedometer
Fully functional car speedometer created with pure JavaScript and HTML5 Canvas

---

### Demo
https://vladispavlov.github.io/html5-canvas-speedometer/

---

### Usage
1. Connect `fraction.min.js` and `speedometer.js`
2. Call `draw(speed, tacho, gas, mileage, turnSignalsStates, iconsStates)`

---

### Example
```
draw(
  0.5,
  0.5,
  0.5,
  100,
  {
    'left':  true,
    'right': true
  },
  {
    'dippedBeam': 1,
    'brake':      1,
    'drift':      1,
    'highBeam':   1,
    'lock':       1,
    'seatBelt':   1,
    'engineTemp': 2,
    'stab':       1,
    'abs':        1,
    
    'gas':        2,
    'trunk':      1,
    'bonnet':     1,
    'doors':      1,

    'battery':    2,
    'oil':        2,
    'engineFail': 2
  }
)
```
![](speedo_example.png)

---

### Notes
You can check `speedometer.js` file and change values in `options` variable as you need if you want to additionally customize speedometer.
