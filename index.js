const WIDTH = 700, HEIGHT= 700, SIZE = 25, SPEED = 3.333333, COOLDOWN = 0.5;
const ENEMY_SIZE = 30;
const ENEMY_SPEED = 2.5;
const SPACINGY = 5;
const bullets = [];
const enemies = [];
let killed = 0;
let player;

function setup(){
    
    //Assign to global player
    player = new Player(WIDTH/2 - SIZE, HEIGHT - SIZE - 5, SIZE, SIZE);

    //Spawn initial wave
    newWave(70);
    document.getElementById`score`.textContent = killed;
}

function draw(){


    //Render background
    createCanvas(WIDTH, HEIGHT);
    background(0);

    //Movement
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65) && player.x >= 0){player.move(-SPEED);}
    else if(keyIsDown(RIGHT_ARROW) || keyIsDown(68) && player.x + player.w < WIDTH){player.move(SPEED);}

    //Shooting
    if(keyIsDown(32) && player.readyToShoot){player.shoot();}

    for(let enemy of enemies){enemy.draw();}
    //Render game objects
    for (let bullet of bullets){
        if(bullet.shouldDelete){
            bullets.splice(bullets.indexOf(bullet), 1);
            //Mark for GC
            bullet = null; 
            continue;
        }
        bullet.draw();

        //Hit detection code
        for (let enemy of enemies){

            if(enemy.isHitBy(bullet)){

                const bulletIndex = bullets.indexOf(bullet);
                const enemyIndex = enemies.indexOf(enemy);

                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                killed++;
            }
        }
    }

    if (enemies.length == 0){
        newWave(killed/2);
    }


    player.draw();
    document.getElementById`score`.textContent = `Score : ${killed}`;
}

class Monster{
    
    constructor(x, y){

        this.w = SIZE + SPACINGY;
        this.h = SIZE + SPACINGY;
        this.x = x;
        this.y = y;

        //DO NOT FUCK WITH THE SPEED
        //ANYTHING THAT ISN'T 2.5, 3 OR 5 WILL CAUSE A WEIRD DELAY BETWEEN THE ENEMIES
        this.speed = ENEMY_SPEED;

        this.oneDown = 3 + this.h;
    }

    isGameOver(){return this.y + this.h + this.oneDown >= player.y;}

    draw(){

        if (this.x + this.speed + this.w > WIDTH){

            if (!this.isGameOver()){
                this.speed *= -1;
                this.y += this.oneDown;
            }else{
                alert('Game Over!');
            }
        }else if (this.x + this.speed <= 0){

            if (!this.isGameOver()){
                this.speed *= -1;
                this.y += this.oneDown;
            }else{
                alert("Game Over!")
            }
        }else{
            this.x += this.speed;
        }
        fill(150,123,182);
        return rect(this.x, this.y, this.w, this.h);
    }

    isHitBy(bullet){
        return dist(this.x, this.y, bullet.x, bullet.y) < (bullet.w + this.w);
    }
}

class Player{

    constructor(x, y, h, w){
        
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.readyToShoot = true;
    }

    shoot(){

        this.readyToShoot = false;
        setTimeout(_ => {this.readyToShoot = true;}, COOLDOWN * 1000);
        bullets.push(new Bullet(this.x + this.w/2, this.y+3));
    }

    move(vx){this.x = this.x+vx;}

    draw(){fill("white");return rect(this.x, this.y, this.w, this.h);}
}

class Bullet{

    constructor(x, y){

        this.w = 6;
        this.h = 15;
        this.x = x;
        this.y = y;
        this.speed = 3.5;
    }

    draw(){

        this.y -= this.speed;
        fill("red");
        const shape = rect(this.x - this.w/2, this.y, this.w, this.h);
        return shape;
    }

    get shouldDelete(){return this.y < 0;}
}

function newWave(n){

    for(let i = 0; i < n; i++){

        //I am writing this at 2:10 AM, I can not tell you how I came to these formulas. They might be really simple, but my brain is not vibing right now so I can not properly comment this.
        //TODO: explain
        const spacingX = ENEMY_SPEED * 2;
        const perRow = Math.floor(WIDTH / (ENEMY_SIZE + spacingX)) - 1;

        const x = (i * (ENEMY_SIZE) + spacingX * i) % ((ENEMY_SIZE + spacingX) * perRow);
        const y = Math.floor(i / perRow) * (SPACINGY / 2) * -ENEMY_SIZE -ENEMY_SIZE;
        
        enemies.push(new Monster(x, y));
    }
}