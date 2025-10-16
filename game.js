addMap("./img/dead _forest.png");

let character = new GameObject(
  "./img/crusader/Idle/0_Skeleton_Crusader_Idle_000.png",
  200,
  750,
  200
);
character.animate(0, 17, 50);
character.collisionOffsetX = 40;
//character.showBorder();

character.isColliding(function(zombie) {
    if (character.isAttacking) {
      zombie.flyAway(15, 10, 15);
    }
});

spawnZombie();
function spawnZombie() {
  let zombie = new GameObject("./img/Zombie/Walk.png");
  zombie.height = 300;
  zombie.direction = -1;
  zombie.x = 1000;
  zombie.y = 615;
  zombie.collisionOffsetX = 100;
  //zombie.showBorder();
  zombie.runLeft(3);
  zombie.animateSpriteSheet(10, 100);

  setTimeout(spawnZombie, Math.random() * 5000);
}

function spaceKeyPressed() {
  if (character.isAttacking) {
    return;
  }
  character.isAttacking = true;
  character.animateOnce(
    "./img/crusader/Slashing/0_Skeleton_Crusader_Slashing_000.png",
    0,
    11,
    30
  );
  setTimeout(function () {
    character.isAttacking = false;
  }, 11 * 20);
}

function rightKeyPressed() {
  character.x = character.x + 4;
  character.direction = 1;

  if (character.img.endsWith("Running_000.png")) {
    return;
  }
  character.img = "./img/crusader/Running/0_Skeleton_Crusader_Running_000.png";
  character.animate(0, 11, 50);
}

function rightKeyReleased() {
  character.img = "./img/crusader/Idle/0_Skeleton_Crusader_Idle_000.png";
  character.animate(0, 17, 50);
}

function leftKeyPressed() {
  character.x = character.x - 4;
  character.direction = -1;

  if (character.img.endsWith("Running_000.png")) {
    return;
  }
  character.img = "./img/crusader/Running/0_Skeleton_Crusader_Running_000.png";
  character.animate(0, 11, 50);
}

function leftKeyReleased() {
  character.img = "./img/crusader/Idle/0_Skeleton_Crusader_Idle_000.png";
  character.animate(0, 17, 50);
}
