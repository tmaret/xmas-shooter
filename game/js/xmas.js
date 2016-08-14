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

 	function createGiftEmitter(game, maxParticles, key, basePoints, onClick) {
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
		emitter.setXSpeed(-5, 5);
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
 	}

	/**
     * Function called by Phaser once, when creating the game (after the preload method).
	 */
 	function create (game){
  		console.log("create");
 		setFullScreen(game);

 		game.physics.startSystem(Phaser.Physics.ARCADE);
 		game.physics.arcade.gravity.y = 150;
 		game.world.setBounds(0, 0, worldWidth, screenHeight);

 		scoreText = game.add.text(10, 10, '', {font: '34px Arial', fill: '#FFF'} );
 		updateScore(0);

		// Create an emitter for the basic gifts

		giftEmitters.basic = createGiftEmitter(game, 100, 'gift-basic', 100, function(gift) {
			// When clicking on a gift, compute the score
			// The score depends on the base points & gift scale
			// Include gift.body.velocity.y in the formula ?
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
			updateScore(scoreIncrement);
			gift.kill();
		});
		giftEmitters.basic.flow(10000, 1000, 2, -1);

		// Create an emitter for the mushroom gifts

		giftEmitters.mushroom = createGiftEmitter(game, 100, 'gift-mushroom', -50, function(gift) {
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); 
			updateScore(scoreIncrement);
			gift.kill();
		});
		giftEmitters.mushroom.flow(10000, 1200, 2, -1);

		// Create an emitter for the freeze gifts

		giftEmitters.freeze = createGiftEmitter(game, 10, 'gift-freeze', 0, function(gift) {
			// TODO freeze all the emitters (stop emitting new gift, stop the existing gifts, maybe by stopping gravity ...)
			gift.kill();
		});
		giftEmitters.freeze.flow(/* lifespan in ms */ 10000, /* frequency in ms */ 5000, /* quantity */ 1, /* total */ -1, /* immediate */ false);
		giftEmitters.freeze.on = false;




		// Create an emitter for the double gifts


		giftEmitters.double = createGiftEmitter(game, 1, 'gift-double', 200, function(gift) {
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2));
			scoreMultiplicator = 2;
			scoreMultiplicatorEndTime = game.time.time + 10000;
			updateScore(scoreIncrement);
			gift.kill();
		});
		giftEmitters.double.flow(/* lifespan in ms */ 10000, /* frequency in ms */ 2000, /* quantity */ 1, /* total */ -1, /* immediate */ false);
		giftEmitters.double.on = false;



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

 		// start the emitters depending on the score
 		if (score > 1000) {
			giftEmitters.freeze.on = true;
 		}

 		if (score > 2000) {
			giftEmitters.double.on = true;
 		}

 		// update the multiplicator
 		if (scoreMultiplicatorEndTime < game.time.time) {
 			scoreMultiplicator = 1;
 			updateScore(0);
 		}

 	}

 }
