const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/**
 * Converts angle in degrees to radians.
 * @param {number} deg Angle in degrees.
 * @returns Angle in radians.
 */
function deg2Rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Converts angle in radians to degrees.
 * @param {number} rad Angle in radians.
 * @returns Angle in degrees.
 */
function rad2Deg(rad) {
    return rad * (180 / Math.PI);
}

/** Class representing a circle (speedometer, tachometer, etc.) */
class Circle {
    /**
     * Creating a circle with the given params.
     * @param {Object} options Parameters of the circle and contained elements.
     * @param {number} options.circleBorderWidth Circle border width in pixels.
     * @param {string} options.circleBorderColor Circle border color.
     * @param {string} options.circleFillColor Circle fill color.
     * @param {string} options.markFillColor Color fill of mark.
     * @param {string} options.markStrokeColor Color fill of mark border.
     * @param {string} options.markFontColor Color of text mark.
     * @param {number} options.markFontSize Font size of text mark in pixels.
     * @param {string} options.markFontStyle Font style of text mark.
     * @param {string} options.markFontFamily Font family of text mark.
     * @param {string} options.arrowBodyFillColor Color fill of arrow circle in center.
     * @param {string} options.arrowBodyStrokeColor Border color of arrow circle in center.
     * @param {string} options.arrowColor Color of arrow (speedometer, etc).
     * @param {number} options.arrowBaseWidth Arrow base width.
     * @param {number} options.arrowBorderWidth Arrow border width.
     * @param {string} options.dangerColor Color of danger.
     * @param {number} options.dangerZoneWidth Width of danger zone.
     * @param {string} options.turnSignalColor Color of enabled turn signal.
     * @param {string} options.speedUnit Speed unit (km, etc).
     * @param {Object} options.icons Dictionary with icons names as key and icons objects as value.
     * @param {Object} options.turnSignal Dictionary with side of turn signal as key and turn signal object as value.
     */
    constructor(options) {
        this.circleBorderWidth = options.circleBorderWidth;
        this.circleBorderColor = options.circleBorderColor;
        this.circleFillColor = options.circleFillColor;

        this.markFillColor = options.markFillColor;
        this.markStrokeColor = options.markStrokeColor;
        this.markFontColor = options.markFontColor;
        this.markFontSize = options.markFontSize;
        this.markFontStyle = options.markFontStyle;
        this.markFontFamily = options.markFontFamily;

        this.arrowBodyFillColor = options.arrowBodyFillColor;
        this.arrowBodyStrokeColor = options.arrowBodyStrokeColor;
        
        this.arrowColor = options.arrowColor;
        this.arrowBaseWidth = options.arrowBaseWidth;
        this.arrowBorderWidth = options.arrowBorderWidth;

        this.dangerColor = options.dangerColor;
        this.dangerZoneWidth = options.dangerZoneWidth;

        this.turnSignalColor = options.turnSignalColor;

        this.speedUnit = options.speedUnit;

        this.icons = options.icons;

        this.turnSignal = options.turnSignal;

        this.startAngle = 0;
        this.endAngle = Math.PI * 2;

        this.radius = canvas.height * 0.35;
    }

