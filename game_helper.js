let GAMELOOPJS_SPEED = 1000 / 60;
let GAMELOOPJS_SPACE_TIMEOUT = 100;
let GAMELOOPJS_INTERVALS = [];
let currentHighscore = 0;
let MAP_X = 0;
let GAME_OBSTACLES = [];
let GAME_OBJECTS = [];
let gameOver = false;
const GAMELOOPJS_KEY = {};
let gameStarted = false;

document.body.style.overflowY = 'hidden';
document.body.style.overflowX = 'hidden';
document.addEventListener('keydown', e => GAMELOOPJS_KEY[e.keyCode] = true);
document.addEventListener('keyup', e => {
    GAMELOOPJS_KEY[e.keyCode] = false;
    if (e.keyCode === 37) leftKeyReleased(); // Links-Taste losgelassen
    if (e.keyCode === 39) rightKeyReleased(); // Rechts-Taste losgelassen
    if (e.keyCode === 32) spaceKeyReleased(); // Leertaste losgelassen
});


function leftKeyPressed() {
    console.log('Please implement the function leftKeyPressed()');
}

function rightKeyPressed() {
    console.log('Please implement the function rightKeyPressed()');
}

function upKeyPressed() {
    console.log('Please implement the function upKeyPressed()');
}

function downKeyPressed() {
    console.log('Please implement the function downKeyPressed()');
}

function spaceKeyPressed() {
    console.log('Please implement the function spaceKeyPressed()');
}

function spaceKeyReleased() {
    console.log('Please implement the function spaceKeyReleased()');
}

function addMap(src, parts = 10) {
    document.head.innerHTML += `
    <style>
        .moving-map {
            height: 100vh;
            position: absolute;
            left: 0;
            bottom: 100px;
        }
    </style>`;
    for (let i = 0; i < parts; i++) {
        const map = document.createElement('img');
        map.src = src;
        map.id = 'map' + i;
        map.classList.add('moving-map');
        document.body.appendChild(map);

        map.onload = () => {
            setTimeout(() => {
                document.querySelectorAll('.moving-map').forEach((map, i) => {
                    map.style.left = (i * map.getBoundingClientRect().width) + 'px';
                    gameStarted = true;
                });
            }, 100);
        }

    }


}

function moveMap(speed = 1) {
    const interval = setInterval(() => {
        if (!gameStarted) return;
        document.querySelectorAll('.moving-map').forEach(part => {
            MAP_X = 0 - (part.getBoundingClientRect().x - speed);
            part.style.left = (part.getBoundingClientRect().x - speed) + 'px';
        });

        GAME_OBSTACLES.forEach(obstacle => {
            obstacle.style.left = (obstacle.getBoundingClientRect().x - speed) + 'px';
        });
    }, 1000 / 60);

    GAMELOOPJS_INTERVALS.push(interval);
}

function placeObstacle(src, x, y, width = 100, height = 100) {
    let obstacle = document.createElement('img');
    obstacle.src = src;
    obstacle.style.zIndex = 1;
    obstacle.style.position = 'absolute';
    obstacle.style.left = x + 'px';
    obstacle.style.top = y + 'px';
    obstacle.style.width = width + 'px';
    obstacle.style.height = height + 'px';
    obstacle.classList.add('game-obstacle');
    document.body.appendChild(obstacle);
    GAME_OBSTACLES.push(obstacle);
}


function startHighscore(x = 50, y = 50) {
    document.body.innerHTML += `
        <h1 id="currentHighScoreCount" style="text-shadow: 2px 2px 2px rgba(0,0,0,0.5); font-size: 40px; position: absolute; top: ${y}px; left: ${x}px; margin-block-start: 0;"></h1>
    `;
    const interval = setInterval(() => {
        currentHighscore += 1;
        currentHighScoreCount.innerHTML = currentHighscore;
    }, 50);

    GAMELOOPJS_INTERVALS.push(interval);
}

class GameObject {

    img;
    x;
    y;
    groundLevel;
    height;
    imgElement;
    zIndex = 2;
    animationInterval;
    direction = 1;
    collisionOffsetX = 0;
    collisionOffsetY = 0;
    isAttacking = false;

