addMap("./img/dead _forest.png");

let character = new GameObject(
  "./img/crusader/Idle/0_Skeleton_Crusader_Idle_000.png",
  1000,
  750,
  200
);
character.animate(0, 17, 50);
character.collisionOffsetX = 40;
//character.showBorder();

character.isColliding(function (zombie) {
  if (character.isAttacking) {
    zombie.flyAway(15, 10, 15);
  }
});

spawnZombie();
function spawnZombie() {
  const fromLeft = Math.random() < 0.5;
  let zombie = new GameObject("./img/Zombie/Walk.png");
  zombie.height = 300;
  zombie.direction = fromLeft ? 1 : -1;
  zombie.x = fromLeft ? -300 : window.innerWidth + 100;
  zombie.y = 615;
  zombie.collisionOffsetX = 100;
  //zombie.showBorder();
  if (fromLeft) {
    zombie.runRight(3);
  } else {
    zombie.runLeft(3);
  }
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

function upKeyPressed() {
  if (character.isJumping) return;

  character.animateOnce(
    "./img/crusader/Jump Start/0_Skeleton_Crusader_Jump Start_000.png",
    0,
    5,
    60
  );

  character.jump(250, 8);
}

function upKeyReleased() {
  character.img = "./img/crusader/Idle/0_Skeleton_Crusader_Idle_000.png";
  character.animate(0, 17, 50);
}
