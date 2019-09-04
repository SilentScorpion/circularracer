var game;
var  player,playerObj;
var turnSpeed = 0.0002;
var tracker1, tracker2;
var speed = 0.25;
var emitter;
var score;
class Racer extends Phaser.Scene {

    constructor() {
        super('Racer');
    }

    preload(){
        this.load.image('glow','assets/glow.png');

    }

    create(){

        this.title = this.add.text(game.config.width/2,100,"NOT A RACE").setOrigin(.5,.5);
        this.title.tint = 0x000000;
        this.title.setFontSize(75);

        this.score = this.add.text(game.config.width/2,250,"0").setOrigin(.5,.5)
        .setFontSize(100);
        this.score.tint = 0x000000;

        var graphicsObj  = this.add.graphics({
            lineStyle : {
                width: 115,
                color: 0x00AEC2,
                alpha: 1,
            },
            fillStyle: {
                color: 0x00AEC2,
                alpha: 1
            },
        });

        graphicsObj.strokeRoundedRect(75,game.config.height/2 - 100,game.config.width - 150,300,125);

        this.instruction = this.add.text(game.config.width/2,game.config.height - 150,"Click/Touch to Turn").setOrigin(.5,.5)
        .setFontSize(25);
        this.instruction.tint = 0xababab;

        this.hundred = this.add.text(game.config.width/2,game.config.height - 50,"#100DaysOfCode").setOrigin(.5,.5)
        .setFontSize(25);
        this.hundred.tint = 0xababab;

        //Add invisible collision blocks 
        this.edge1 = this.matter.add.rectangle(game.config.width/2,game.config.height/2 - 160,game.config.width,10,{restitution: .4, isStatic : true});
        this.edge2 = this.matter.add.rectangle(game.config.width/2,game.config.height/2 + 260,game.config.width,10,{restitution: .4, isStatic : true});
        this.edge3 = this.matter.add.rectangle(15,game.config.height/2,10,500,{restitution: .4, isStatic : true});
        this.edge4 = this.matter.add.rectangle(game.config.width - 15,game.config.height/2,10,500,{restitution: .4, isStatic : true});
        
        this.matter.add.image(50 ,500).setScale(1,10).setAngle(225).setStatic(true);
        this.matter.add.image(game.config.width - 50 ,500).setScale(1,10).setAngle(-45).setStatic(true);
        this.matter.add.image(game.config.width ,game.config.height/2 + 160).setScale(1,10).setAngle(45).setStatic(true);
        this.matter.add.image(0 ,game.config.height/2 + 160).setScale(1,10).setAngle(-45).setStatic(true);
        
        this.matter.add.rectangle(game.config.width/2,game.config.height/2 - 35 ,250,10,{restitution: .4, isStatic : true});
        this.matter.add.rectangle(game.config.width/2,game.config.height/2 + 135 ,250,10,{restitution: .4, isStatic : true});
        this.matter.add.rectangle(145,game.config.height/2 + 50,10,100,{restitution: .4, isStatic : true});
        this.matter.add.rectangle(455,game.config.height/2 + 50,10,100,{restitution: .4, isStatic : true});
        
        this.matter.add.image(game.config.width/3 - 35 ,game.config.height/2 + 115).setScale(0.5,1.5).setAngle(-45).setStatic(true);
        this.matter.add.image(game.config.width * 2/3 + 35 ,game.config.height/2 + 115).setScale(0.5,1.5).setAngle(45).setStatic(true);
        this.matter.add.image(game.config.width * 2/3 + 35 ,game.config.height/2 - 15).setScale(0.5,1.5).setAngle(-45).setStatic(true);
        this.matter.add.image(game.config.width/3 -35 ,game.config.height/2 - 15).setScale(0.5,1.5).setAngle(45).setStatic(true);

        //Adding a player Object
        player = this.matter.add.image(game.config.width/2, game.config.height/2 + 195,null);
        player.tint = 0x000000;
        player.displayWidth = 40;
        player.displayHeight = 25;

        //this.matter.add.existing(player);
        player.setFrictionAir(.1);
        player.setMass(10);

        tracker1 = this.add.rectangle(0, 0, 4, 4, 0xffffff);
        tracker2 = this.add.rectangle(0, 0, 4, 4, 0xffffff);

        //Adding a invisible trigger to increment score
        this.scoreTrigger = this.matter.add.image(game.config.width/2 - 50 ,game.config.height/2 + 200)
        .setAngle(90)
        .setStatic(true)
        .setSensor(true)
        .setScale(.5,5);
        this.scoreTrigger.label = 'scoretrigger';


        //this.addParticleEmitter();
        this.matter.world.on('collisionstart',function(event,bodyA, bodyB){
            if(bodyB.isSensor || bodyB.isSensor){
                this.score.text = ++score;
                console.log('increment score');
            }
            else{
                console.log('die');
                this.die();
            }
        },this);

        this.playButton = this.add.text(game.config.width/2, game.config.height/2 + 50, 'Play',{'fontSize' : '50px','color' : '#f0486c'})
        .setOrigin(.5,.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.playButton.setVisible(false);
            this.timedEvent = this.time.addEvent({    delay: 200, callback: () => {
                this.playing = true;
           },repeat: 0,  callbackScope: this,  });
        })
        score = 0;
        this.addBackgroundEmitter();
    }

    addParticleEmitter(){
        emitter = this.add.particles('glow').createEmitter({
            x: game.config.width/2,
            y: game.config.height/2,
            tint: 0xf0486c,
            //blendMode: 'SCREEN',
            scale: { start: 0.2, end: 0 },
            speed: { min: -200, max: 200 },
            quantity: 50
        });
        console.log('added a particle emitter');
    }

    addBackgroundEmitter(){
        var offscreen = new Phaser.Geom.Rectangle(-400, 0, 400, game.config.height);
        var screen = new Phaser.Geom.Rectangle(-400, 0, 1200, game.config.height);
    
        this.add.particles('glow', [
            {
               // frame: 'blue_ball',
               tint: 0xff6687,
                emitZone: { source: offscreen },
                deathZone: { source: screen, type: 'onLeave' },
                frequency: 200,
                alpha : 0.15,
                speedX: { min: 20, max: 60 },
                lifespan: 30000,
                scale: 0.5
            },
            {
               // frame: 'red_ball',
               tint: 0xff6666,
                emitZone: { source: offscreen },
                deathZone: { source: screen, type: 'onLeave' },
                frequency: 300,
                alpha : 0.3,
                speedX: { min: 60, max: 100 },
                lifespan: 30000,
                scale: 0.8
            },
        ]);   
    }
    

    die(){
        this.addParticleEmitter();
       //player.disableBody();
       emitter.explode(100,player.x, player.y);
       player.destroy();
       player = null;
        this.cameras.main.shake(500);
        this.playing = false;
        //this.time.event('')
        this.time.addEvent({
            delay : 500,
            callback : () => {
                this.scene.start(this);
            }
        });
    }
    
    
    update(){
        if(player == null || !this.playing)
            return;
        let point1 = player.getTopRight();
        let point2 = player.getBottomRight();

        tracker1.setPosition(point1.x, point1.y);
        tracker2.setPosition(point2.x, point2.y);

        if(this.input.activePointer.isDown){
           Phaser.Physics.Matter.Matter.Body.setAngularVelocity(player.body, -0.03);
            player.angle -= 1;
       }
        player.thrust(0.015);
    }
}


var config = {
    type: Phaser.AUTO,
    backgroundColor: 0xffffff,
    scene: [Racer],
    width: 600,
    height: 1200,
    scale: {
        parent: 'circularRacerParent',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0,
                x:0,
            },
            debug: false,
        }
    }

}

game = new Phaser.Game(config);