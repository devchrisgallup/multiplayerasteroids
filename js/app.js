var IDE_HOOK = false;
var VERSION = '2.6.2';
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('ship', 'assets/ship.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('enemy1', 'assets/enemy1.png');
    game.load.image('enemyParticles', 'assets/blowup.png');
    game.load.image('playerParticles', 'assets/shipblowup.png');
}

var playerOne;
var playerTwo; 
var playerTwoWeapon; 
var weapon;
var cursors;
var fireButton;
var enemy;  
var enemy1; 
var enemyParticles; 
var playerParticles; 
var globalX; 
var globalY; 
var randomX = 6;
var randomY = 2;  
var W; 
var A; 
var D; 
var ctrl; 
var playerOneText; 
var playerTwoText; 
var playerOneScore = 0; 
var playerTwoScore = 0; 

function create() {
    // Player One Weapons
    weapon = game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 1000;
    weapon.bulletSpeed = 900;
    weapon.fireRate = 200;
    weapon.bulletWorldWrap = true; 

    // Player Two Weapons
    playerTwoWeapon = game.add.weapon(30, 'bullet');
    playerTwoWeapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    playerTwoWeapon.bulletLifespan = 1000;
    playerTwoWeapon.bulletSpeed = 900;
    playerTwoWeapon.fireRate = 200;
    playerTwoWeapon.bulletWorldWrap = true; 

    // Player One and Player Two text
    playerOneText = this.game.add.text((window.innerWidth / 2) - 300, window.innerHeight - 40, "Player One: ", {font: '32px Arial', fill:  '#fff'});
    playerTwoText = this.game.add.text((window.innerWidth / 2) + 300, window.innerHeight - 40, "Plaer Two: ", {font: '32px Arial', fill:  '#fff'});

    // player one settings
    playerOne = this.add.sprite(400, 300, 'ship');
    playerOne.anchor.set(0.5);
    game.physics.arcade.enable(playerOne);
    playerOne.body.drag.set(70);
    playerOne.body.maxVelocity.set(200);

    // player two settings
    playerTwo = this.add.sprite(window.innerWidth - 300, 300, 'ship');
    playerTwo.anchor.set(0.5);
    game.physics.arcade.enable(playerTwo);
    playerTwo.body.drag.set(70);
    playerTwo.body.maxVelocity.set(200);

    // create player ship particles
    playerParticles = this.add.emitter(playerOne.x, playerOne.y, 30);  
    playerParticles.minParticleScale = 0.05; 
    playerParticles.maxParticleScale = 0.5; 
    playerParticles.minParticleSpeed.setTo(-15, 15); 
    playerParticles.maxParticleSpeed.setTo(15, -15);
    playerParticles.makeParticles("playerParticles");
    playerParticles.gravity = 0; 


    // enemy settings
    enemy = this.add.sprite(500, 500, 'enemy');
    enemy.anchor.set(0.5);
    game.physics.arcade.enable(enemy);
    enemy.body.drag.set(70);
    enemy.body.maxVelocity.set(200);
    enemy.bulletWorldWrap = true;

    // enemy settings
    enemy1 = this.add.sprite(100, 700, 'enemy1');
    enemy1.anchor.set(0.5);
    game.physics.arcade.enable(enemy1);
    enemy1.body.drag.set(70);
    enemy1.scale.setTo(0.2,0.2);
    enemy1.body.maxVelocity.set(200);
    enemy1.bulletWorldWrap = true;

    // create enemy ship particles
    enemyParticles = this.add.emitter(enemy.x, enemy.y, 3);  
    enemyParticles.minParticleScale = 0.95; 
    enemyParticles.maxParticleScale = 0.2; 
    enemyParticles.minParticleSpeed.setTo(-15, 15); 
    enemyParticles.maxParticleSpeed.setTo(15, -15);
    enemyParticles.makeParticles("enemyParticles");
    enemyParticles.gravity = 0; 

    // weapon tracking
    weapon.trackSprite(playerOne, 0, 0, true);
    playerTwoWeapon.trackSprite(playerTwo, 0, 0, true);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    W = game.input.keyboard.addKey(Phaser.KeyCode.W);
    A = game.input.keyboard.addKey(Phaser.KeyCode.A);
    D = game.input.keyboard.addKey(Phaser.KeyCode.D);
    ctrl = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
}

