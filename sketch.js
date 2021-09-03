
//container variable font
const article = document.querySelector(".variable-font");

// text input
const contentTxtInput = document.querySelector("#txt-content");
var txt = contentTxtInput.value;
var letters = [];

//générate span for each letter
function loadTxtInput() {
	while (article.firstChild) {
		article.removeChild(article.lastChild);
	}
	var mots = txt.split(" ");
	var index = 0;

	for (var m = 0; m < mots.length; m++) {
		var motContainer = document.createElement("div");
		motContainer.classList.add("mot" + m);
		article.append(motContainer);

		for (var l = 0; l < mots[m].length; l++) {
			var letter = document.createElement("span");
			letter.innerHTML = txt[index];
			letters.push(letter);
			motContainer.append(letter);
			index++;
		}
		var space = document.createElement("span");
		space.innerHTML = "&nbsp;";
		motContainer.append(space);
		index++;
	}
}
loadTxtInput();

//init text field
contentTxtInput.addEventListener('input', e => {
	txt = e.target.value;
	loadTxtInput();
	initThumbAnim(minValue, maxValue, animSpeed);
	initAnimFont(minValue, maxValue, animSpeed, delaySpeed);
});

//init text align 
const FlexAlignInput = document.querySelector("#align-select");
FlexAlignInput.addEventListener('input', e => {
	document.querySelector(".variable-font").style.justifyContent = e.target.value;
	loadTxtInput();
	initThumbAnim(minValue, maxValue, animSpeed);
	initAnimFont(minValue, maxValue, animSpeed, delaySpeed);
});

//container slider
const containerSlider = document.querySelector("#slider-distance");

//init DOM el of slider
const thumbMinRange = document.querySelector(".thumb-min");
const spanMinRange = thumbMinRange.nextElementSibling;
const thumbMiddleRange = document.querySelector(".thumb-middle");
const spanMiddleRange = thumbMiddleRange.nextElementSibling;
const thumbMaxRange = document.querySelector(".thumb-max");
const spanMaxRange = thumbMaxRange.nextElementSibling;

const thumbMinSize = thumbMinRange.offsetWidth;
const thumbMiddleSize = thumbMiddleRange.offsetWidth;
const thumbMaxSize = thumbMaxRange.offsetWidth;

const inBetween = document.querySelector(".in-between");

//init pos of slider container in page
var sliderPosLeft, sliderWidth, finSlider, sliderPosTop;

//actual pos of element
var minValue, middleValue, maxValue;

//position in pourcent of thumbs
var prcMin = 15;
var prcMiddle = 50;
var prcMax = 65;

var animSpeed = 1000;

//init speed on slider
document.querySelector("#anim-speed").addEventListener('change', e => {
	var el = e.target;
	min = e.target.min;
	max = e.target.max;
	console.log(el, min, max);
	animSpeed = Math.round(map(el.value, min, max, 1500, 100));
	initThumbAnim(minValue, maxValue, animSpeed);
	initAnimFont(minValue, maxValue, animSpeed, delaySpeed);
});

//init speed on slider
var delaySpeed = 0;
document.querySelector("#delay-speed").addEventListener('change', e => {
	var el = e.target;
	delaySpeed = e.target.value;
	console.log(delaySpeed);
	initThumbAnim(minValue, maxValue, animSpeed);
	initAnimFont(minValue, maxValue, animSpeed, delaySpeed);
});

// init value and pos of thumbs
function initValues() {
	sliderPosLeft = containerSlider.getBoundingClientRect().left;
	sliderPosTop = containerSlider.offsetTop;
	sliderWidth = containerSlider.offsetWidth - thumbMaxSize;
	finSlider = sliderPosLeft + sliderWidth;
	console.log("pos container", "left pos " + sliderPosLeft, "slider width " + sliderWidth, "fin slider left " + finSlider);

	minValue = sliderWidth * prcMin / 100;
	middleValue = sliderWidth * prcMiddle / 100;
	maxValue = sliderWidth * prcMax / 100.

	console.log("pos container: " + minValue, "mid: " + middleValue, "max " + maxValue, "width:" + sliderWidth);
	thumbMinRange.style.transform = "translateX(" + minValue + "px)";
	initSpan(spanMinRange, prcMin, minValue);

	thumbMiddleRange.style.transform = "translateX(" + middleValue + "px)";
	// initSpan(spanMiddleRange, prcMiddle, middleValue);

	thumbMaxRange.style.transform = "translateX(" + maxValue + "px)";
	initSpan(spanMaxRange, prcMax, maxValue);

	// console.log(minValue, middleValue, maxValue);
}
initValues();

