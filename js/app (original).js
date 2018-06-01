// Wrapped it into an IIFE to protect namespacing.
//noinspection JSAnnotator,JSAnnotator
(
	function ( document ) {
		//'use strict'


		let body = document.querySelector( 'body' ),

			numberOfSeconds = 60,
			deadline = new Date( Date.parse( new Date() ) + 1 * 1 * 1 * numberOfSeconds * 1000 ),

			wonClasses = document.getElementById( 'won-game' ).classList,
			lostClasses = document.getElementById( 'lost-game' ).classList,
			infoClasses = document.getElementById( 'info-game' ).classList,

			lostButton = document.getElementById( 'button__lost-game' ),
			wonButton = document.getElementById( 'button__won-game' ),
			infoButton = document.getElementById( 'button__info-game' ),

			infoIcon = document.getElementById( 'info-icon' ),
			restartIcon = document.getElementById( 'restart-icon' ),

			cardz = buildCards(),
			openCards = [],
			isMatch = {},
			userStats = {},
			timeinterval

		let starsRules = [
			// 1 star minimum
			{
				minMoves: 21,
				minScore: 4800,
			},
			// 2 stars minimum
			{
				minMoves: 17,
				minScore: 4800,
			},
			// 3 stars minimum
			{
				minMoves: 13,
				minScore: 18000,
			},
		]


		/**
		 * @description Initialize the cards by looking up the `.card` nodes in the DOM,
		 *              bind a click event, and then instantiating a new Card object.
		 * @returns {any[]}
		 */
		function buildCards() {

			// Array of game Card objects
			let cardz = document.querySelectorAll( '.card' )

			return (
				Array.from( shuffle( cardz ) )
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
		 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) TODO addToOpenCards( index );
		 *  - if the list already has another card, check to see if the two cards match
		 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) TODO lockCards([]);
		 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) TODO releaseCards([]);
		 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one) TODO updateCounter();
		 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) TODO callModal();
		 */

		/**
		 * @description Event listener for an array of cards. If a card is clicked call display
		 *              the icon on that card.
		 */
		function registerEventListeners() {
			let cardz = document.getElementsByClassName( 'card' )

			for ( let k = 0; k < cardz.length; k ++ ) {
				cardz[ k ].addEventListener( 'click', function ( event ) {

					event.stopPropagation()
					event.preventDefault()
					displayCards( k )
				}, false )
			}
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

			addToOpenCards( index )
		}

		/**
		 * @description add the card to a *list* of "open" cards (put this functionality in
		 *              another function that you call from this one)
		 * @param index
		 */
		//function addToOpenCards( index ) {
		//
		//	// Check to see if the counter has been initialized
		//	if ( typeof openCards.length === 'undefined' &&
		//		      ! openCards[ 0 ].contains( 'open' ) &&
		//		      ! openCards[ 0 ].contains( 'show' ) &&
		//		      ! openCards[ 0 ].contains( 'match' ) ) {
		//
		//	//	// It has not... perform the initialization
		//	//	isMatch.count = 1
		//	//} else if ( isMatch.count === 2 ) {
		//	//
		//	//} else {
		//	//	isMatch.count ++
		//	//}
		//	//console.log( 'openCards.length: ' + openCards.length )
		//
		//	if ( openCards.length === 0 ) {
		//
		//		// array of cards using fifo stack and limit total of two
		//		openCards.push( index )
		//		cardz[ index ].classList.remove( 'flip' )
		//		cardz[ index ].classList.add( 'open' )
		//		cardz[ index ].classList.add( 'show' )
		//
		//	} else if ( openCards.length === 1 ) {
		//		// array of cards using fifo stack and limited to total of two
		//		openCards.push( index )
		//		cardz[ index ].classList.remove( 'flip' )
		//		cardz[ index ].classList.add( 'open' )
		//		cardz[ index ].classList.add( 'show' )
		//		updateMoves()
		//
		//		// now is the moment we have been waiting for, do they match
		//		getMatch( index )
		//
		//	} else if ( openCards.length === 2 ) {
		//		isMatch.count = 1
		//		console.log( 'openCards: ' + openCards )
		//		openCards.pop()
		//	}
		//}

		/**
		 * @description Function to process cards.  Came from Mike Wales youtube broadcast
		 * @param index
		 */
		function addToOpenCards( index ) {
			cardz.forEach( function ( card ) {
				card.addEventListener( 'click', function ( e ) {

					if ( ! card.classList.contains( 'open' ) &&
					     ! card.classList.contains( 'show' ) &&
					     ! card.classList.contains( 'match' ) ) {
						openCards.push( card )
						card.classList.add( 'open', 'show' )
						//console.log( 'Open Cards: ', openCards.length )

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
		}

		/**
		 * @description if the cards do match, lock the cards in the open position
		 *              (put this functionality in another function that you call from this one)
		 * @param index
		 */
		function getMatch( index ) {

			let firstCard = cardz[ openCards[ 0 ] ].children[ 0 ].getAttribute(
				'data-class' )
			let secondCard = cardz[ openCards[ 1 ] ].children[ 0 ].getAttribute(
				'data-class' )

			cardz[ index ].classList.add( 'open' )
			cardz[ index ].classList.add( 'show' )

			// icons have to match and it has to be two separate cards not one
			if ( firstCard === secondCard && openCards[ 0 ] !== openCards[ 1 ] ) {

				updateCounter()
				// These can be locked safely, remove the open and show classes
				lockCards()
			} else {

				//sleep( 3 ).then( () => {
				//	// tell the player the cards are mismatched.
				//	setTimeout( function () {
				//
				//		if ( 2 === isMatch.count ) {
				//			cardz[ openCards[ 0 ] ].classList.add( 'mismatch' )
				//			cardz[ openCards[ 1 ] ].classList.add( 'mismatch' )
				//		}
				//	}, 500 )
				//} )
				//releaseCards()
			}
		}

		function getStars() {

		}

		/**
		 * @description
		 */
		function lockCards() {

			for ( let k = 0; k < 2; k ++ ) {
				cardz[ openCards[ k ] ].classList.remove( 'open' )
				cardz[ openCards[ k ] ].classList.remove( 'show' )
				cardz[ openCards[ k ] ].classList.add( 'match' )
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
			let cardz = document.querySelectorAll( '.card' )

			for ( let k = 0; k < 2; k ++ ) {

				// Usage!
				sleep( 1000 ).then( () => {

					for ( let k = 0; k < 2; k ++ ) {
						cardz[ openCards[ k ] ].classList.remove( 'open' )
						cardz[ openCards[ k ] ].classList.remove( 'show' )
						cardz[ openCards[ k ] ].classList.remove( 'mismatch' )
						console.log( cardz )
					}
					// Do something after the sleep!
					let trash = openCards.pop()
					trash = openCards.pop()
					isMatch.count = 0
				}, 300 )
			}
		}

		/**
		 * @description
		 */
		function updateCounter() {
			++ userStats.count
			//updateMoves( userStats.count )
		}

		userStats.numberMoves = 0

		/**
		 * @description
		 */
		function updateMoves() {
			++ userStats.numberMoves
			document.getElementById( 'updateMoves' ).innerHTML = userStats.numberMoves
		}

		userStats.numberScore = 0

		/**
		 * @description
		 */
		function updateScore() {
			userStats.numberScore += 100
			document.getElementById( 'updateScore' ).innerHTML = userStats.numberScore
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
					t.seconds
				)

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
		 * @param deadline
		 */
		function restoreState( deadline ) {
			for ( let k = 0; k < 16; k ++ ) {
				cardz[ k ].classList.remove( 'open' )
				cardz[ k ].classList.remove( 'show' )
				cardz[ k ].classList.remove( 'mismatch' )
				cardz[ k ].classList.remove( 'match' )
				cardz[ k ].classList.add( 'flip' )
			}
			//let deadline = new Date( Date.parse( new Date() ) + 1 * 1 * 1 * numberOfSeconds * 1000 )
			stopTimer()
			initializeClock( 'clockdiv', deadline )
		}

		/**
		 * @description
		 */
		function infoModal() {
			infoClasses.remove( 'none' )
			infoClasses.add( 'active' )
			document.getElementById( 'info-game' ).style.display = 'none'
		}

		infoButton.addEventListener( 'click', infoModal, false )

		/**
		 * @description
		 *
		 */
		function closeWonModal() {
			wonClasses.remove( 'none' )
			wonClasses.add( 'active' )
			document.getElementById( 'won-game' ).style.display = 'none'
			restoreState( new Date( Date.parse( new Date() ) + 1 * 1 * 1 * numberOfSeconds * 1000 ) )
		}

		wonButton.addEventListener( 'click', closeWonModal, false )

		/**
		 * @description
		 */
		function closeLostModal() {
			lostClasses.remove( 'none' )
			lostClasses.add( 'active' )
			document.getElementById( 'lost-game' ).style.display = 'none'
			restoreState( new Date( Date.parse( new Date() ) + 1 * 1 * 1 * numberOfSeconds * 1000 ) )
		}

		lostButton.addEventListener( 'click', closeLostModal, false )

		/**
		 * @description
		 */
		function infoGame() {

			document.getElementById( 'info-game' ).style.display = 'block'
			infoClasses.remove( 'none' )
			infoClasses.remove( 'active' )
		}

		infoIcon.addEventListener( 'click', infoGame, false )

		/**
		 * @description
		 */
		function restartGame() {

			if ( document.querySelectorAll( '.match' ).length === 16 ) {
				//document.getElementById( 'won-game' ).style.display = 'none';
				wonClasses.remove( 'none' )
				wonClasses.remove( 'active' )
			} else {
				//document.getElementById( 'lost-game' ).style.display = 'none'
				lostClasses.remove( 'none' )
				lostClasses.remove( 'active' )
			}
			restoreState( new Date( Date.parse( new Date() ) + 1 * 1 * 1 * numberOfSeconds * 1000 ) )

			//closeWonModal()
		}

		restartIcon.addEventListener( 'click', restartGame, false )


		/** ************************************************************************
		 *  Start the game
		 ** ***********************************************************************/

		function init() {
			// set as a global var as it is called in numerous places
			initializeClock( 'clockdiv', deadline )
			registerEventListeners()
		}

		init()

	}( document )
)