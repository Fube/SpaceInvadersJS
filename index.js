const WIDTH = 700, HEIGHT= 700, SIZE = 25, SPEED = 3.333333, COOLDOWN = 0.2;
const ENEMY_SIZE = 30;
const bullets = [];
const enemies = [];
let killed = 0;
let player;

function setup(){
    
    //Assign to global player
    player = new Player(WIDTH/2 - SIZE, HEIGHT - SIZE - 5, SIZE, SIZE);

    //Spawn initial wave
    newWave(70);
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
}

class Monster{
    
    constructor(x, y){

        this.w = SIZE + 5;
        this.h = SIZE + 5;
        this.x = x;
        this.y = y;
        //DO NOT FUCK WITH THE SPEED
        //ANYTHING THAT ISNT 2.5 OR 5 WILL CAUSE A WEIRD DELAY BETWEEN THE ENEMIES
        this.speed = 2.5;
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

    draw(){return rect(this.x, this.y, this.w, this.h);}
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
        return rect(this.x - this.w/2, this.y, this.w, this.h);
    }
}

function newWave(n){
    
    for(let i = 0; i < n; i++){

        //I am writing this at 2:10 AM, I can not tell you how I came to these formulas. They might be really simple, but my brain is not vibing right now so I can not properly comment this.
        //TODO: explain
        const spacing = 5;
        const perRow = Math.floor(WIDTH / (ENEMY_SIZE + spacing)) - 1;

        const x = (i * (ENEMY_SIZE) + spacing * i) % ((ENEMY_SIZE + spacing) * perRow);
        const y = Math.floor(i / perRow) * (spacing / 2) * -ENEMY_SIZE -ENEMY_SIZE;
        
        enemies.push(new Monster(x, y));
    }
}