    /**
     * Helper method. Draws coordinate lines in the center of coordinates.
     */
    drawSupport() {
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, canvas.height);
        ctx.moveTo(0, this.y);
        ctx.lineTo(canvas.width, this.y);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.supportColor;
        ctx.stroke();
    }

    /**
     * Draws circles and their stroke.
     */
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, this.startAngle, this.endAngle);
        ctx.closePath();
        ctx.fillStyle = this.circleFillColor;
        ctx.lineWidth = this.circleBorderWidth;
        ctx.strokeStyle = this.circleBorderColor;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Calculate angles to indicate location of marks.
     * @param {number} count The number of marks for which you need to calculate the angle.
     * @param {number} degAngle Maximum angle (in degrees) for which angle of marks are calculated.
     * @param {number} [startAngle=0] The angle (in degrees) from which to start the calculation.
     * @returns {number[]} Array of calculated angles.
     */
    calcMarksAngles(count, degAngle, startAngle=0) {
        const addAngle = deg2Rad((degAngle - 180) / 2);
        const radAngle = deg2Rad(degAngle);
        let angles = [];

        for (let i = 0; i < count; i++) {
            const angle = ((i * radAngle / (count - 1)) - addAngle - deg2Rad(startAngle)) * (-1);
            angles.push(angle);
        }

        return angles;
    }

    /**
     * Draws danger zone on circles.
     * @param {number[]} angles Array of marks angles.
     * @param {number} offset Offset from edge of circle.
     * @param {number} [firstNMarks=0] Number of first marks to fill in danger zone.
     * @param {number} [lastNMarks=0] Number of last marks to fill in danger zone.
     */
    drawDangerZone(angles, offset, firstNMarks=0, lastNMarks=0) {
        const radius = this.radius - this.circleBorderWidth - offset;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();

        if (lastNMarks > 0) {
            ctx.arc(0, 0, radius, angles[lastNMarks - 1], angles[0], false);
        } else if (firstNMarks > 0) {
            ctx.arc(0, 0, radius, angles[firstNMarks - 1], angles[0], false);
        }
        
        ctx.lineWidth = this.dangerZoneWidth;
        ctx.strokeStyle = this.dangerColor;
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws specific mark.
     * @param {number} x1 x-coordinate where to start drawing.
     * @param {number} y1 y-coordinate where to start drawing.
     * @param {number} x2 x-coordinate where to finish drawing.
     * @param {number} y2 y-coordinate where to finish drawing.
     * @param {number} lineWidth Width of line.
     * @param {string} strokeStyle Color of line.
     */
    drawMark(x1, y1, x2, y2, lineWidth, strokeStyle) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }

    /**
     * Draws marks on circles.
     * @param {number[]} angles Array of marks angles.
     * @param {number} length Length of marks. Calculated from center of circle, lower value = bigger mark length.
     * @param {number} lineWidth Width of marks.
     * @param {boolean} border Draws border to mark or not.
     * @param {number} [offset=0] Offset from edge of circle.
     * @param {number} [firstNMarks=0] Number of first marks to fill in danger color.
     * @param {number} [lastNMarks=0] Number of last marks to fill in danger color.
     * @param {'even'|'odd'|'all'} [skip=null] 'even' to skip even marks, 'odd' to skip odd marks, 'all' to skip all marks.
     * @param {number} [skipFrom=0] Skip from mark. Use only if param 'skip' is not null. If 'skip' is 'all', it leave marks from.
     * @param {number} [skipTo=0] Skip to mark. Use only if param 'skip' is not null. If 'skip' is 'all', it leave marks from.
     */
    drawMarks(angles, length, lineWidth, border=true, offset=0, firstNMarks=0, lastNMarks=0, skip=null, skipFrom=0, skipTo=0) {
        const count = angles.length - 1;
        const s = count - firstNMarks;
        const e = count - (count - lastNMarks);
        const sf = count - skipFrom;
        const st = count - skipTo;
        const radius = this.radius - this.circleBorderWidth - offset;

        ctx.save();
        ctx.translate(this.x, this.y);

        for (let angle in angles) {
            if (((skip === 'even') && (angle % 2 === 1)) ||
                ((skip === 'odd') && (angle % 2 === 0)) ||
                (skip === 'all')) {
                if ((sf >= angle) && (angle >= st)) {
                    continue;
                }
            }
            
            const x1 = Math.cos(angles[angle]) * radius;
            const y1 = Math.sin(angles[angle]) * radius;
            const x2 = Math.cos(angles[angle]) * (radius - (radius / length));
            const y2 = Math.sin(angles[angle]) * (radius - (radius / length));

            // draws "border" for main mark
            if (border) {
                this.drawMark(x1, y1, x2, y2, lineWidth + 1, this.markStrokeColor);
            }

            // draws main mark
            if ((lastNMarks > 0 && angle < e) || (firstNMarks > 0 && angle > s)) {
                this.drawMark(x1, y1, x2, y2, lineWidth, this.dangerColor);
            } else {
                this.drawMark(x1, y1, x2, y2, lineWidth, this.markFillColor);
            }
        }

        ctx.restore();
    }

    /**
     * Calculate angles to indicate location of text marks.
     * @param {number} count The number of marks for which you need to calculate the angle.
     * @param {number} degAngle Maximum angle (in degrees) for which angle of marks are calculated.
     * @param {number} innerOffset Additional increase / decrease (in degrees) of the maximum angle for adjusting the display.
     * @param {number} [startAngle=0] The angle (in degrees) from which to start the calculation.
     * @returns {number[]} Array of calculated angles.
     */
    calcTextMarksAngles(count, degAngle, innerOffset, startAngle=0) {
        const addAngle = deg2Rad((degAngle + innerOffset - 180) / 2);
        const radAngle = deg2Rad(degAngle + innerOffset);
        let angles = [];

        for (let i = -count + 1; i <= 0; i++) {
            const angle = (i * radAngle / (count - 1)) + addAngle + deg2Rad(startAngle);
            angles.push(angle);
        }

        return angles;
    }

    /**
     * Draws specific text mark.
     * @param {number} value Value to display in mark.
     * @param {number} x x-coordinate of mark.
     * @param {number} y y-coordinate of mark.
     */
    drawTextMark(value, x, y) {
        ctx.font = `${this.markFontStyle} ${this.markFontSize}px ${this.markFontFamily}`;
        ctx.fillStyle = this.markFontColor;
        ctx.fillText(value, x, y);
        ctx.fill();
    }

    /**
     * Draws all text marks.
     * @param {number[]} angles Array of angles. Used to indicate location of marks.
     * @param {number} step Sets the increment number.
     * @param {number} offset Offset from parent circle (in px).
     * @param {boolean} [fractions=false] Convert numbers to fractions and display as fractions.
     * @param {boolean} [reverse=false] Show text marks in reverse order.
     */
    drawTextMarks(angles, step, offset, fractions=false, reverse=false) {
        let value = 0;
        let res = value;        
        const radius = this.radius - this.circleBorderWidth - offset;
        
        if (reverse) {
            angles = angles.reverse();
        }

        ctx.save();
        ctx.translate(this.x, this.y);

        for (let angle in angles) {
            const x = Math.cos(angles[angle]) * (radius - (radius / length)) - this.textMarksOffsetX;
            const y = Math.sin(angles[angle]) * (radius - (radius / length)) + this.textMarksOffsetY;

            if (value !== 0 && fractions) {
                let f = new Fraction(value);
                res = `${f.n}/${f.d}`;
                this.drawTextMark(res, x, y);
            } else {
                this.drawTextMark(value, x, y);
            }
            
            value += step;
        }

        ctx.restore();
    }

    /**
     * Draws speedometer arrow body (circle)
     */
    drawArrowBody() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius / 7.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.lineWidth = this.radius / 7.5 / 2.5;
        ctx.strokeStyle = this.arrowBodyStrokeColor;
        ctx.fillStyle = this.arrowBodyFillColor;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws speedometer arrow.
     * @param {number} value Value of speed. Minimum speed is 0, maximum speed is 1.
     * @param {number} degAngle Maximum angle (in degrees) for which arrow can be turn.
     * @param {number} [offset=0] Offset from edge of circle. Length of arrow.
     * @param {number} [startAngle=0] The angle (in degrees) from which to start the calculation.
     */
    drawArrow(value, degAngle, offset=0, startAngle=0) {
        const addAngle = deg2Rad((degAngle * (-1) - 180) / 2);
        const radAngle = deg2Rad(degAngle * (-1));

        const angle = ((value * radAngle) - addAngle - deg2Rad(startAngle)) * (-1);
        const radius = this.radius - this.circleBorderWidth - offset;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -this.arrowBaseWidth);
        ctx.lineTo(radius, 0);
        ctx.lineTo(0, this.arrowBaseWidth);
        ctx.fillStyle = this.arrowColor;
        ctx.strokeStyle = this.arrowColor;
        ctx.lineWidth = this.arrowBorderWidth;
        ctx.fill();
        ctx.stroke();
        ctx.rotate(-angle);
        ctx.translate(-this.x, -this.y);
        ctx.restore();
    }

    /**
     * Draws icon on circle.
     * @param {string} icon Icon name.
     * @param {0|1|2} [state=0] State of icon.
     */
    drawIcon(icon, state=0) {
        const img = document.getElementById('sprite');

        if (state > this.icons[icon][state]) {
            throw `${this.icons[icon]} has unknown icon state.`;
        }

        if (state === 1 && this.icons[icon].states === 2) {
            state += 1;
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(
            img,
            this.icons[icon].position.x + 150 * state + 10 * state,
            this.icons[icon].position.y,
            150,
            150,
            -this.icons[icon].dimensions.width / 2 + this.icons[icon].offset.x,
            -this.icons[icon].dimensions.height / 2 + this.icons[icon].offset.y,
            this.icons[icon].dimensions.width,
            this.icons[icon].dimensions.height
        );
        ctx.restore();
    }

    /**
     * Draws turn signal.
     * @param {number} offsetX Offset in px from center of circle by x-coordinate.
     * @param {number} offsetY Offset in px from center of circle by y-coordinate.
     * @param {number} width Width in px of turn signal icon.
     * @param {number} height Height in px of turn signal icon.
     * @param {boolean} [enabled=false] Enable or disable turn signal.
     */
    drawTurnSignal(offsetX, offsetY, width, height, enabled=false) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY - height + height * 0.25);
        ctx.lineTo(offsetX + width - width / 1.35, offsetY - height + height * 0.25);
        ctx.lineTo(offsetX + width - width / 1.35, offsetY - height);
        ctx.lineTo(offsetX + width - width / 2.5, offsetY - height / 2);
        ctx.lineTo(offsetX + width - width / 1.35, offsetY);
        ctx.lineTo(offsetX + width - width / 1.35, offsetY - height + height * 0.75);
        ctx.lineTo(offsetX, offsetY - height + height * 0.75);
        ctx.closePath();
        ctx.fillStyle = '#161616';
        if (enabled) {
            ctx.fillStyle = this.turnSignalColor;
        }
        ctx.fill();
        ctx.restore();
    }

    /**
     * Draws mileage rectangle and value.
     * @param {number} value Value of mileage.
     * @param {number} offsetX Offset in px from center of circle by x-coordinate.
     * @param {number} offsetY Offset in px from center of circle by y-coordinate.
     * @param {number} width Width in px of mileage rectangle.
     * @param {number} height Height in px of mileage rectangle.
     * @param {number} radius Border radius in px of mileage rectangle.
     */
    drawMileage(value, offsetX, offsetY, width, height, radius) {
        const halfWidth = width / 2;
        const halfRadius = radius / 2;

        const xPhw = offsetX + halfWidth;
        const xMhw = offsetX - halfWidth;

        const xMhwPr = xMhw + radius;
        const xPhwMr = xPhw - radius;

        const xPhwMhr = xPhw - halfRadius;
        const xMhwPhr = xMhw + halfRadius;

        const yPh = offsetY + height;
        
        const yPr = offsetY + radius;

        const yPhr = offsetY + halfRadius;

        const yPhMhr = yPh - halfRadius;

        const yPhMr = yPh - radius;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(offsetX, yPh);
        ctx.lineTo(xPhwMr, yPh);
        ctx.bezierCurveTo(xPhwMr, yPh, xPhwMhr, yPhMhr, xPhw, yPhMr);
        ctx.lineTo(xPhw, yPr);
        ctx.bezierCurveTo(xPhw, yPr, xPhwMhr, yPhr, xPhwMr, offsetY);
        ctx.lineTo(xMhwPr, offsetY);
        ctx.bezierCurveTo(xMhwPr, offsetY, xMhwPhr, yPhr, xMhw, yPr);
        ctx.lineTo(xMhw, yPhMr);
        ctx.bezierCurveTo(xMhw, yPhMr, xMhwPhr, yPhMhr, xMhwPr, yPh);
        ctx.closePath();
        ctx.fillStyle="#2b2b2b";
        ctx.fill();

        value = `${value} ${this.speedUnit}`;

        ctx.font = `normal ${height - 6}px ${this.markFontFamily}`;
        ctx.fillStyle = this.markFontColor;
        ctx.fillText(value, halfWidth - ctx.measureText(value).width - 4, yPh - 5);
        ctx.restore();
    }

    /**
     * Draws unit on circle.
     * @param {number} offsetY Offset in px from center of circle by y-coordinate.
     */
    drawUnit(offsetY) {
        const value = `${this.speedUnit}/h`;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.font = `${this.markFontStyle} ${this.markFontSize}px ${this.markFontFamily}`;
        ctx.fillStyle = this.markFontColor;
        ctx.fillText(value, -ctx.measureText(value).width / 2, offsetY - 2);
        ctx.restore();
    }

    /**
     * Draws multiplier of tachometer.
     * @param {number} multiplier Multiply by number. 100 * multiplier.
     * @param {number} offsetY Offset in px from center of circle by y-coordinate.
     */
    drawMultiplier(multiplier, offsetY) {
        const value = `x${100 * multiplier} rpm`

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.font = `${this.markFontStyle} ${this.markFontSize / 1.75}px ${this.markFontFamily}`;
        ctx.fillStyle = this.markFontColor;
        ctx.fillText(value, -ctx.measureText(value).width / 2 - 6, offsetY - 2);
        ctx.restore();
    }
}