    constructor(img, x, y, height = 100) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.groundLevel = y;
        this.height = height;
        this.spawn();
        GAME_OBJECTS.push(this);
    }

    spawn() {
        this.imgElement = document.createElement('img');
        this.imgElement.src = this.img;
        this.imgElement.style.position = 'absolute';
        this.imgElement.style.left = this.x + 'px';
        this.imgElement.style.top = this.y + 'px';
        this.imgElement.style.height = this.height + 'px';
        this.imgElement.style.zIndex = this.zIndex;
        document.body.appendChild(this.imgElement);
    }


    animateOnce(src, first, last, animationSpeed) {
        if (this.isAnimatingOnce) return; // Verhindert mehrfachen Aufruf

        this.isAnimatingOnce = true; // Sperre setzen

        // Speichert die aktuelle Animationseinstellung
        const originalImg = this.img;
        const originalFirst = this.currentFirst;
        const originalLast = this.currentLast;
        const originalSpeed = this.currentAnimationSpeed;

        // Setzt das neue Bild und startet die neue Animation
        this.img = src;
        this.animate(first, last, animationSpeed);

        // Setzt nach Ablauf der Animation die ursprüngliche Animation zurück
        setTimeout(() => {
            this.img = originalImg; // Originalbild zurücksetzen
            this.animate(originalFirst, originalLast, originalSpeed); // Starte alte Animation erneut
            this.isAnimatingOnce = false; // Sperre wieder freigeben
        }, (last - first + 1) * animationSpeed);
    }


    animate(first, last, animationSpeed = 100) {
        if (gameOver) return;

        // Speichert aktuelle Animationswerte
        this.currentFirst = first;
        this.currentLast = last;
        this.currentAnimationSpeed = animationSpeed;

        let current = first;
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            current++;

            // Wenn Limit erreicht, wieder zurück auf first
            if (current > last) {
                current = first;
            }

            // Endung der Datei ermitteln (z. B. ".png")
            const extensionMatch = this.img.match(/\.\w+$/);
            const extension = extensionMatch ? extensionMatch[0] : '';

            // Basis-Pfad ohne die Ziffern am Ende ermitteln
            const basePath = this.img.replace(/\d+\.\w+$/, '');

            // Frame-Nummer auf 3 Stellen formatieren (z. B. "001", "010", "100")
            const formattedFrame = String(current).padStart(3, '0');

            // src des Bildes aktualisieren
            this.imgElement.src = `${basePath}${formattedFrame}${extension}`;
            this.imgElement.style.top = `${this.y}px`;
            this.imgElement.style.left = `${this.x}px`;
            this.imgElement.style.transform = `scaleX(${this.direction})`;

        }, animationSpeed);
        GAMELOOPJS_INTERVALS.push(this.animationInterval);
    }


    runLeft(speed = 2) {
        if (this.runInterval) cancelAnimationFrame(this.runInterval); // Stoppe vorherige Bewegung

        const update = () => {
            if (gameOver) return;

            this.x -= speed; // Bewege den Zombie nach links
            this.imgElement.style.left = `${this.x}px`;

            this.runInterval = requestAnimationFrame(update); // Nächste Bewegung
        };

        this.runInterval = requestAnimationFrame(update);
    }


    runRight(speed = 2) {
        if (this.runInterval) cancelAnimationFrame(this.runInterval); // Stoppe vorherige Bewegung

        const update = () => {
            if (gameOver) return;

            this.x += speed; // Bewege das Objekt nach rechts
            this.imgElement.style.left = `${this.x}px`;

            this.runInterval = requestAnimationFrame(update); // Nächste Bewegung
        };

        this.runInterval = requestAnimationFrame(update);
    }


    flyAway(initialSpeedX = 20, initialSpeedY = 25, rotationSpeed = 10) {
        if (this.runInterval) cancelAnimationFrame(this.runInterval); // Stoppe das Laufen

        let angle = 0;
        let gravity = 0.3; // Weniger starke Schwerkraft für sanfteren Flug
        let friction = 0.99; // Reduziert X-Geschwindigkeit langsam
        let speedX = initialSpeedX * -this.direction; // Fliegt entgegengesetzt der Laufrichtung
        let speedY = initialSpeedY; // Startet mit hohem Wert und wird dann langsamer

        const update = () => {
            if (gameOver) return;

            this.x += speedX; // Bewegung in X-Richtung
            this.y -= speedY; // Bewegung in Y-Richtung (nach oben)

            speedX *= friction; // Luftwiderstand reduziert Geschwindigkeit langsam
            speedY -= gravity; // Schwerkraft zieht das Objekt nach unten

            angle += rotationSpeed * -this.direction; // Dreht sich in Flugrichtung
            this.imgElement.style.transform = `rotate(${angle}deg) scaleX(${this.direction})`;
            this.imgElement.style.left = `${this.x}px`;
            this.imgElement.style.top = `${this.y}px`;

            // Entferne das Objekt, wenn es aus dem Bildschirm fliegt oder auf den Boden fällt
            if (this.y > window.innerHeight || this.x < -200 || this.x > window.innerWidth + 200) {
                this.imgElement.remove();
                return;
            }

            requestAnimationFrame(update); // Wiederhole die Animation mit optimaler Framerate
        };

        requestAnimationFrame(update);
    }




    animateSpriteSheet(frames, animationSpeed = 100) {
        if (gameOver) return;
        if (this.animationInterval) clearInterval(this.animationInterval);

        let currentFrame = 0;

        // Entferne das alte Element, falls vorhanden
        this.imgElement.remove();
        this.imgElement = document.createElement('div');
        this.imgElement.style.position = 'absolute';
        this.imgElement.style.left = this.x + 'px';
        this.imgElement.style.top = this.y + 'px';
        this.imgElement.style.width = `${this.height}px`; // Nur ein Frame anzeigen
        this.imgElement.style.height = `${this.height}px`;
        this.imgElement.style.backgroundImage = `url(${this.img})`;
        this.imgElement.style.backgroundSize = `${this.height * frames}px ${this.height}px`;
        this.imgElement.style.backgroundRepeat = 'no-repeat';
        this.imgElement.style.zIndex = this.zIndex;

        // Direction berücksichtigen (Standard = 1)
        this.imgElement.style.transform = `scaleX(${this.direction})`;

        document.body.appendChild(this.imgElement);

        // Animationsintervall
        this.animationInterval = setInterval(() => {
            this.imgElement.style.left = this.x + 'px';
            this.imgElement.style.backgroundPositionX = `-${currentFrame * this.height}px`;
            this.imgElement.style.transform = `scaleX(${this.direction})`; // Spiegelung bei Richtungsänderung
            currentFrame = (currentFrame + 1) % frames;
        }, animationSpeed);

        GAMELOOPJS_INTERVALS.push(this.animationInterval);
    }



    jump(maxHeight = 150, speed = 5) {
        if (this.isJumping) return; // Kein neuer Sprung, wenn bereits springend
        if (gameOver) return;

        this.isJumping = true;
        let direction = -1; // Nach oben
        let maxReached = false;

        this.jumpInterval = setInterval(() => {
            // Sprung nach oben
            if (!maxReached) {
                this.y += direction * speed;
                if (this.y <= this.groundLevel - maxHeight) {
                    maxReached = true; // Maximum erreicht
                    direction = 1; // Nach unten
                }
            } else {
                // Fall zurück zum Boden
                this.y += direction * speed;
                if (this.y >= this.groundLevel) {
                    this.y = this.groundLevel; // Auf Boden zurücksetzen
                    this.endJump();
                }
            }

            // Position des Objekts aktualisieren
            this.imgElement.style.top = `${this.y}px`;
        }, 1000 / 60); // 60 FPS
    }


    cancelJump() {
        if (this.gameOver) return;
        if (this.isJumping) {
            clearInterval(this.jumpInterval);
            this.jumpInterval = null;
            this.isJumping = false;

            // Fall zurück zum Boden
            this.fallToGround()

        }
    }


    fallToGround(speed = 5) {
        const fallInterval = setInterval(() => {
            this.y += speed;
            if (this.y >= this.groundLevel) {
                this.y = this.groundLevel;
                clearInterval(fallInterval); // Stopp bei Boden
            }
            this.imgElement.style.top = `${this.y}px`;
        }, 1000 / 60);
    }

    endJump() {
        clearInterval(this.jumpInterval);
        this.jumpInterval = null;
        this.isJumping = false;
    }


    isColliding(callback) {
        gameInterval(() => {
            if (gameOver) return;

            const rect1 = this.imgElement.getBoundingClientRect();

            // Passe den Kollisionsbereich mit den Offsets an
            const adjustedRect1 = {
                left: rect1.left + this.collisionOffsetX,
                right: rect1.right - this.collisionOffsetX,
                top: rect1.top + this.collisionOffsetY,
                bottom: rect1.bottom - this.collisionOffsetY
            };

            for (let obj of GAME_OBJECTS) {
                if (obj === this) continue; // Sich selbst ignorieren

                const rect2 = obj.imgElement.getBoundingClientRect();

                // Auch den zweiten Collider anpassen
                const adjustedRect2 = {
                    left: rect2.left + obj.collisionOffsetX,
                    right: rect2.right - obj.collisionOffsetX,
                    top: rect2.top + obj.collisionOffsetY,
                    bottom: rect2.bottom - obj.collisionOffsetY
                };

                if (this._intersectRect(adjustedRect1, adjustedRect2)) {
                    callback(obj); // Falls Kollision erkannt, Callback ausführen
                }
            }
        }, 50);
    }


    showBorder(color = 'red') {
        if (this.borderElement) {
            this.borderElement.remove(); // Entfernt vorheriges Overlay, falls vorhanden
        }

        this.borderElement = document.createElement('div');
        this.borderElement.style.position = 'absolute';
        this.borderElement.style.border = `2px solid ${color}`;
        this.borderElement.style.pointerEvents = 'none'; // Damit es keine Klicks blockiert
        this.borderElement.style.zIndex = this.zIndex + 1;

        document.body.appendChild(this.borderElement);

        // Aktualisiere Position regelmäßig, falls sich das Objekt bewegt
        gameInterval(() => {
            if (!this.borderElement) return;

            let rect = this.imgElement.getBoundingClientRect();
            let width, height;

            if (this.imgElement.tagName === 'IMG') {
                // Normales <img>-Element (z.B. Zombies)
                width = rect.width - this.collisionOffsetX * 2;
                height = rect.height - this.collisionOffsetY * 2;
            } else {
                // <div> für den Charakter mit Sprite-Sheet
                width = this.height - this.collisionOffsetX * 2;
                height = this.height - this.collisionOffsetY * 2;
            }

            this.borderElement.style.width = `${width}px`;
            this.borderElement.style.height = `${height}px`;
            this.borderElement.style.left = `${this.x + this.collisionOffsetX}px`;
            this.borderElement.style.top = `${this.y + this.collisionOffsetY}px`;
        }, 16); // 60 FPS
    }




    _intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }
}