function update() {
    // update score text
    playerOneText.text = "Player One: " + playerOneScore; 
    playerTwoText.text = "player Two: " + playerTwoScore; 
    // collision handlers
    game.physics.arcade.overlap(weapon.bullets,enemy,collisionHandler,null,this);
    game.physics.arcade.overlap(weapon.bullets,enemy1,collisionHandler1,null,this);
    game.physics.arcade.overlap(playerOne,enemy,enemyCollisionHandler,null,this);
    game.physics.arcade.overlap(playerOne,enemy1,enemyCollisionHandler1,null,this);
    game.physics.arcade.overlap(playerOne,playerTwo,playerCollisionHandler,null,this);
    // player two
    game.physics.arcade.overlap(playerTwoWeapon.bullets,enemy,collisionHandlerOne,null,this);
    game.physics.arcade.overlap(playerTwoWeapon.bullets,enemy1,collisionHandlerTwo,null,this);
    game.physics.arcade.overlap(playerTwo,enemy,enemyCollisionHandler,null,this);
    game.physics.arcade.overlap(playerTwo,enemy1,enemyCollisionHandler1,null,this);

    enemy.body.velocity.y += randomY; 
    enemy.body.velocity.x += randomX; 
    enemy1.body.velocity.y += randomX; 
    enemy1.body.velocity.x -= randomY; 

    console.log(randomX + " " + randomY);

    // player one controlls
    if (W.isDown) {
        game.physics.arcade.accelerationFromRotation(playerOne.rotation, 300, playerOne.body.acceleration);
    }
    else {
        playerOne.body.acceleration.set(0);
    }

    if (A.isDown) {
        playerOne.body.angularVelocity = -300;
    }
    else if (D.isDown) {
        playerOne.body.angularVelocity = 300;
    }
    else {
        playerOne.body.angularVelocity = 0;
    }

    if (fireButton.isDown) {
        weapon.fire();
    }


    // Player two controlls
    if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(playerTwo.rotation, 300, playerTwo.body.acceleration);
    }
    else {
        playerTwo.body.acceleration.set(0);
    }

    if (cursors.left.isDown) {
        playerTwo.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown) {
        playerTwo.body.angularVelocity = 300;
    }
    else {
        playerTwo.body.angularVelocity = 0;
    }

    if (ctrl.isDown) {
        playerTwoWeapon.fire();
    }

    // wraps
    game.world.wrap(playerOne, 16);
    game.world.wrap(playerTwo, 16);
    game.world.wrap(enemy, 16);
    game.world.wrap(enemy1, 16);

}

function collisionHandlerOne(enemy, bullet) { 
    playerTwoScore++; 
    var randomSpeed = Math.floor(Math.random() * 400) + 200;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var randomHeight = Math.floor(Math.random()*height)+1;
    var randomWidth = Math.floor(Math.random()*width)+1;
    enemy.kill();
    enemyParticles.x = enemy.x; 
    enemyParticles.y = enemy.y; 
    enemyParticles.start(true, 1000, null, 10);
    // reset enemy
    setTimeout(function(){
        enemy.reset(randomWidth, randomHeight);
        enemy.body.maxVelocity.set(randomSpeed);
        }, 750); 
}

function collisionHandlerTwo(enemy1, bullet) { 
    playerTwoScore++; 
    var randomSpeed = Math.floor(Math.random() * 400) + 200;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var randomHeight = Math.floor(Math.random()*height)+1;
    var randomWidth = Math.floor(Math.random()*width)+1;
    enemy1.kill();
    enemyParticles.x = enemy1.x; 
    enemyParticles.y = enemy1.y; 
    enemyParticles.start(true, 1000, null, 10);
    // reset enemy
    setTimeout(function(){
        enemy1.reset(randomWidth, randomHeight);
        enemy1.body.maxVelocity.set(randomSpeed);
        }, 750); 
}

function collisionHandler(enemy, bullet) { 
    playerOneScore++; 
    var randomSpeed = Math.floor(Math.random() * 200) + 200;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var randomHeight = Math.floor(Math.random()*height)+1;
    var randomWidth = Math.floor(Math.random()*width)+1;
    enemy.kill();
    enemyParticles.x = enemy.x; 
    enemyParticles.y = enemy.y; 
    enemyParticles.start(true, 1000, null, 10);
    // reset enemy
    setTimeout(function(){
        enemy.reset(randomWidth, randomHeight);
        enemy.body.maxVelocity.set(randomSpeed);
        }, 500); 
}

function collisionHandler1(enemy1, bullet) { 
    playerOneScore++; 
    var randomSpeed = Math.floor(Math.random() * 400) + 200;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var randomHeight = Math.floor(Math.random()*height)+1;
    var randomWidth = Math.floor(Math.random()*width)+1;
    enemy1.kill();
    enemyParticles.x = enemy1.x; 
    enemyParticles.y = enemy1.y; 
    enemyParticles.start(true, 1000, null, 10);
    // reset enemy
    setTimeout(function(){
        enemy1.reset(randomWidth, randomHeight);
        enemy1.body.maxVelocity.set(randomSpeed);
        }, 750); 
}

function enemyCollisionHandler(playerOne, enemy) {
    playerOne.kill();
    playerParticles.x = playerOne.x; 
    playerParticles.y = playerOne.y; 
    playerParticles.start(true, 2500, null, 10);
}

function enemyCollisionHandler1(playerOne, enemy1) {
    playerOne.kill();
    playerParticles.x = playerOne.x; 
    playerParticles.y = playerOne.y; 
    playerParticles.start(true, 2500, null, 10);
} 

function playerCollisionHandler(playerOne, playerTwo) {
    playerOne.kill(); 
    playerTwo.kill(); 
    playerParticles.x = playerOne.x; 
    playerParticles.y = playerOne.y; 
    playerParticles.start(true, 2500, null, 10);
}

function startup() {
    setInterval(function() {
        randomX = Math.floor(Math.random() * 10)+ 1;
        randomY = Math.floor(Math.random() * 10) + 1;
    }, 5000);
}

window.addEventListener('load', startup, false); 