/** Class representing a main circle that are bigger than others and positioned in center.
 * In the current and standard case it is a speedometer.
 */
class MainCircle extends Circle {
    /**
     * Creating a main circle with the given params.
     * @param {Object} options Parameters of the circle and contained elements. Same as in parent class.
     */
    constructor(options) {
        super(options);
        this.startAngle = deg2Rad(130);
        this.endAngle = deg2Rad(50);
        let cw = canvas.width;
        let ch = canvas.height;
        this.radius = (ch / 2 +
            (ch / 2 - ch / 2 * Math.sin(deg2Rad(50))) / 2 -
            this.circleBorderWidth);
        this.x = cw / 2;
        this.y = (ch / 2 +
            (ch / 2 - this.radius * Math.sin(deg2Rad(50))) -
            this.circleBorderWidth);

        this.textMarksOffsetX = 12;
        this.textMarksOffsetY = 0;

        this.supportColor = 'red';
    }
}

/** Class representing a additional circle that are lower than main and positioned in one of the sides.
 * In the current and standard case it are tachometer on the one side and gas indicator on the another side.
 */
class AdditionalCircle extends Circle {
    /**
     * Creating a additional circle with the given params.
     * @param {Object} options Parameters of the circle and contained elements. Same as in parent class.
     * @param {'left'|'right'} side The side where the circle will be displayed relative to the main circle.
     * @param {number} mainCircleRadius Radius of the main circle. Need for the correct calculation of the radius of the circle.
     */
    constructor(options, side, mainCircleRadius) {
        super(options);

        const cw = canvas.width / 2;
        const x = cw - (cw -
            mainCircleRadius / 2 -
            this.radius -
            this.circleBorderWidth / 1.25);

        if (side === 'left') {
            this.x = cw - x;
        } else if (side === 'right') {
            this.x = cw + x;
        } else {
            throw 'Unknown circle side';
        }
        
        this.y = canvas.height / 2 + this.radius / 2 - this.circleBorderWidth * 2;

        this.textMarksOffsetX = 8;
        this.textMarksOffsetY = 4;

        this.supportColor = 'green';
    }
}

