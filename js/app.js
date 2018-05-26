// Wrapped it into an IIFE to protect namespacing.
(
	function ( document ) {
		'use strict'

		let messageHTML = '<p class="modal__results">You did it in %seconds% seconds and %moves% moves.  You earned %stars% and %score% points.</p>'

		let body = document.querySelector( 'body' ),

			lostPlayAgain = document.getElementById( 'lost-game' ),
			lostButton = lostPlayAgain.getElementsByTagName("button")[0],

			wonPlayAgain = document.getElementById( 'won-game' ),
			wonButton = wonPlayAgain.getElementsByTagName( 'button' )[ 0 ],

			modalDemo = document.getElementById( 'overlay' ),
			modalLinks = document.querySelectorAll( 'modal-content' ),
			wapuuLink = modalLinks[ 0 ],
			overlay = document.createElement( 'div' ),
			overlayCloseLink = document.createElement( 'a' ),
			overlayCloseText = document.createTextNode( 'X' ),
			displayOverlay,
			openModal,
			openWonGameModal,
			openLostGameModal,
			callModal,
			closeModal,
			endtime,
			modalClasses,
			addImageToOverLay

		/**
		 * @description Initialize the cards by looking up the `.card` nodes in the DOM,
		 *              bind a click event, and then instantiating a new Card object.
		 * @returns {any[]}
		 */
		function buildCards() {
			// Array of game Card objects
			let cardz = document.querySelectorAll( '.card' )
			return (
				Array.from( cardz )
			)
		}

		let arr = buildCards()
		let matchTwoCards = []
		let isMatch = {}
		let counter = {}
		let timeinterval

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
			let cardz = buildCards()

			openCards( index )
		}

		/**
		 * @description add the card to a *list* of "open" cards (put this functionality in
		 *              another function that you call from this one)
		 * @param index
		 */
		function openCards( index ) {
			let cardz = buildCards()

			// Check to see if the counter has been initialized
			if ( typeof isMatch.count === 'undefined' ) {

				// It has not... perform the initialization
				isMatch.count = 1
			} else {

				isMatch.count ++
			}

			if ( isMatch.count === 1 ) {

				// array of cards using fifo stack and limit total of two
				matchTwoCards.push( index )
				cardz[ index ].classList.remove( 'flip' )
				cardz[ index ].classList.add( 'open' )
				cardz[ index ].classList.add( 'show' )

			} else if ( isMatch.count === 2 ) {
				// array of cards using fifo stack and limited to total of two
				matchTwoCards.push( index )
				cardz[ index ].classList.remove( 'flip' )
				cardz[ index ].classList.add( 'open' )
				cardz[ index ].classList.add( 'show' )
				updateMoves2()

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
			let cardz = buildCards()

			let firstCard = cardz[ matchTwoCards[ 0 ] ].children[ 0 ].getAttribute(
				'data-class' )
			let secondCard = cardz[ matchTwoCards[ 1 ] ].children[ 0 ].getAttribute(
				'data-class' )

			cardz[ index ].classList.add( 'open' )
			cardz[ index ].classList.add( 'show' )

			// icons have to match and it has to be two separate cards not one
			if ( firstCard === secondCard && matchTwoCards[ 0 ] !== matchTwoCards[ 1 ] ) {
				plusCounter()
				// These can be locked safely, remove the open and show classes
				lockCards()
			} else {

				sleep( 5 ).then( () => {
					// tell the player the cards are mismatched.
					window.setTimeout( () => {
						cardz[ matchTwoCards[ 0 ] ].classList.add( 'mismatch' )
						cardz[ matchTwoCards[ 1 ] ].classList.add( 'mismatch' )
					}, 500 )
				} )
				releaseCards()
			}
		}

		/**
		 * @description
		 */
		function lockCards() {
			let cardz = buildCards()

			for ( let k = 0; k < 2; k ++ ) {
				cardz[ matchTwoCards[ k ] ].classList.remove( 'open' )
				cardz[ matchTwoCards[ k ] ].classList.remove( 'show' )
				//alert('matchTwoCards[k]: ' + matchTwoCards[k])
				cardz[ matchTwoCards[ k ] ].classList.add( 'match' )
				updateScore()

				sleep( 5 ).then( () => {
					// empty the array for the next match.
					window.setTimeout( () => {
						let trash = matchTwoCards.pop()
						trash = matchTwoCards.pop()
						isMatch.count = 0
					} )
				} )
				if ( document.querySelectorAll( '.match' ).length === 16 ) {
					stopTimer()
					displayOverlay( 'won-game' )
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
				sleep( 1500 ).then( () => {

					for ( let k = 0; k < 2; k ++ ) {
						cardz[ matchTwoCards[ k ] ].classList.remove( 'open' )
						cardz[ matchTwoCards[ k ] ].classList.remove( 'show' )
						cardz[ matchTwoCards[ k ] ].classList.remove( 'mismatch' )
					}
					// Do something after the sleep!
					let trash = matchTwoCards.pop()
					trash = matchTwoCards.pop()
					isMatch.count = 0
				}, 500 )
			}
		}

		/**
		 * @description
		 */
		function plusCounter() {
			++ counter.count
			updateMoves2( counter.count )
		}

		counter.numberMoves = 0

		/**
		 * @description
		 */
		function updateMoves2() {
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
				).slice( - 3 )

				if ( t.total > 0 && document.querySelectorAll( '.match' ).length === 16 ) {
					clearInterval( timeinterval )
					displayOverlay( 'won-game' )
				} else if ( t.total <= 0 ) {
					clearInterval( timeinterval )
					displayOverlay( 'lost-game' )  // <<<<<<<<<============================
				}
			}

			updateClock()
			timeinterval = setInterval( updateClock, 1000 )
		}

//======================================================================
		/**
		 *
		 * @param id
		 */
		openWonGameModal = function openWonGameModal( e ) {

			e.target.id = 'won-game'
			displayOverlay( e )
		}

		openLostGameModal = function openLostGameModal( e ) {

			e.target.id = 'lost-game'
			displayOverlay( e )
		}

		/**
		 * @description
		 */
		displayOverlay = function displayOverlay( id ) {
			console.log( id )

			overlay.setAttribute( 'id', 'overlay' )
			overlayCloseLink.appendChild( overlayCloseText )
			overlayCloseLink.setAttribute( 'href', '#' )
			overlayCloseLink.classList.add( 'close' )
			overlayCloseLink.classList.add( id )

			modalClasses = document.getElementById( id ).classList
			modalClasses.remove( 'none' )

			overlay.appendChild( overlayCloseLink )
			body.appendChild( overlay )

			overlayCloseLink.addEventListener( 'click', function () {
				modalClasses.add( 'none' )
				overlayCloseLink.removeChild( overlayCloseText )
				overlayCloseLink.classList.remove( id )
			}, false )

			lostButton.addEventListener( 'click', function ( e ) {

				e.preventDefault()
				alert( 'danny' )
				console.log( 'danny' )
				init()

			}, false )

			wonButton.addEventListener( 'click', function ( e ) {

				e.preventDefault()
				alert( 'danny' )
				init()

			}, false )

		}

		/**
		 * @description
		 * @param e
		 */
		closeModal = function closeModal( id ) {
			overlayCloseLink.preventDefault()

			overlayCloseLink.removeEventListener( 'click', closeModal, false )
			overlay.setAttribute( 'id', 'overlay' )
			modalClasses = document.getElementById( id ).classList
			modalClasses.add( 'none' )

			//verlayCloseLink.removeEventListener( 'click', closeModal, false )
			//overlay.querySelector( 'img' ).remove()
			overlay.remove()
		}


		/** ************************************************************************
		 *  Start the game
		 ** ***********************************************************************/

		function init() {
			//wapuuLink.addEventListener( 'click', callModal );
			//var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
			let deadline = new Date( Date.parse( new Date() ) + 1 * 1 * 1 * 60 * 1000 )
			initializeClock( 'clockdiv', deadline )
			registerEventListeners()
		}

		init()

	}( document )
)