function flyUp(gameObject, speed = 10, repeat = 2000) {
    let i = 0;
    let interval = gameInterval(() => {
        gameObject.y -= speed;
        if (++i >= repeat) {
            clearInterval(interval);
        }
    }, GAMELOOPJS_SPEED);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function flyDown(gameObject, speed = 10, repeat = 2000) {
    let i = 0;
    let interval = gameInterval(() => {
        gameObject.y += speed;
        if (++i >= repeat) {
            clearInterval(interval);
        }
    }, GAMELOOPJS_SPEED);
}


let spaceKeyLocked = false;
function gameLoop() {
    if (GAMELOOPJS_KEY[37]) leftKeyPressed();
    if (GAMELOOPJS_KEY[39]) rightKeyPressed();
    if (GAMELOOPJS_KEY[38]) upKeyPressed();
    if (GAMELOOPJS_KEY[40]) downKeyPressed();
    if (GAMELOOPJS_KEY[32]) {
        if (!spaceKeyLocked) {
            spaceKeyPressed();
            spaceKeyLocked = true;
            setTimeout(() => {
                spaceKeyLocked = false;
            }, GAMELOOPJS_SPACE_TIMEOUT);
        }
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);


function waitForCollision(object1, object2) {
    return new Promise((resolve) => {
        gameInterval(() => {
            if (object2 instanceof Array) {
                object2.forEach((gameObject) => {
                    if (isColliding(object1, gameObject)) {
                        resolve([object1, gameObject]);
                    }
                });
            } else {
                if (isColliding(object1, object2)) {
                    resolve([object1, object2]);
                }
            }
        }, 50);
    });
}


function isColliding(object1, object2) {
    let children = typeof rocket !== 'undefined' ? app.stage.children : [];
    if (children.includes(object1) && children.includes(object2)) {

        const bounds1 = object1.getBounds();
        const bounds2 = object2.getBounds();

        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
    }
    return false;
}


function stopGame() {
    gameOver = true;
    GAMELOOPJS_INTERVALS.forEach(clearInterval);
}

function gameInterval(fun, time) {
    let interval = setInterval(fun, time);
    GAMELOOPJS_INTERVALS.push(interval);
    return interval;
}