/** Class representing icon. */
class Icon {
    /**
     * Creating a icon with the given params.
     * @param {number} offsetX Offset in px from center of circle by x-coordinate.
     * @param {number} offsetY Offset in px from center of circle by y-coordinate.
     * @param {number} spritePosX Position of icon in px in icons sprite by x-coordinate.
     * @param {number} spritePosY Position of icon in px in icons sprite by y-coordinate.
     * @param {number} width Width of icon.
     * @param {number} height Height of icon.
     * @param {2|3} states States of icon. There are only 3: 1 - Off, 2 - warning, 3 - critical/on. If 2, then only off and on.
     */
    constructor(offsetX, offsetY, spritePosX, spritePosY, width, height, states) {
        this.offset = {
            'x': offsetX,
            'y': offsetY
        }
        this.position = {
            'x': spritePosX,
            'y': spritePosY
        }
        this.dimensions = {
            'width': width,
            'height': height
        }
        this.states = states;
    }
}

/** Class representing turn signal icon. */
class TurnSignal {
    /**
     * Creating a turn signal icon with the given params.
     * @param {number} offsetX Offset in px from center of circle by x-coordinate.
     * @param {number} offsetY Offset in px from center of circle by y-coordinate.
     * @param {number} width Width of icon.
     * @param {number} height Height of icon.
     */
    constructor(offsetX, offsetY, width, height) {
        this.offset = {
            'x': offsetX,
            'y': offsetY
        }
        this.dimensions = {
            'width': width,
            'height': height
        }
    }
}