// Drag thumbs and store Values 
var DraggableMin = new PlainDraggable(thumbMinRange);
DraggableMin.onDrag = (e) => {
	minValue = e.left - sliderPosLeft;
	var transformStyle = thumbMiddleRange.style.transform;
	middleValue = transformStyle.replace(/[^\d.]/g, '');
	initInBetween();
};

var DraggableMiddle = new PlainDraggable(thumbMiddleRange);
DraggableMiddle.onDrag = (e) => {
	middleValue = e.left - sliderPosLeft;
	initInBetween();
};

var DraggableMax = new PlainDraggable(thumbMaxRange);
DraggableMax.onDrag = (e) => {
	maxValue = e.left - sliderPosLeft;
	var transformStyle = thumbMiddleRange.style.transform;
	middleValue = transformStyle.replace(/[^\d.]/g, '');
	initInBetween();
};

// Init Pos and value of span
function initSpan(el, prc, px) {
	el.innerHTML = Math.round(px) + " ";
	el.style.transform = "translateX(" + px + "px)";
}

// Init pos of in between, pourcentage Value of thumbs and reload animation
function initInBetween() {
	inBetween.style.left = minValue + "px";
	inBetween.style.width = maxValue - minValue + thumbMaxSize + "px";

	//contrain les thumbs dans 
	DraggableMiddle.containment = { left: minValue + sliderPosLeft, top: 150, width: maxValue - minValue + 28, height: 1 };
	DraggableMin.containment = { left: sliderPosLeft, top: 150, width: maxValue, height: 1 };
	DraggableMax.containment = { left: minValue + sliderPosLeft + 28, top: 150, width: sliderWidth - minValue, height: 1 };

	prcMin = minValue / sliderWidth * 100;
	prcMiddle = middleValue / sliderWidth * 100;
	prcMax = maxValue / sliderWidth * 100;

	initSpan(spanMinRange, prcMin, minValue);
	// initSpan(spanMiddleRange, prcMiddle, middleValue);
	initSpan(spanMaxRange, prcMax, maxValue);

	initThumbAnim(minValue, maxValue, animSpeed);
	initAnimFont(minValue, maxValue, animSpeed, delaySpeed);
}
initInBetween();


//span current value
var moving = false;
var currentPos;
thumbMiddleRange.addEventListener('transitionend', function () {
	moving = true;
});
function getPosition() {
	currentPos = thumbMiddleRange.getBoundingClientRect().left - sliderPosLeft;
	inBetweenPos = inBetween.getBoundingClientRect().left;
	inBetweenWidth = inBetween.offsetWidth;
	if (!moving) {
		window.requestAnimationFrame(getPosition);
	}
	spanMiddleRange.innerHTML = Math.round(currentPos) + " weight";
	spanMiddleRange.style.transform = "translateX(" + Math.round(inBetween.offsetLeft + inBetweenWidth / 2 - spanMiddleRange.offsetWidth / 2) + "px)";
}
window.requestAnimationFrame(getPosition);

//anim middle speed
function initThumbAnim(min, max, animSpeed) {
	thumbMiddleRange.animate([
		{ transform: 'translateX(' + min + 'px)' },
		{ transform: 'translateX(' + max + 'px)' }
	], {
		duration: animSpeed,
		iterations: Infinity,
		direction: 'alternate',
		easing: 'cubic-bezier(0, 0, 0.58, 1.0)'
	});
}

//animate letter
function initAnimFont(min, max, time, delay) {
	var idLetter = 0;
	letters.forEach(function (el) {
		var monDelay = map(idLetter * delay, 0, letters.length, 0, time);
		el.animate([
			{ fontWeight: min + 1 },
			{ fontWeight: max }
		], {
			duration: time,
			delay: -monDelay,
			iterations: Infinity,
			direction: 'alternate',
			easing: 'cubic-bezier(0, 0, 0.58, 1.0)'
		});
		// console.log(idLetter, monDelay);
		idLetter++
	})
}


window.addEventListener('resize', initValues);
window.addEventListener('resize', initInBetween);



function map(n, start1, stop1, start2, stop2) {
	return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}
