// Wrapped it into an IIFE to protect namespacing.
(
	function ( document ) {
		'use strict'

		let numberOfSeconds = 120,
			deadline = new Date( Date.parse( new Date() ) + 1 * 1 * 1 * numberOfSeconds * 1000 ),
			stars = document.querySelectorAll( '.stars i' ),

			starsOne   = document.getElementById( 'star1' ),
			starsTwo   = document.getElementById( 'star2' ),
			starsThree = document.getElementById( 'star3' ),

			wonHTML = document.getElementById( 'wonHTML' ),
			lostHTML = document.getElementById( 'lostHTML' ),

			wonClasses = document.getElementById( 'won-game' ).classList,
			lostClasses = document.getElementById( 'lost-game' ).classList,
			infoClasses = document.getElementById( 'info-game' ).classList,

			lostButton = document.getElementById( 'button__lost-game' ),
			wonButton = document.getElementById( 'button__won-game' ),
			infoButton = document.getElementById( 'button__info-game' ),

			infoIcon = document.getElementById( 'info-icon' ),
			restartIcon = document.getElementById( 'restart-icon' ),

			timeinterval

		let userStats = {
			numberOfSeconds: 30,
			seconds:         0,
			timeUsed:        0,
			starsCount:      3,
			moves:           0,
			stars:           0,
			score:           0,
		}

		userStats.seconds = getTimeRemaining( deadline ).seconds
		userStats.timeUsed = numberOfSeconds - getTimeRemaining( deadline ).seconds

		//alert(JSON.stringify(userStats.timeUsed, null, 4));
		//alert(JSON.stringify(getTimeRemaining(deadline).seconds), null, 4);

		lostHTML.innerHTML = `<p class="modal__results">You did it in ${userStats.timeUsed} seconds and ${userStats.moves} moves.  You earned ${userStats.starsCount} stars and got ${userStats.score} points.</p>`
		wonHTML.innerHTML = `<p class="modal__results">You did it in ${userStats.timeUsed} seconds and ${userStats.moves} moves.  You earned ${userStats.starsCount} stars and got ${userStats.score} points.</p>`

		let cards = [
			'fa-diamond', 'fa-diamond',
			'fa-paper-plane-o', 'fa-paper-plane-o',
			'fa-anchor', 'fa-anchor',
			'fa-bolt', 'fa-bolt',
			'fa-cube', 'fa-cube',
			'fa-leaf', 'fa-leaf',
			'fa-bicycle', 'fa-bicycle',
			'fa-bomb', 'fa-bomb',
		]

		function generateCard( card ) {
			return `<li class="card">
            	<i class="fa ${card}" data-class="${card}"></i>
            	<div class="container fire">
            	   <div class="flamer">
            	      <a href="/">
            	         <div class="flame-wrap">
            	            <div class="flame1 flame"></div>
            	            <div class="flame2 flame"></div>
            	            <div class="flame3 flame"></div>
            	            <div class="flame4 flame"></div>
            	            <div class="flame5 flame"></div>
            	         </div>
            	      </a>
            	   </div>
            	</div>
         	</li>`
		}


		/** ************************************************************************
		 *  Start the game
		 ** ***********************************************************************/

		function init() {
			initializeClock( 'clockdiv', deadline )
			//registerEventListeners()
			let deck = document.querySelector( '.deck' )
			let cardHTML = shuffle( cards ).map( function ( card ) {
				return generateCard( card )
			} )

			deck.innerHTML = cardHTML.join( '' )
		}

		init()

		/**
		 * Display the cards on the page
		 *   - shuffle the list of cards using the provided "shuffle" method below
		 *   - loop through each card and create its HTML
		 *   - add each card's HTML to the page
		 */

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

		let allCards = document.querySelectorAll( '.card' )
		let openCards = []

		/**
		 * The overall logic came from Mike's youtube presentation, althoght it didn't work
		 * for me the way he left it so a lot of it has changed.*
		 */
		// use k as an index via the allCards stack
		for ( let k = 0; k < allCards.length; k ++ ) {

			allCards[ k ].addEventListener( 'click', function ( e ) {
				event.stopPropagation()
				event.preventDefault()

				// filter out the card if it matches itself
				if ( ! allCards[ k ].classList.contains( 'open' ) &&
				     ! allCards[ k ].classList.contains( 'show' ) &&
				     ! allCards[ k ].classList.contains( 'match' ) ) {

					// prevent more than two cards at a time
					if ( openCards.length < 2 ) {
						openCards.push( k )
						allCards[ k ].classList.add( 'open' )
						allCards[ k ].classList.add( 'show' )


						// check for a match
						if ( 2 === openCards.length ) {

							// moves come in a pair
							updateMoves()

							let firstCard = allCards[ openCards[ 0 ] ].children[ 0 ].getAttribute( 'data-class' )
							let secondCard = allCards[ openCards[ 1 ] ].children[ 0 ].getAttribute( 'data-class' )

							//alert(JSON.stringify(firstCard, null, 4));
							//alert(JSON.stringify(secondCard, null, 4));

							// do they match?
							if ( firstCard === secondCard ) {

								allCards[ openCards[ 0 ] ].classList.remove( 'open' )
								allCards[ openCards[ 0 ] ].classList.remove( 'show' )
								allCards[ openCards[ 0 ] ].classList.add( 'match' )
								allCards[ openCards[ 0 ] ].classList.add( 'flip' )

								allCards[ openCards[ 1 ] ].classList.remove( 'open' )
								allCards[ openCards[ 1 ] ].classList.remove( 'show' )
								allCards[ openCards[ 1 ] ].classList.add( 'match' )
								allCards[ openCards[ 1 ] ].classList.add( 'flip' )

								updateScore()
								openCards = []  // reset for next pair of cards

							} else {
								// if cards don't match reset back to normal and pop the stack

								setTimeout( function () {

									allCards[ openCards[ 0 ] ].classList.remove( 'open' )
									allCards[ openCards[ 0 ] ].classList.remove( 'show' )
									allCards[ openCards[ 0 ] ].classList.remove( 'match' )
									allCards[ openCards[ 0 ] ].classList.remove( 'flip' )

									allCards[ openCards[ 1 ] ].classList.remove( 'open' )
									allCards[ openCards[ 1 ] ].classList.remove( 'show' )
									allCards[ openCards[ 1 ] ].classList.remove( 'match' )
									allCards[ openCards[ 1 ] ].classList.remove( 'flip' )

									openCards = []

								}, 600 )  // timeout
							}
						} // if ( 2 === openCards.length )
					} // // prevent more than two cards at a time
				}
			} ) // allCards[ k ].addEventListener(
		} // for

		/**
		 *  @description Function used to update the number
		 *               of moves in pairs, and to hide starts when
		 *               falling below criteria 20 moves and 30 moves
		 */
		function updateMoves() {

			switch ( userStats.moves ) {
				case 20:
					userStats.starsCount --
					star1.classList.add( 'hidden-star' )
					break

				case 30:
					userStats.starsCount --
					star2.classList.add( 'hidden-star' )
					break
			}

			userStats.moves ++
			document.getElementById( 'updateMoves' ).innerHTML = userStats.moves
		}

		/**
		 *  @description Function used to refresh star count
		 */
		function refreshMoves() {

			switch ( userStats.moves ) {
				case 20:
					userStats.starsCount --
					star1.classList.add( 'hidden-star' )
					break

				case 30:
					userStats.starsCount --
					star2.classList.add( 'hidden-star' )
					break
			}

			document.getElementById( 'updateMoves' ).innerHTML = userStats.moves
		}

		/**
		 * @description Update the score on the deck, and call refreshScore to
		 *              keep it dry
		 */
		function updateScore() {
			userStats.score += 100
			refreshScore()
		}

		/**
		 * @description Refresg the score
		 */
		function refreshScore() {
			document.getElementById( 'updateScore' ).innerHTML = userStats.score
		}

		/**
		 * @description  Time to reset the clock
		 */
		function stopTimer() {
			clearInterval( timeinterval )
		}

		/**
		 * @description  Used to get the time remaining, I modified the original
		 *               code so that it returns seconds to three places
		 * @param   endtime
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
		 * @description function to init the clock.  I set it for 120 seconds
		 * @param id
		 * @param endtime
		 */
		// https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
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

					refreshMoves()
					refreshScore()
					userStats.seconds = getTimeRemaining( deadline ).seconds
					userStats.timeUsed = numberOfSeconds - getTimeRemaining( deadline ).seconds
					wonHTML.innerHTML = `<p class="modal__results">You did it in ${userStats.timeUsed} seconds and ${userStats.moves} moves.  You earned ${userStats.starsCount} stars and got ${userStats.score} points.</p>`

				} else if ( t.total <= 0 ) {
					clearInterval( timeinterval )
					lostClasses.remove( 'none' )
					lostClasses.add( 'active' )

					refreshMoves()
					refreshScore()
					userStats.seconds = getTimeRemaining( deadline ).seconds
					userStats.timeUsed = numberOfSeconds - getTimeRemaining( deadline ).seconds
					lostHTML.innerHTML = `<p class="modal__results">You did it in ${userStats.timeUsed} seconds and ${userStats.moves} moves.  You earned ${userStats.starsCount} stars and got ${userStats.score} points.</p>`
				}
			}

			updateClock()
			timeinterval = setInterval( updateClock, 1000 )
		}

		/**
		 * @description Open modal and give stats when user wins
		 */
		function closeWonModal() {
			location.reload();
		}
		wonButton.addEventListener( 'click', closeWonModal, false )

		/**
		 * @description open modal and give stats when user loses
		 */
		function closeLostModal() {
			location.reload();
		}
		lostButton.addEventListener( 'click', closeLostModal, false )

		/**
		 * @description  give user info from rubic
		 */
		function infoModal() {
			location.reload();
		}
		infoButton.addEventListener( 'click', infoModal, false )

		/**
		 * @description  Button in info modal to go back to game
		 */
		function infoGame() {
			infoClasses.remove( 'none' )
			infoClasses.add( 'active2' )
		}
		infoIcon.addEventListener( 'click', infoGame, false )


		/**
		 * @description event listener to start a new game
		 */
		function restartGame() {
			location.reload();
		}
		restartIcon.addEventListener( 'click', restartGame, false )

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

	}( document )
)