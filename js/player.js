class Player {
    constructor(scene, x, y, texture) {
        // Set up properties
        this.scene = scene;
        this.currentHealth = 100;
        this.currentSpeed = 0;
        this.takenDamage = false;
        this.invunTime = 0;
        this.hull = scene.physics.add.sprite(x, y, texture);
        this.hull.body.setSize(this.hull.width - 8, this.hull.height - 8);
        this.hull.body.colideWorldBounds = true;
        this.type = 1;

        // Add listeners for mobile devices
        this.scene.input.on('pointerdown', this.handlePointerDown, this);
        this.scene.input.on('pointerup', this.handlePointerUp, this);
        this.touchData = {};
    }

    update(time, delta) {
        // Update player movement
        const worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);
        this.hull.rotation = Phaser.Math.Angle.Between(this.hull.x, this.hull.y, worldPoint.x, worldPoint.y);
        this.scene.physics.velocityFromRotation(this.hull.rotation, this.currentSpeed, this.hull.body.velocity);
		
		//Check invunrability
		if (this.takenDamage == true && this.invunTime == 0) {
			this.invunTime = time;
			console.log('made invun');
		}
		if (this.invunTime > 0) {
			if (time > this.invunTime + 2000) {
				this.invunTime = 0;
				this.takenDamage = false;
				console.log('no longer invun');
			}
		}
    }

    handlePointerDown(pointer) {
        this.touchData.startX = pointer.x;
        this.touchData.startY = pointer.y;
        this.currentSpeed = 250;
    }

    handlePointerUp(pointer) {
        this.touchData.endX = pointer.x;
        this.touchData.endY = pointer.y;
        this.currentSpeed = 0;
        this.handleTouch();
    }

    handleTouch() {
        const distX = this.touchData.endX - this.touchData.startX;
        const distY = this.touchData.endY - this.touchData.startY;
        this.touchData = {};
    }

    enableCollision(mainLayer) {
        // Enable collision between the player and the border
        this.scene.physics.add.collider(this.hull, mainLayer);
    }
	
	getType(){
		// Returns what weapon type is currently selected
		return this.type;
	}
	
	damage(damageType) {
		if (this.takenDamage == false) {	
			if (damageType === 'melee') {
				this.currentHealth = this.currentHealth - 5;
				console.log(this.currentHealth);
				this.scene.cameras.main.shake(200,0.005);
				this.takenDamage = true;
			}
			else if (damageType === 'bullet') {
				this.currentHealth = this.currentHealth - 10;
				console.log(this.currentHealth);
				this.scene.cameras.main.shake(200,0.01);
				this.takenDamage = true;
			}
		}
	}
	
	isDestroyed() {
		// Test to see if the player is destroyed or not, when damage is taken
		if (this.currentHealth <= 0) {
			this.scene.input.off('pointerdown', this.handlePointerDown, this);
			this.scene.input.off('pointerup', this.handlePointerUp, this);
			return true;
		}
	}
}