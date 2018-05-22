// Wrapped it into an IIFE to protect namespacing.
(function (document) {
  'use strict'

  /**
   * @description Initialize the cards by looking up the `.card` nodes in the DOM,
   *              bind a click event, and then instantiating a new Card object.
   *
   * @param {Object} config Runtime configuration parameters
   * @function
   */
  function buildCards () {
    // Array of game Card objects
    let cardz = document.querySelectorAll('.card')
    return (Array.from(cardz))
  }

  let arr = buildCards()
  let matchTwoCards = []
  let isMatch = {}
  let counter = {}
  let timeinterval;

  /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */

// Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle (array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  /**
   * set up the event listener for a card. If a card is clicked: TODO registerEventListeners
   *  - display the card's symbol (put this functionality in another function that you call from this one) TODO flipCard( index );
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) TODO openCards( index );
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) TODO lockCards([]);
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) TODO releaseCards([]);
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one) TODO plusCounter();
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) TODO callModal();
   */

  /**
   * Event listener for an array of cards. If a card is clicked call display the icon on that card.
   *
   * @since 1.0.0
   *
   * @param
   *
   * @return void
   */
  function registerEventListeners () {
    let cardz = document.getElementsByClassName('card')

    for (let k = 0; k < cardz.length; k++) {
      cardz[k].addEventListener('click', function (event) {

        event.stopPropagation()
        event.preventDefault()
        displayCards(k)
      }, false)
    }
  }

  /**
   * Call the flipCard function which will display the icon
   *
   * @since 1.0.0
   *
   * @param index of the card clicked
   *
   * @return void
   */
  function displayCards (index) {
    flipCard(index)
  }

  /**
   * Display the card's symbol
   *
   * @since 1.0.0
   *
   * @param index of the card clicked
   *
   * @return void
   */
  function flipCard (index) {
    let cardz = buildCards()

    openCards(index)
  }

  /**
   * add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *
   * @since 1.0.0
   *
   * @param index
   *
   * @return void
   */
  function openCards (index) {
    let cardz = buildCards()

    // Check to see if the counter has been initialized
    if (typeof isMatch.count === 'undefined') {

      // It has not... perform the initialization
      isMatch.count = 1
    } else {

      isMatch.count++
    }

    if (isMatch.count === 1) {

      // array of cards using fifo stack and limit total of two
      matchTwoCards.push(index)
      cardz[index].classList.remove('flip')
      cardz[index].classList.add('open')
      cardz[index].classList.add('show')

    } else if (isMatch.count === 2) {
      // array of cards using fifo stack and limited to total of two
      matchTwoCards.push(index)
      cardz[index].classList.remove('flip')
      cardz[index].classList.add('open')
      cardz[index].classList.add('show')
      updateMoves2()

      // now is the moment we have been waiting for, do they match
      getMatch(index)
    } else {
      isMatch.count = 0
    }
  }

  /**
   * if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) TODO lockCards([]);
   *
   * @since 1.0.0
   *
   * @param matchTwoCards
   *
   * @return void
   */
  function getMatch (index) {
    let cardz = buildCards()

    let firstCard = cardz[matchTwoCards[0]].children[0].getAttribute(
      'data-class')
    let secondCard = cardz[matchTwoCards[1]].children[0].getAttribute(
      'data-class')

    cardz[index].classList.add('open')
    cardz[index].classList.add('show')

    // icons have to match and it has to be two separate cards not one
    if (firstCard === secondCard && matchTwoCards[0] !== matchTwoCards[1]) {
      plusCounter()
      // These can be locked safely, remove the open and show classes
      lockCards()
    } else {

      sleep(5).then(() => {
        // tell the player the cards are mismatched.
        window.setTimeout(() => {
          cardz[matchTwoCards[0]].classList.add('mismatch')
          cardz[matchTwoCards[1]].classList.add('mismatch')
        }, 500)
      })
      releaseCards()
    }
  }

  /**
   * Description
   *
   * @since 1.0.0
   *
   * @param
   *
   * @return void
   */
  function lockCards () {
    let cardz = buildCards();

    for (let k = 0; k < 2; k++) {
      cardz[matchTwoCards[k]].classList.remove('open')
      cardz[matchTwoCards[k]].classList.remove('show')
      //alert('matchTwoCards[k]: ' + matchTwoCards[k])
      cardz[matchTwoCards[k]].classList.add('match')
      updateScore();

      sleep(5).then(() => {
        // empty the array for the next match.
        window.setTimeout(() => {
          let trash = matchTwoCards.pop()
          trash = matchTwoCards.pop()
          isMatch.count = 0
        })
      })
	    stopTimer( timeinterval )
      //TODO

    }
  }


  /**
   * Description
   *
   * @since 1.0.0
   *
   * @param
   *
   * @return
   */
  // https://davidwalsh.name/javascript-sleep-function
  // https://zeit.co/blog/async-and-await
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  /**
   * Description
   *
   * @since 1.0.0
   *
   * @param
   *
   * @return void
   */
  function releaseCards () {
    let cardz = document.querySelectorAll('.card')

    for (let k = 0; k < 2; k++) {

      // Usage!
      sleep(1500).then(() => {

        for (let k = 0; k < 2; k++) {
          cardz[matchTwoCards[k]].classList.remove('open')
          cardz[matchTwoCards[k]].classList.remove('show')
          cardz[matchTwoCards[k]].classList.remove('mismatch')
        }
        // Do something after the sleep!
        let trash = matchTwoCards.pop()
        trash = matchTwoCards.pop()
        isMatch.count = 0
      }, 500)
    }
  }

  /**
   * Description
   *
   * @since 1.0.0
   *
   * @param
   *
   * @return void
   */
  function plusCounter () {
    ++counter.count
    updateMoves2(counter.count)
  }

  counter.numberMoves = 0

  function updateMoves2 () {
    plusMoves()
    document.getElementById('updateMoves').innerHTML = counter.numberMoves
  }

  function plusMoves () {
    ++counter.numberMoves
  }

  counter.numberScore = 0

  function updateScore () {
    plusScore()
    document.getElementById('updateScore').innerHTML = counter.numberScore
  }

  function plusScore () {
    counter.numberScore += 100
  }

  /**
   * Description
   *
   * @since 1.0.0
   *
   * @param
   *
   * @return void
   */
  function callModal () {

  }

	/**
	 * Description
	 *
	 * @since 1.0.0
	 *
	 * @param timeinterval
	 *
	 * @return void
	 */
	function stopTimer( timeinterval ) {
		var clock = document.getElementById( "clockdiv" );
		var secondsSpan = clock.querySelector('.seconds');

		function updateClock() {
			var t = getTimeRemaining( endtime );

			secondsSpan.innerHTML = (
				'0' + t.seconds
			).slice( - 2 );

			if ( t.seconds <= 0 ) {
				clearInterval( timeinterval );  // <<<<<------ not sure how to do this
			}
		}
		return( timeinterval );
	}

	/**
	 * Description
	 *
	 * @since 1.0.0
	 *
	 * @param
	 *
	 * @return void
	 */
	// https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
	function getTimeRemaining(endtime) {
		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor((t / 1000) % 60);
		return { 'seconds': seconds };
	}

	/**
	 * Description
	 *
	 * @since 1.0.0
	 *
	 * @param   id
	 *          endtime
	 *
	 * @return void
	 */
	function initializeClock(id, endtime) {
		var clock = document.getElementById(id);
		var secondsSpan = clock.querySelector('.seconds');

		function updateClock() {
			var t = getTimeRemaining(endtime);

			secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

			if (t.total <= 0) {
				clearInterval(timeinterval);
			}
		}

		updateClock();

		/**
		 * timeinterval is a global varaialbe so that it can be passed back and forth,
		 * yea I know its bad
		 */
		timeinterval = setInterval(updateClock, 1000);
	}

	//var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
	var deadline = new Date(Date.parse(new Date()) + 1 * 1 * 1 * 180 * 1000);
	initializeClock('clockdiv', deadline);
   registerEventListeners()

}(document))
