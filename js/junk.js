const time = document.getElementById('time');
// t is a global letiable therefore its val can be accessed anywhere
let t = 0;

const restart = document.querySelector('.restart');

function Timer() {
	let timer = setInterval(function() {
		console.log(t);
		t++;
		if (t >= 0) {
			time.innerHTML = t;

			//here could put other conditionals to make mins or whatever
			/*clearInterval(timer);*/

		}
	}, 1000);
}

let timer = new Timer();
console.log(t);


// List of all cards
let allCards = ['fa-diamond', 'fa-diamond',
                'fa-paper-plane-o', 'fa-paper-plane-o',
                'fa-anchor', 'fa-anchor',
                'fa-bolt', 'fa-bolt',
                'fa-cube', 'fa-cube',
                'fa-leaf', 'fa-leaf',
                'fa-bicycle', 'fa-bicycle',
                'fa-bomb', 'fa-bomb'
];

// Moves letiables
//let moveCounter = document.querySelector('.moves');
let moves = 0;

// Keep track of cards flipped
let openCards = [];

//Load new game and then shuffle
newGame();

/*   - shuffle the list of cards using the provided "shuffle" method below*/
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/*
 *   - loop through each card and create its HTML Maybe re do again?? Look it up later
 */
function makeCard(card) {
	return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

function newGame() {
	let deck = document.querySelector('.deck');
	let cardGrid = shuffle(allCards).map(function(card) {
		return makeCard(card);
	});
	deck.innerHTML = cardGrid.join('');
}

//set up listener event if card is clicked

let cardList = document.querySelectorAll('.card');
for (let card of cardList) {
	card.addEventListener('click', function(flipCard) {
		//Disable clicking on the same card
		if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
			currentT = t;
			//Add the card to a *list* of "open" cards
			openCards.push(card);

			//Prevent from showing more than two cards
			if (openCards.length > 2) {
				//hide
			} else {
				//Show cards
				card.classList.add('open', 'show');
				//Check if cards match
				if (openCards[0].dataset.card === openCards[1].dataset.card) {
					cardMatch();
				} else {
					notMatching();
				}
			}
		}
	});

	// cardMatch function
	function cardMatch() {
		openCards[0].classList.add('match');
		openCards[0].classList.add('open');
		openCards[0].classList.add('show');

		openCards[1].classList.add('match');
		openCards[1].classList.add('open');
		openCards[1].classList.add('show');

		//empty  array
		openCards = [];
	}
	//reset and restart
	restart.addEventListener('click', reset);}

function reset() {
	location.reload();
}
// Not matching function
function notMatching() {

	//Flip over after a bit more than 1/2second
	setTimeout(function() {
		for (let card of openCards) {
			card.classList.remove('open', 'show');
		}

		openCards = []; //Empty openCards array
	}, 700);
	// const time = document.getElementById('time');


}

const starRating = document.getElementsByClassName('stars')[0];

function rating () {
	switch (moves) {
		case 15:
			starRating.innerHTML = `<li><i class="fa fa-star"></i></li>
              <li><i class="fa fa-star"></i></li>`;
			break;

		case 20:
			starRating.innerHTML = `<li><i class="fa fa-star"></i></li>`;
			break;

		default:
	}
}

// Move Counter function
function moveCounter() {
	moves++;
	moveCounter.innerHTML = moves;
}
