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

 	var screenWidth = 800, screenHeight = 600, worldWidth = 1.25 * screenWidth;
 	var game = new Phaser.Game(/*width*/screenWidth, /*height*/screenHeight, /*render*/Phaser.AUTO, /*parent*/'',
 		/*state*/{preload: preload, create: create, render: render, update: update},
 		/*transparent*/ false, /*antialias*/false, /*physicsConfig*/null); 
 

	/**
         * Function called by Phaser once, when preloading the game (before the create function).
         */
 	function preload (game){
 	}

	/**
         * Function called by Phaser once, when creating the game (after the preload method).
	 */
 	function create (game){
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
