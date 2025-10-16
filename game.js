addMap("./img/dead _forest.png");

let character = new GameObject(
  "./img/crusader/Idle/0_Skeleton_Crusader_Idle_000.png",
  200,
  700,
  300
);
character.animate(0, 17, 50);

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
    setTimeout(function() {
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
