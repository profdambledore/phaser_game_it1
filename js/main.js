var config = {
    type: Phaser.AUTO,
    width: 1152,
    height: 1152,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

// Global Important Variables
var player, bullets, weaponCtrl; 
var enemies = [];
var target;

function preload() {
    // Load Tileset
    this.load.image('backTileset', 'assets/background.png')
    this.load.tilemapTiledJSON('backTilemap', 'assets/tileset.json')

    // Load Image Assets - Player
    this.load.image('player', 'assets/player.png')
    this.load.image('playerBullet', 'assets/playerBullet.png')

    // Load Image Assets - Enemy
	// Level 1
    this.load.image('enemy1', 'assets/enemy1.png')
	
	// Level 2
	this.load.image('enemy2', 'assets/enemy2.png')
	this.load.image('enemy2Bullet', 'assets/enemy2Bullet.png');
}

function create() {
	// Create weaponCtrl
	weaponCtrl = new WeaponCtrl();
	
    // Create Map from JSON
    this.map = this.make.tilemap({ key: 'backTilemap' });
    var tileset = this.map.addTilesetImage('background', 'backTileset')

    // Create Layers from Tiled information
    this.map.createStaticLayer('botGlowLayer', tileset, 0, 0);
    var mainLayer = this.map.createStaticLayer('midGlowLayer', tileset, 0, 0);
    this.map.createStaticLayer('topGlowLayer', tileset, 0, 0);

    // Add collision to the main layer
    mainLayer.setCollisionByProperty({ collide: true });

    // Set max bounds for camera and player movement
    this.cameras.main.setBounds(0, 0, 2048, 2048);
    this.physics.world.setBounds(0, 0, 2048, 2048);

    // Create the player object
    player = new Player(this, game.config.width * 0.5, game.config.height * 0.5, 'player')
    player.enableCollision(mainLayer);
    this.cameras.main.startFollow(player.hull, true, 0.5, 0.5);

    // Create base bullet group for the player
    bullets = this.physics.add.group({
        defaultKey: 'playerBullet',
        maxSize: 5
    });
    this.input.on('pointerdown', tryShoot, this);

    this.physics.world.on('worldbounds', function (body) {
        killBullet(body.gameObject);
    }, this);
	
	createEnemy.call(this, 2, player, this.map);

}

function update(time, delta) {
    // Allow the player class to update
    player.update(time, delta);

    // Allow any enemies in the array to update
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update(time, delta);
    }
}

function createEnemy(level, player, map) {
	// Choose which spawn to choose the enemy at
	var randSpawn = Math.floor(Math.random() * Math.floor(4));
	var enemySpawn = map.findObject("spawn", function (object)
		{
			if (object.id === (randSpawn + 9)) {
				return object;
			}
		});
	switch (level) {
		case 0:
			break;
		
		case 1:
			enemyTest = new Level1Enemy(this, enemySpawn.x, enemySpawn.y, player);
			enemies.push(enemyTest);
			this.physics.add.overlap(player.hull, enemyTest.hull, meleeDamage, null, this);
			break;
	
			
		case 2:
			enemy = new Level2Enemy(this, enemySpawn.x, enemySpawn.y, player);
			enemies.push(enemy);
			this.physics.add.overlap(player.hull, enemy.hull, meleeDamage, null, this);
			break;
	}
}	

function tryShoot(pointer) {
    var bullet = bullets.get(player.hull.x, player.hull.y);
    if (bullet) {
        fireBullet.call(this, bullet, player.hull.rotation, enemies);
    }
}

function fireBullet(bullet, rotation, target) {
	if (target != player) {
		var type = player.getType();
		if (type === 1) {
			weaponCtrl.weaponTypeOne(bullet, rotation);
			this.physics.velocityFromRotation(bullet.rotation, 500, bullet.body.velocity);
		}
    }
	else {
		weaponCtrl.enemyLevel2(bullet, rotation);
		this.physics.velocityFromRotation(bullet.rotation, 500, bullet.body.velocity);
	}

    if (target === player) {
        this.physics.add.overlap(player.hull, bullet, bulletHitPlayer, null, this);
    }
    else {
        for (var i = 0; i < enemies.length; i++) {
            this.physics.add.overlap(enemies[i].hull, bullet, bulletHitEnemy, null, this);
        }
    }
}

function killBullet(bullet) {
    bullet.disableBody(true, true);
    bullet.setActive(false);
    bullet.setVisible(false);
}

function bulletHitPlayer(hull, bullet) {
	killBullet(bullet);
	var damageType = 'bullet'
	player.damage(damageType)
	if (player.isDestroyed() == true) {
		this.physics.pause();
		console.log("You Lose");
	}
}

function bulletHitEnemy(hull, bullet) {
    var enemy;
    var index;
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].hull === hull) {
            enemy = enemies[i];
            index = i;
            break;
        }
    }
    killBullet(bullet);
    enemy.damage();

    if (enemy.alive == false) {
        enemies.splice(index, 1);
    }
}

function meleeDamage() {
	// If a tank overlaps with the player, this functionis called
	var damageType = 'melee';
	player.damage(damageType);
	if (player.isDestroyed() == true) {
		this.physics.pause();
		console.log("You Lose");
	}
}