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

 	var score = 0;
	var scoreText;

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
 		score += increment;
 		scoreText.text = 'Score : ' + score;
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

 		var giftBasic = game.add.sprite(400, -32.5, 'gift-basic');
 		game.physics.arcade.enable(giftBasic);
 		giftBasic.anchor.setTo(0.5, 0.5);
 		giftBasic.inputEnabled = true;
 		giftBasic.input.pixelPerfectClick = true;
 		giftBasic.events.onInputDown.add(function(){
 			updateScore(giftBasic.data.score);
 			giftBasic.destroy(giftBasic);
 		});
 		giftBasic.body.velocity.y = 100;
 		giftBasic.checkWorldBounds = true;
 		giftBasic.events.onOutOfBounds.add(function(){giftBasic.destroy(giftBasic);});
 		giftBasic.events.onDestroy.add(function(){console.log("destroy");});
 		giftBasic.data.score = 50;

 		game.add.tween(giftBasic).to({angle: giftBasic.angle + 360, tint: 0xFFF000}, 5000, "Linear", true, 0, -1);

		var giftGlasses = game.add.sprite(200, -32.5, 'gift-glasses');
		game.physics.arcade.enable(giftGlasses);
 		giftGlasses.anchor.setTo(0.5, 0.5);
 		giftGlasses.inputEnabled = true;
 		giftGlasses.input.pixelPerfectClick = true;
 		giftGlasses.events.onInputDown.add(function(){
 			updateScore(giftGlasses.data.score);
 			giftGlasses.destroy(giftGlasses);
 		});
 		giftGlasses.body.angle = 90;
 		giftGlasses.body.velocity.x = 100;
 		giftGlasses.checkWorldBounds = true;
 		giftGlasses.events.onOutOfBounds.add(function(){giftGlasses.destroy(giftGlasses);});
 		giftGlasses.events.onDestroy.add(function(){console.log("destroy");});
 		giftGlasses.data.score = 0;


		
		game.add.tween(giftGlasses).to({angle: 15, width: giftGlasses.width +20}, 250, "Linear", true, 0, -1, true);

		// Create an emitter for the basic gifts

		var giftBasicEmitter = game.add.emitter(game.world.centerX, 0, 100);
		giftBasicEmitter.setSize(game.world.width, 0);
		giftBasicEmitter.inputEnableChildren = true;
    	giftBasicEmitter.makeParticles('gift-basic');
		giftBasicEmitter.setAll('data', {'basePoints': 100});
		giftBasicEmitter.callAll('events.onInputDown.add', 'events.onInputDown', function(gift) {
			// When clicking on a gift, compute the score
			// The score depends on the base points & gift scale
			var scoreIncrement = Math.round(gift.data.basePoints / Math.pow(gift.scale.x, 2)); // include gift.body.velocity.y in the formula ?
			updateScore(scoreIncrement);
			gift.kill();
		});
    	giftBasicEmitter.minParticleScale = 0.5;
    	giftBasicEmitter.maxParticleScale = 1;
    	giftBasicEmitter.minRotation = -45;
		giftBasicEmitter.maxRotation = 45;
		giftBasicEmitter.setXSpeed(-5, 5);
		giftBasicEmitter.flow(10000, 1000, 2, -1);


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
 	}

 }
