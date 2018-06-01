// Wrapped it into an IIFE to protect namespacing.
//noinspection JSAnnotator,JSAnnotator
(
	function ( document ) {
		'use strict'

		let body = document.querySelector( 'body' ),

			wonClasses = document.getElementById( 'won-game' ).classList,
			lostClasses = document.getElementById( 'lost-game' ).classList,

			lostButton = document.getElementById( 'button__lost-game' ),
			wonButton = document.getElementById( 'button__won-game' ),

			restartIcon = document.getElementById( 'restart-icon' ),

			//openCards = [],
			isMatch = {},
			counter = {},
			timeinterval

		//let arr = buildCards()
		//let allCards = document.querySelectorAll( '.card' )
		//
		//let cards = [ 'fa-diamond',       'fa-diamond',
		//              'fa-paper-plane-o', 'fa-paper-plane-o',
		//              'fa-anchor',        'fa-anchor',
		//              'fa-bolt',          'fa-bolt',
		//              'fa-cube',          'fa-cube',
		//              'fa-leaf',          'fa-leaf',
		//              'fa-bicycle',       'fa-bicycle',
		//              'fa-bobm',          'fa-bomb'
		//]
		//
		//function generateCard( card ) {
		//`<li class="card flip">
            <!--<i class="fa ${card}" data-class="${card}"></i>-->
            <!--<div class="container fire">-->
               <!--<div class="flamer">-->
                  <!--<a href="/">-->
                     <!--<div class="flame-wrap">-->
                        <!--<div class="flame1 flame"></div>-->
                        <!--<div class="flame2 flame"></div>-->
                        <!--<div class="flame3 flame"></div>-->
                        <!--<div class="flame4 flame"></div>-->
                        <!--<div class="flame5 flame"></div>-->
                     <!--</div>-->
                  <!--</a>-->
               <!--</div>-->
            <!--</div>-->
         <!--</li>-->`
		//}
		//
		//function initGame() {
		//	let deck = document.querySelector( '.deck' )
		//	let cardHTML = shuffle(cards).map( function ( card ) {
		//		return generateCard( card )
		//	})
		//
		//	deck.innerHTML = cardHTML.join( '' );
		//}
		//
		allCards.forEach( function ( card ) {
			card.addEventListener( 'click', function ( e ) {

				if ( ! card.classList.contains( 'open' ) &&
				     ! card.classList.contains( 'show' ) &&
				     ! card.classList.contains( 'match' ) ) {
					openCards.push( card )
					card.classList.add( 'open', 'show' )
					console.log( 'Open Cards: ', openCards.length )

					if ( 2 === openCards.length ) {
						setTimeout( function () {
							openCards.forEach( function ( card ) {
								card.classList.remove( 'open', 'show' )
							} )

							openCards = []
						}, 1500 )
					}
				}
			} )
		} )
		//
		/**
		 * @description Initialize the cards by looking up the `.card` nodes in the DOM,
		 *              bind a click event, and then instantiating a new Card object.
		 * @returns {any[]}
		 */
		function buildCards() {
			// Array of game Card objects
			let allCards = document.querySelectorAll( '.card' )

			return (
				Array.from( allCards )
			)
		}

		/**
		 * Display the cards on the page
		 *   - shuffle the list of cards using the provided "shuffle" method below
		 *   - loop through each card and create its HTML
		 *   - add each card's HTML to the page
		 */

		/**
		 * @description  Shuffle function from http://stackoverflow.com/a/2450976
		 * @param array
		 * @returns {*}
		 */
		function shuffle( array ) {
			let currentIndex = array.length, temporaryValue, randomIndex

			while ( currentIndex !== 0 ) {
				randomIndex = Math.floor( Math.random() * currentIndex )
				currentIndex -= 1
				temporaryValue = array[ currentIndex ]
				array[ currentIndex ] = array[ randomIndex ]
				array[ randomIndex ] = temporaryValue
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
		 *    https://www.youtube.com/watch?v=_rUH-sEs68Y
		 */

		/**
		 * @description Event listener for an array of cards. If a card is clicked call display
		 *              the icon on that card.
		 */
		function registerEventListeners() {
			let allCards = document.getElementsByClassName( 'card' )

			for ( let k = 0; k < allCards.length; k ++ ) {
				allCards[ k ].addEventListener( 'click', function ( event ) {

					event.stopPropagation()
					event.preventDefault()
					displayCards( k )
				}, false )
			}
			allCards = shuffle( allCards )
		}

		/**
		 * @description Call the flipCard function which will display the icon
		 * @param index
		 */
		function displayCards( index ) {
			flipCard( index )
		}

		/**
		 * @description Display the card's symbol
		 * @param index
		 */
		function flipCard( index ) {
			let allCards = buildCards()

			openCards( index )
		}

		/**
		 * @description add the card to a *list* of "open" cards (put this functionality in
		 *              another function that you call from this one)
		 * @param index
		 */
		function openCards( index ) {
			allCards = buildCards()

			// Check to see if the counter has been initialized
			if ( typeof isMatch.count === 'undefined' ) {

				// It has not... perform the initialization
				isMatch.count = 1
			} else {

				isMatch.count ++
			}

			if ( isMatch.count === 1 ) {

				// array of cards using fifo stack and limit total of two
				openCards.push( index )
				allCards[ index ].classList.remove( 'flip' )
				allCards[ index ].classList.add( 'open' )
				allCards[ index ].classList.add( 'show' )

			} else if ( isMatch.count === 2 ) {
				// array of cards using fifo stack and limited to total of two
				openCards.push( index )
				allCards[ index ].classList.remove( 'flip' )
				allCards[ index ].classList.add( 'open' )
				allCards[ index ].classList.add( 'show' )
				updateMoves()

				// now is the moment we have been waiting for, do they match
				getMatch( index )
			} else {
				isMatch.count = 0
			}
		}

		/**
		 * @description if the cards do match, lock the cards in the open position
		 *              (put this functionality in another function that you call from this one)
		 * @param index
		 */
		function getMatch( index ) {
			allCards = buildCards()

			let firstCard =
				allCards[ openCards[ 0 ] ].children[ 0 ].getAttribute( 'data-class' )

			let secondCard =
				allCards[ openCards[ 1 ] ].children[ 0 ].getAttribute( 'data-class' )

			allCards[ index ].classList.add( 'open' )
			allCards[ index ].classList.add( 'show' )

			// icons have to match and it has to be two separate cards not one
			if ( firstCard === secondCard && openCards[ 0 ] !== openCards[ 1 ] ) {
				plusCounter()
				// These can be locked safely, remove the open and show classes
				lockCards()
			} else {

				sleep( 5 ).then( () => {
					// tell the player the cards are mismatched.
					window.setTimeout( () => {
						allCards[ openCards[ 0 ] ].classList.add( 'mismatch' )
						allCards[ openCards[ 1 ] ].classList.add( 'mismatch' )
					}, 350 )
				} )
				releaseCards()
			}
		}

		/**
		 * @description
		 */
		function lockCards() {
			allCards = buildCards()

			for ( let k = 0; k < 2; k ++ ) {
				allCards[ openCards[ k ] ].classList.remove( 'open' )
				allCards[ openCards[ k ] ].classList.remove( 'show' )
				allCards[ openCards[ k ] ].classList.add( 'match' )
				updateScore()

				sleep( 5 ).then( () => {
					// empty the array for the next match.
					window.setTimeout( () => {
						let trash = openCards.pop()
						trash = openCards.pop()
						isMatch.count = 0
					} )
				} )
				if ( document.querySelectorAll( '.match' ).length === 16 ) {
					stopTimer()
					clearInterval( timeinterval )
					wonClasses.remove( 'none' )
					wonClasses.add( 'active' )
				}
			}
		}

		/**
		 * @description
		 * @param time
		 * @returns {Promise<any>}
		 */
		// https://davidwalsh.name/javascript-sleep-function
		// https://zeit.co/blog/async-and-await
		function sleep( time ) {
			return new Promise( ( resolve ) => setTimeout( resolve, time ) )
		}

		/**
		 * @description
		 */
		function releaseCards() {
			allCards = document.querySelectorAll( '.card' )

			sleep( 1000 ).then( () => {
				for ( let k = 0; k < openCards.length; k ++ ) {
					// Do something after the sleep!
					allCards[ openCards[ k ] ].classList.remove( 'open' )
					allCards[ openCards[ k ] ].classList.remove( 'show' )
					allCards[ openCards[ k ] ].classList.remove( 'mismatch' )
					openCards.pop()
					isMatch.count = 0
				}
			}, 300 )
		}

		/**
		 * @description
		 */
		function plusCounter() {
			++ counter.count
			updateMoves( counter.count )
		}

		counter.numberMoves = 0

		/**
		 * @description
		 */
		function updateMoves() {
			plusMoves()
			document.getElementById( 'updateMoves' ).innerHTML = counter.numberMoves
		}

		/**
		 * @description
		 */
		function plusMoves() {
			++ counter.numberMoves
		}

		counter.numberScore = 0

		/**
		 * @description
		 */
		function updateScore() {
			plusScore()
			document.getElementById( 'updateScore' ).innerHTML = counter.numberScore
		}

		/**
		 * @description
		 */
		function plusScore() {
			counter.numberScore += 100
		}

		/**
		 * @description
		 */
		function stopTimer() {
			clearInterval( timeinterval )
		}

		/**
		 * @description
		 * @param endtime
		 * @returns {{total: number, seconds: number}}
		 */
		// https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
		function getTimeRemaining( endtime ) {
			let t = Date.parse( endtime ) - Date.parse( new Date() )
			let seconds = Math.floor( (
				                          t / 1000
			                          ) )

			return {
				'total':   t,
				'seconds': seconds,
			}
		}

		/**
		 * @description
		 * @param id
		 * @param endtime
		 */
		function initializeClock( id, endtime ) {
			let clock = document.getElementById( id )
			let secondsSpan = clock.querySelector( '.seconds' )

			function updateClock() {
				let t = getTimeRemaining( endtime )

				secondsSpan.innerHTML = (
					'0' + t.seconds
				)//.slice( - 3 )

				if ( t.total > 0 && document.querySelectorAll( '.match' ).length === 16 ) {
					clearInterval( timeinterval )
					wonClasses.remove( 'none' )
					wonClasses.add( 'active' )

				} else if ( t.total <= 0 ) {
					clearInterval( timeinterval )
					lostClasses.remove( 'none' )
					lostClasses.add( 'active' )
				}
			}

			updateClock()
			timeinterval = setInterval( updateClock, 1000 )
		}

//======================================================================

		/**
		 * @description
		 *
		 */
		function closeWonModal() {
			wonClasses.add( 'none' )
			document.getElementById( 'won-game' ).style.display = 'none'
			init()
		}

		wonButton.addEventListener( 'click', closeWonModal, false )

		function closeLostModal() {
			lostClasses.add( 'none' )
			document.getElementById( 'lost-game' ).style.display = 'none'
			init()
		}

		lostButton.addEventListener( 'click', closeLostModal, false )

		function restartGame() {
			stopTimer()
			let deadline = new Date( Date.parse( new Date() ) + 1 * 1 * 1 * 60 * 1000 )
			initializeClock( 'clockdiv', deadline )
		}

		restartIcon.addEventListener( 'click', restartGame, false )


		/** ************************************************************************
		 *  Start the game
		 ** ***********************************************************************/

		//function init() {
		//	let deadline = new Date( Date.parse( new Date() ) + 1 * 1 * 1 * 40 * 1000 )
		//	initializeClock( 'clockdiv', deadline )
		//	registerEventListeners()
		//}
		//
		//init()

	}( document )
)