/**
 * Clears the canvas. Required when update data on the speedometer.
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws left circle (tachometer).
 * @param {Object} options Circle options such as colors, font etc. In more detail in the description of the class.
 * @param {number} radius Radius of main circle (speedometer). Required to correctly calculate the radius of a circle.
 * @param {number} value Current value of tachometer. Min is 0 (lowest), max is 1 (highest).
 * @param {Object} iconStates States of icons displayed on circle.
 */
function drawLeftCircle(options, radius, value, iconStates) {
    const lCircle = new AdditionalCircle(options, 'left', radius);
    lCircle.draw();

    const addMarksAngles = lCircle.calcMarksAngles(
        count=8,
        degAngle=140,
        startAngle=300
    );

    const mainMarksAngles = lCircle.calcMarksAngles(
        count=9,
        degAngle=160,
        startAngle=300
    );

    lCircle.drawDangerZone(
        angles=addMarksAngles,
        offset=6,
        firstNMarks=0,
        lastNMarks=2
    );

    lCircle.drawDangerZone(
        angles=mainMarksAngles,
        offset=6,
        firstNMarks=0,
        lastNMarks=2
    );

    lCircle.drawMarks(
        angles=addMarksAngles,
        length=7.5,
        lineWidth=2,
        border=true,
        offset=1,
        firstNMarks=0,
        lastNMarks=2
    );

    lCircle.drawMarks(
        angles=mainMarksAngles,
        length=6,
        lineWidth=3,
        border=true,
        offset=0,
        firstNMarks=0,
        lastNMarks=2
    );
    
    const textMarksAngles = lCircle.calcTextMarksAngles(
        count=9,
        degAngle=160,
        innerOffset=5,
        startAngle=300
    );

    lCircle.drawTextMarks(
        angles=textMarksAngles,
        step=1,
        offset=12.5
    );

    lCircle.drawIcon('battery', iconStates['battery']);
    lCircle.drawIcon('oil', iconStates['oil']);
    lCircle.drawIcon('engineFail', iconStates['engineFail']);

    lCircle.drawMultiplier(1, -20);

    lCircle.drawArrow(
        value=value,
        degAngle=160,
        offset=5,
        startAngle=300
    );

    lCircle.drawArrowBody();
}

