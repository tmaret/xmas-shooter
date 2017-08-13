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
 window.onload = function() {
 	

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

	var endGame = false;





 	var screenWidth = 800, screenHeight = 600, worldWidth = 1.25 * screenWidth;
 	var game = new Phaser.Game(/*width*/screenWidth, /*height*/screenHeight, /*render*/Phaser.AUTO, /*parent*/'',
 		/*state*/{preload: preload, create: create, render: render, update: update},
 		/*transparent*/ false, /*antialias*/false, /*physicsConfig*/null); 
 

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
 		remainingTime += increment;
 		remainingTimeText.text = 'Time : ' + remainingTime + ' sec';
 		if (remainingTime == 0) {
 			gameover();
 		}
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
		game.load.spritesheet('gift-parcel', 'data/gift-parcel.png', 65, 65, 3);
		game.load.image('gift-basic', 'data/gift-basic.png');
		game.load.image('gift-candy', 'data/gift-candy.png');
		game.load.image('gift-clock', 'data/gift-clock.png');
		game.load.image('gift-compass', 'data/gift-compass.png');
		game.load.image('gift-double', 'data/gift-double.png');
		game.load.image('gift-freeze', 'data/gift-freeze.png');
		game.load.image('gift-glasses', 'data/gift-glasses.png');
		game.load.image('gift-ink', 'data/gift-ink.png');
		game.load.image('gift-magnet', 'data/gift-magnet.png');
		game.load.image('gift-pointer', 'data/gift-pointer.png');
		game.load.image('gift-mushroom', 'data/gift-mushroom.png');
		game.load.image('gift-potion', 'data/gift-potion.png');
		game.load.image('gift-speedup', 'data/gift-speedup.png');
		game.load.image('gift-thief', 'data/gift-thief.png');
		game.load.image('gift-watch', 'data/gift-watch.png');
		game.load.image('gift-bomb', 'data/gift-bomb.png');	
		game.load.image('gameover', 'data/gameover.gif');
		game.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurX.js');
    	game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurY.js');
 	}

	/**
     * Function called by Phaser once, when creating the game (after the preload method).
	 */
	function create (game){
  		console.log("create");
 		setFullScreen(game);

 		game.physics.startSystem(Phaser.Physics.ARCADE);


 		game.world.setBounds(0, 0, worldWidth, screenHeight);

 		scoreText = game.add.text(10, 10, '', {font: '34px Arial', fill: '#FFF'} );
 		updateScore(0);


 		lifeText = game.add.text(640, 10, '', {font: '34px Arial', fill: '#FFF'} );
 		updateLife(0);


 		// blur filter config

 		blurX = game.add.filter('BlurX');
		blurY = game.add.filter('BlurY');
    	blurX.blur = 10;
    	blurY.blur = 10;

		// Create an emitter for the basic gifts

		giftEmitters.basic = createGiftEmitter(game, 100, 'gift-basic', 50, -1, 1000, 2, function(gift) {
			// When clicking on a gift, compute the score
			// The score depends on the base points & gift scale
			// Include gift.body.velocity.y in the formula ?
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
			updateScore(scoreIncrement);
			gift.kill();
		});

		// Create an emitter for the mushroom gifts

		giftEmitters.mushroom = createGiftEmitter(game, 120, 'gift-mushroom', -50, -1, 1200, 2, function(gift) {
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
			updateScore(scoreIncrement);
			gift.kill();
		});

		// Create an emitter for the freeze gifts

		giftEmitters.freeze = createGiftEmitter(game, 1, 'gift-freeze', 0, -1, 10000, 1, function(gift) {
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
			freezeEndTime = game.time.time + 5000;
			updateScore(scoreIncrement);
			gift.kill();
		});

		// Create an emitter for the double gifts

		giftEmitters.double = createGiftEmitter(game, 1, 'gift-double', 400, -1, 2000, 1, function(gift) {
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
			scoreMultiplicator = 2;
			scoreMultiplicatorEndTime = game.time.time + 10000;
			updateScore(scoreIncrement);
			gift.kill();
		});

        // Create gift emmitter bomb gifta

		giftEmitters.bomb = createGiftEmitter(game, 10, 'gift-bomb', -500, -1, 10000, 1, function(gift) {
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
			updateScore(scoreIncrement);
			updateLife(-1);
			gift.kill();
		});
		
		// Create an emitter for the glasses gifts

		giftEmitters.glasses = createGiftEmitter(game, 150, 'gift-glasses', 0, -1, 1000, 2, function(gift) {
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
			blurEndTime = game.time.time + 5000;
			updateScore(scoreIncrement);
			gift.kill();
		});
		

		// Create timer and time text
    	
    	timer = game.time.create(false);
    	timer.loop(1000, function() {
    		updateRemainingTime(-1);
    	}, this);
    	remainingTimeText = game.add.text(640, 40, '', {font: '34px Arial', fill: '#FFF'} );
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
 		
 		if(endGame == false){


 			// Manage the emitters state

	 		for(var emitter in giftEmitters){
	 			if(giftEmitters.hasOwnProperty(emitter)){

					var em = giftEmitters[emitter];

					// Start or stop the emitters based on 
					// - minScore
					// - game.physics.arcade.isPaused (frozen)

	 				em.on = (score > em.minScore) && (game.physics.arcade.isPaused == false);

	 				// Blur or unblur the emitter based on the blurEndTime

	 				if (blurEndTime < game.time.time) {
	 					unBlurEmitter(em);
	 				} else {
	 					blurEmitter(em);
	 				}


	 				// Freeze

	 				if (freezeEndTime < game.time.time) {
	 					game.physics.arcade.isPaused = false;
	 				} else {
						game.physics.arcade.isPaused = true;
	 				}

	 			}
	 		}


		    // update the multiplicator
 			if (scoreMultiplicatorEndTime < game.time.time) {
 				scoreMultiplicator = 1;
				updateScore(0);
 			}
		}
	}
 }
