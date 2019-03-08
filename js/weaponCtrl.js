class WeaponCtrl {
	// WeaponCtrl is a seperate class, used for deciding what type of weapon the player is currently using.
	// It is a body in the level
	constructor () {
		
	}
	
	weaponTypeOne(bullet, rotation) {
		bullet.setDepth(1);
		bullet.enableBody(false);
		bullet.setActive(true);
		bullet.setVisible(true);
		bullet.body.collideWorldBounds = true;
		bullet.body.onWorldBounds = true;
		bullet.rotation = rotation;
		return;
	}
	
	enemyLevel2(bullet, rotation) {
		bullet.setDepth(1);
		bullet.enableBody(false);
		bullet.setActive(true);
		bullet.setVisible(true);
		bullet.body.collideWorldBounds = true;
		bullet.body.onWorldBounds = true;
		bullet.rotation = rotation;
		return;
	}
}