/**
 * Draws right circle (gas indicator).
 * @param {Object} options Circle options such as colors, font etc. In more detail in the description of the class.
 * @param {number} radius Radius of main circle (speedometer). Required to correctly calculate the radius of a circle.
 * @param {number} value Current value of gas indicator. Min is 0 (lowest), max is 1 (highest).
 * @param {Object} iconStates States of icons displayed on circle.
 */
function drawRightCircle(options, radius, value, iconStates) {
    const rCircle = new AdditionalCircle(options, 'right', radius);
    rCircle.draw();

    const addMarksAngles = rCircle.calcMarksAngles(
        count=8,
        degAngle=140,
        startAngle=80
    );

    const mainMarksAngles = rCircle.calcMarksAngles(
        count=9,
        degAngle=160,
        startAngle=80
    );

    rCircle.drawDangerZone(
        angles=addMarksAngles,
        offset=6,
        firstNMarks=0,
        lastNMarks=2
    );

    rCircle.drawDangerZone(
        angles=mainMarksAngles,
        offset=6,
        firstNMarks=0,
        lastNMarks=2
    );

    rCircle.drawMarks(
        angles=addMarksAngles,
        length=7.5,
        lineWidth=2,
        border=true,
        offset=1,
        firstNMarks=0,
        lastNMarks=2,
        skip='all',
        skipFrom=0,
        skipTo=5
    );

    rCircle.drawMarks(
        angles=mainMarksAngles,
        length=6,
        lineWidth=3,
        border=true,
        offset=0,
        firstNMarks=0,
        lastNMarks=2,
        skip='even',
        skipFrom=0,
        skipTo=6
    );
    
    const textMarksAngles = rCircle.calcTextMarksAngles(
        count=3,
        degAngle=160,
        innerOffset=-5,
        startAngle=80
    );

    rCircle.drawTextMarks(
        angles=textMarksAngles,
        step=0.5,
        offset=17.5,
        fractions=true,
        reversed=true
    );

    rCircle.drawIcon('gas', iconStates['gas']);
    rCircle.drawIcon('trunk', iconStates['trunk']);
    rCircle.drawIcon('bonnet', iconStates['bonnet']);
    rCircle.drawIcon('doors', iconStates['doors']);

    rCircle.drawArrow(
        value=Math.abs(value - 1),
        degAngle=160,
        offset=5,
        startAngle=80
    );

    rCircle.drawArrowBody();
}

