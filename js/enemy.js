// Base Enemy
class BaseEnemy {
    constructor(scene, x, y, texture, player) {
        this.scene = scene;
        this.player = player;
        this.hull = this.scene.physics.add.sprite(x, y, texture);
        this.hull.body.collideWorldBounds = true;
        this.hull.setDepth(2);
    }

    update(player) {
        this.hull.rotation = Phaser.Math.Angle.Between(this.hull.x, this.hull.y, this.player.hull.x, this.player.hull.y);
    }

    enableCollision(mainLayer) {
        this.scene.physics.add.collider(this.hull, mainLayer);
    }

    damage() {
        this.health--;
        if (this.health == 0) {
            this.hull.destroy();
            this.alive = false;
        }
    }
}

class Level0Enemy extends BaseEnemy {
    // Target Enemy - mainly used for testing
    constructor(scene, x, y, player) {
		var texture = 'enemy1'
        super(scene, x, y, texture, player);
        this.hull.body.setSize(this.hull.width - 16, this.hull.height - 16);
    }
}

class Level1Enemy extends BaseEnemy {
    constructor(scene, x, y, player) {
		var texture = 'enemy1'
        super(scene, x, y, texture, player);
        this.hull.body.setSize(this.hull.width - 16, this.hull.height - 16);
        this.health = 2;
        this.currentSpeed = 0;
        this.alive = true;

    }

    update() {
        if (this.alive == true) {
            super.update(player);
            this.currentSpeed = 150;

            // Set the enemies target to be the player
            this.targetX = this.player.x;
            this.targetY = this.player.y;

            this.scene.physics.velocityFromRotation(this.hull.rotation, this.currentSpeed, this.hull.body.velocity);
        }
    }

    damage() {
        super.damage();
    }
}

class Level2Enemy extends BaseEnemy {
	constructor(scene, x, y, player) {
		var texture = 'enemy2';
		super(scene, x, y, texture, player);
		this.hull.body.setSize(this.hull.width - 8, this.hull.height - 8);
		this.health = 2;
		this.currentSpeed = 0;
		this.alive = true;
		this.fireTime = 0;
		
		// Create a group for each level of enemy bullets
		this.bullets = this.scene.physics.add.group({
		defaultKey: 'enemy2Bullet',
		maxSize: 10
		});
	}

	update(time, delta, player) {
        if (this.alive == true) {
            super.update(player);
            this.currentSpeed = 100;

            // Set the enemies target to be the player
            this.targetX = this.player.x;
            this.targetY = this.player.y;
			
			if (Phaser.Math.Distance.Between(this.hull.x, this.hull.y, this.player.hull.x, this.player.hull.y) < 200) {
				this.currentSpeed = 0;
				var bullet = this.bullets.get(this.hull.x, this.hull.y);
				if (bullet) {
					fireBullet.call(this.scene, bullet, this.hull.rotation, this.player);
				}
			}

            this.scene.physics.velocityFromRotation(this.hull.rotation, this.currentSpeed, this.hull.body.velocity);
        }
    }
	
	damage() {
		super.damage();
		if (this.health == 0) {
            this.bullets.clear();
        }
	}
}