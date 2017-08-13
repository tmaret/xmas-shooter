/**
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * @author manou.maret@gmail.com
 * @author timothee.maret@gmail.com
 */

var io = io || {};
io.github = io.github || {};

io.github.xmasshooter = (function () {

	var Game = function (baseUrl) {
 	
	 	baseUrl = baseUrl || '';

	 	var giftEmitters = {};

	 	var score = 0;
		var scoreText;

		var scoreMultiplicator = 1;
		var scoreMultiplicatorEndTime = 0;

		var life = 3;
		var lifeText;

		var remainingTime = 120; /* in seconds */
		var remainingTimeText;
		var timer;

		var freezeEndTime = 0;

		var blurEndTime = 0;
		var blurX;
		var blurY;

		var splash;
		var splashEndTime = 0;

		var endGame = false;

		var compassEndTime = 0;

		var speedupEndTime = 0;


	 	var screenWidth = 800, screenHeight = 600, worldWidth = 1.25 * screenWidth;
	 	var game = new Phaser.Game(/*width*/screenWidth, /*height*/screenHeight, /*render*/Phaser.AUTO, /*parent*/'',
	 		/*state*/{preload: preload, create: create, render: render, update: update},
	 		/*transparent*/ false, /*antialias*/false, /*physicsConfig*/null); 


	 	function getRandomInt(min, max) {
			min = Math.ceil(min);
		  	max = Math.floor(max);
		  	return Math.floor(Math.random() * (max - min)) + min;
		}

		function resolveUrl(path) {
			return baseUrl + path;
		}


	 	function setFullScreen (game){
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
			game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			game.scale.setScreenSize = true;
	 	}

	 	function updateScore(increment){
	 		score += increment * scoreMultiplicator;
	 		score = Math.max(0, score);
	 		scoreText.text = 'Score : ' + score;
	 		if (scoreMultiplicator !== 1) {
	 			scoreText.text +=  ' (x' + scoreMultiplicator + ')';
	 		}

	 	}


	 	function updateLife(increment){
	 		//life = life + increment;
	 		life += increment;
	 		lifeText.text = 'Life : ' + life;
	 		if (life == 0) {
	 			gameover();

	 		}
	 	}

	 	function updateRemainingTime(increment) {
	 		remainingTime = Math.max(0, remainingTime + increment);
	 		remainingTimeText.text = 'Time : ' + remainingTime + ' sec';
	 		if (remainingTime == 0) {
	 			gameover();
	 		}
	 	}

	 	function setRandomGravityInX() {
	 		var x = getRandomInt(-1000, 1000);
	 		game.physics.arcade.gravity.x = x;
	 	}

	 	function setDefaultGravityInX() {
	 		game.physics.arcade.gravity.x = 0;
	 	}

	 	function setStrongGravityInY() {
	 		game.physics.arcade.gravity.y = 500;
	 	}

	 	function setDefaultGravityInY() {
	 		 game.physics.arcade.gravity.y = 10;
	 	}


	 	function stopEmitters() {
	 		for(var emitter in giftEmitters ){
	 			if(giftEmitters.hasOwnProperty(emitter)){
	 				giftEmitters[emitter].on = false;
	 			}
	 		}
	 	}

	 	function gameover(){
	 		endGame = true;
	 		stopEmitters();

	 		//update scoreboard
	 		lifeText.text = "";
	 		scoreText.x = screenWidth/2;
	 		scoreText.y = screenHeight/2;
	 		var gameOver = game.add.sprite(screenWidth/5, screenHeight/4, 'gameover');

	 		// stop timer
	 		timer.stop();
	 	}

	 	function blurEmitter(emitter){
	 		if (emitter.blured == false) {
		 		emitter.blured = true;
	 			emitter.filters = [blurX, blurY];
	 		}
	 	}

	 	function unBlurEmitter(emitter){
	 		if (emitter.blured == true) {
	 			emitter.blured = false;
	 			emitter.filters = undefined; 			
	 		}
	 	}


	 	function createGiftEmitter(game, maxParticles, key, basePoints, minScore, frequency, quantity, onClick) {
	 		var emitter = game.add.emitter(game.world.centerX, 0, maxParticles);
			emitter.setSize(game.world.width, 0);
			emitter.inputEnableChildren = true;
	    	emitter.makeParticles(key);
			emitter.setAll('data', {'basePoints': basePoints});
			emitter.callAll('events.onInputDown.add', 'events.onInputDown', onClick);
	    	emitter.minParticleScale = 0.5;
	    	emitter.maxParticleScale = 1;
	    	emitter.minRotation = -45;
			emitter.maxRotation = 45;
			emitter.setXSpeed(0, 0);
			emitter.minScore = minScore;
			emitter.blured = false;
			emitter.freezed = false;
			var immediate = (score > minScore);
			emitter.flow(/* lifespan in ms */ 10000, /* frequency in ms */ frequency, /* quantity */ quantity, /* total */ -1, /* immediate */ immediate);
			emitter.on = immediate;
			return emitter;
	 	}

		/**
	     * Function called by Phaser once, when preloading the game (before the create function).
	     */
	 	function preload (game){
	 		console.log("preload");
	 		game.load.crossOrigin = 'anonymous';
			//game.load.spritesheet('gift-parcel', resolveUrl('data/gift-parcel.png'), 65, 65, 3);
			game.load.image('gift-basic', resolveUrl('data/gift-basic.png'));
			//game.load.image('gift-candy', resolveUrl('data/gift-candy.png'));
			game.load.image('gift-clock', resolveUrl('data/gift-clock.png'));
			game.load.image('gift-compass', resolveUrl('data/gift-compass.png'));
			game.load.image('gift-double', resolveUrl('data/gift-double.png'));
			game.load.image('gift-freeze', resolveUrl('data/gift-freeze.png'));
			game.load.image('gift-glasses', resolveUrl('data/gift-glasses.png'));
			game.load.image('gift-ink', resolveUrl('data/gift-ink.png'));
			//game.load.image('gift-magnet', resolveUrl('data/gift-magnet.png'));
			//game.load.image('gift-pointer', resolveUrl('data/gift-pointer.png'));
			game.load.image('gift-mushroom', resolveUrl('data/gift-mushroom.png'));
			//game.load.image('gift-potion', resolveUrl('data/gift-potion.png'));
			game.load.image('gift-speedup', resolveUrl('data/gift-speedup.png'));
			//game.load.image('gift-thief', resolveUrl('data/gift-thief.png'));
			game.load.image('gift-watch', resolveUrl('data/gift-watch.png'));
			game.load.image('gift-bomb', resolveUrl('data/gift-bomb.png'));	
			game.load.image('gameover', resolveUrl('data/gameover.gif'));
			game.load.image('ink-splash', resolveUrl('data/ink-splash.png'));
			game.load.image('background', resolveUrl('data/background.png'));
			game.load.image('background2', resolveUrl('data/background2.png'));
			game.load.script('BlurX', resolveUrl('filters/BlurX.js'));
	    	game.load.script('BlurY', resolveUrl('filters/BlurY.js'));
	 	}

		/**
	     * Function called by Phaser once, when creating the game (after the preload method).
		 */
		function create (game){

	  		console.log("create");
	 		setFullScreen(game);

	 		game.physics.startSystem(Phaser.Physics.ARCADE);
	 		setDefaultGravityInX();
	 		setDefaultGravityInY();


	 		game.world.setBounds(0, 0, worldWidth, screenHeight);

	 		game.add.tileSprite(0, 0, screenWidth, screenHeight, 'background');

   			endBackground = game.add.tileSprite(0, 0, screenWidth, screenHeight, 'background2');
   			endBackground.visible = false

	 		scoreText = game.add.text(10, 10, '', {font: '34px Arial', fill: '#FFF'} );
	 		updateScore(0);


	 		lifeText = game.add.text(640, 10, '', {font: '34px Arial', fill: '#FFF'} );
	 		updateLife(0);

	 		// blur filter config

	 		blurX = game.add.filter('BlurX');
			blurY = game.add.filter('BlurY');
	    	blurX.blur = 10;
	    	blurY.blur = 10;



			// Create an emitter for the speedup gifts

			giftEmitters.speedup = createGiftEmitter(game, 10, 'gift-speedup', 50, -1, 9000, 2, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
				speedupEndTime = game.time.time + 5000;
				updateScore(scoreIncrement);
				gift.kill();
			});

	    	// Create an emitter for the compass gifts

			giftEmitters.compass = createGiftEmitter(game, 10, 'gift-compass', 50, -1, 9500, 2, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
				compassEndTime = game.time.time + 5000;
				updateScore(scoreIncrement);
				gift.kill();
			});

			// Create an emitter for the basic gifts

			giftEmitters.basic = createGiftEmitter(game, 500, 'gift-basic', 50, -1, 250, 2, function(gift) {
				// When clicking on a gift, compute the score
				// The score depends on the base points & gift scale
				// Include gift.body.velocity.y in the formula ?
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
				updateScore(scoreIncrement);
				gift.kill();
			});

			// Create an emitter for the mushroom gifts

			giftEmitters.mushroom = createGiftEmitter(game, 10, 'gift-mushroom', -50, -1, 8900, 2, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
				updateScore(scoreIncrement);
				gift.kill();
			});

			// Create an emitter for the freeze gifts

			giftEmitters.freeze = createGiftEmitter(game, 10, 'gift-freeze', 0, -1, 9200, 1, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
				freezeEndTime = game.time.time + 5000;
				updateScore(scoreIncrement);
				gift.kill();
			});

			// Create an emitter for the double gifts

			giftEmitters.double = createGiftEmitter(game, 10, 'gift-double', 400, -1, 8500, 1, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
				scoreMultiplicator = 2;
				scoreMultiplicatorEndTime = game.time.time + 10000;
				updateScore(scoreIncrement);
				gift.kill();
			});

	        // Create gift emmitter bomb gifta

			giftEmitters.bomb = createGiftEmitter(game, 10, 'gift-bomb', -500, -1, 9900, 1, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
				updateScore(scoreIncrement);
				updateLife(-1);
				gift.kill();
			});

	     	// Create gift emmiter watch

			giftEmitters.watch = createGiftEmitter(game, 10, 'gift-watch', -500, -1, 10100, 2, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
				updateScore(scoreIncrement);
				updateRemainingTime(10);
				gift.kill();
			});

			// Create gift clock emitter

			giftEmitters.clock = createGiftEmitter(game, 10, 'gift-clock', -500, -1, 8200, 2, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
				updateScore(scoreIncrement);
				updateRemainingTime(-50);
				gift.kill();
			});
			
			// Create an emitter for the glasses gifts

			giftEmitters.glasses = createGiftEmitter(game, 10, 'gift-glasses', 0, -1, 8000, 2, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
				blurEndTime = game.time.time + 5000;
				updateScore(scoreIncrement);
				gift.kill();
			});
			
			// Create ink gift emitter

			giftEmitters.ink = createGiftEmitter(game, 10, 'gift-ink', 0, -1, 12000, 2, function(gift) {
				var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
				splashEndTime = game.time.time + 5000;
				updateScore(scoreIncrement);
				gift.kill();
			});

			// Create splash sprite

	    	splash = game.add.sprite(screenWidth/5, screenHeight/4, 'ink-splash');
	    	splash.visible = false;

			// Create timer and time text
	    	
	    	timer = game.time.create(false);
	    	timer.loop(1000, function() {
	    		updateRemainingTime(-1);
	    	}, this);
	    	remainingTimeText = game.add.text(screenWidth/3, 10, '', {font: '34px Arial', fill: '#FFF'} );
	    	updateRemainingTime(0);
	    	timer.start();


		}

		/**
		 * Function called by Phaser everytime it computes a new state.
		 * Ideally we don't use that function and use update instead.
		 */
		function render (game){
	 	}

		

		/**
		 * Function called by Phaser everytime it computes a new state.
		 * We put our game logic here.
		 */
		function update (game){

			var gameTime = game.time.time;

			if(endGame == true){
				endBackground.visible = true;
			}

			if (endGame == false) {

	 			// Manage the emitters state

		 		for(var emitter in giftEmitters){
		 			if(giftEmitters.hasOwnProperty(emitter)){

						var em = giftEmitters[emitter];

						// Start or stop the emitters based on 
						// - minScore
						// - game.physics.arcade.isPaused (frozen)

		 				em.on = (score > em.minScore) && (game.physics.arcade.isPaused == false);

		 				// Blur or unblur the emitter based on the blurEndTime

		 				if (blurEndTime < gameTime) {
		 					unBlurEmitter(em);
		 				} else {
		 					blurEmitter(em);
		 				}
		 			}
		 		}
		 	}

		 	//slash end time

		 	if (splashEndTime < gameTime){
		 		splash.visible = false;
		 	} else {
		 		splash.visible = true;
		 	}

		 	// Set random or default X axis gravity

		 	if (compassEndTime < gameTime) {
		 		setDefaultGravityInX();
		 	} else {
		 		setRandomGravityInX();
		 	}

		 	// Set strong or default Y axis gravity

		 	if (speedupEndTime < gameTime) {
		 		setDefaultGravityInY();
		 	} else {
		 		setStrongGravityInY();
		 	}

		 	// Freeze

		 	if (freezeEndTime < gameTime) {
		 		game.physics.arcade.isPaused = false;
		 	} else {
				game.physics.arcade.isPaused = true;
		 	}

			// update the multiplicator
	 		
	 		if (scoreMultiplicatorEndTime < gameTime) {
	 			scoreMultiplicator = 1;
				updateScore(0);
	 		}
		}
	}


	return {
		Game: Game
	};

 } ());