/**
 * Draws all circles.
 * @param {number} speedometerValue Current speed.
 * @param {number} tachometerValue Curent engine revs.
 * @param {number} gasValue Current gas tank fullness.
 * @param {number} mileage Current mileage.
 * @param {Object} turnSignals Current state of turn signals.
 * @param {Object} iconStates Current state of icons.
 */
function draw(speedometerValue, tachometerValue, gasValue, mileage, turnSignals, iconStates) {
    clearCanvas();

    const mCircle = new MainCircle(options);
    drawLeftCircle(options, mCircle.radius, tachometerValue, iconStates);
    drawRightCircle(options, mCircle.radius, gasValue, iconStates);
    
    mCircle.draw();

    const addMarksAngles = mCircle.calcMarksAngles(
        count=10,
        degAngle=180
    );

    const mainMarksAngles = mCircle.calcMarksAngles(
        count=11,
        degAngle=200
    );

    mCircle.drawMarks(
        angles=addMarksAngles,
        length=7.5,
        lineWidth=2,
        border=true,
        offset=4,
        firstNMarks=0,
        lastNMarks=0
    );

    mCircle.drawMarks(
        angles=mainMarksAngles,
        length=7,
        lineWidth=3,
        border=true,
        offset=3
    );

    const textMarksAngles = mCircle.calcTextMarksAngles(
        count=11,
        degAngle=200,
        innerOffset=7.5
    );

    mCircle.drawTextMarks(
        angles=textMarksAngles,
        step=20,
        offset=22.5
    );

    mCircle.drawTurnSignal(35, -25, 25, 15, turnSignals['right']);
    mCircle.drawTurnSignal(-35, -25, -25, 15, turnSignals['left']);

    mCircle.drawIcon('dippedBeam', iconStates['dippedBeam']);
    mCircle.drawIcon('brake', iconStates['brake']);
    mCircle.drawIcon('drift', iconStates['drift']);
    mCircle.drawIcon('highBeam', iconStates['highBeam']);
    mCircle.drawIcon('lock', iconStates['lock']);
    mCircle.drawIcon('seatBelt', iconStates['seatBelt']);
    mCircle.drawIcon('engineTemp', iconStates['engineTemp']);
    mCircle.drawIcon('stab', iconStates['stab']);
    mCircle.drawIcon('abs', iconStates['abs']);

    mCircle.drawMileage(mileage, 0, 60, 100, 20, 2);
    
    mCircle.drawUnit(-25);
    
    mCircle.drawArrow(
        value=speedometerValue,
        degAngle=200,
        offset=10
    );

    mCircle.drawArrowBody();
}

const icons = {
    // main circle
    'dippedBeam': new Icon(-22.5, 47.5, 10, 150 * 0 + 10 * 1, 17.5, 17.5, 2),
    'brake':      new Icon(-80, 47.5, 10, 150 * 1 + 10 * 2, 17.5, 17.5, 2),
    'drift':      new Icon(0, 47.5, 10, 150 * 2 + 10 * 3, 17.5, 17.5, 2),
    'highBeam':   new Icon(-45, 47.5, 10, 150 * 4 + 10 * 5, 17.5, 17.5, 2),
    'lock':       new Icon(80, 47.5, 10, 150 * 6 + 10 * 7, 17.5, 17.5, 2),
    'seatBelt':   new Icon(45, 47.5, 10, 150 * 8 + 10 * 9, 17.5, 17.5, 2),
    'engineTemp': new Icon(62.5, 70, 10, 150 * 10 + 10 * 11, 17.5, 17.5, 3),
    'stab':       new Icon(22.5, 47.5, 10, 150 * 12 + 10 * 13, 17.5, 17.5, 2),
    'abs':        new Icon(-62.5, 70, 10, 150 * 14 + 10 * 15, 17.5, 17.5, 2),
    // right circle
    'gas':        new Icon(5, 55, 10, 150 * 3 + 10 * 4, 17.5, 17.5, 3),
    'trunk':      new Icon(22.5, 25, 10, 150 * 7 + 10 * 8, 17.5, 17.5, 2),
    'bonnet':     new Icon(-5, 25, 10, 150 * 11 + 10 * 12, 17.5, 17.5, 2),
    'doors':      new Icon(-17.5, 47.5, 10, 150 * 15 + 10 * 16, 17.5, 17.5, 2),
    // left circle
    'battery':    new Icon(17.5, 50, 10, 150 * 5 + 10 * 6, 17.5, 17.5, 3),
    'oil':        new Icon(5, 32.5, 10, 150 * 9 + 10 * 10, 17.5, 17.5, 3),
    'engineFail': new Icon(-10, 50, 10, 150 * 13 + 10 * 14, 17.5, 17.5, 3)
}

const turnSignals = {
    'left':  new TurnSignal(-17.5, -40, 20, 15),
    'right': new TurnSignal(17.5, -40, 20, 15)
}

const options = {
    'circleBorderWidth': 4,
    'circleBorderColor': '#8b8b8b',
    'circleFillColor': '#000000',
    'markFillColor': '#ffffff',
    'markStrokeColor': '#000000',
    'markFontColor': '#ffffff',
    'markFontSize': '14',
    'markFontStyle': 'italic',
    'markFontFamily': 'Arial, sans-serif',
    'arrowBodyFillColor': '#0d0d0d',
    'arrowBodyStrokeColor': '#212121',
    'arrowColor': '#ff0000',
    'arrowBaseWidth': 2.5,
    'arrowBorderWidth': 3,
    'dangerColor': '#c1272d',
    'dangerZoneWidth': 5,
    'turnSignalColor': '#57d53f',
    'speedUnit': 'km',
    'icons': icons,
    'turnSignal': turnSignals
}
