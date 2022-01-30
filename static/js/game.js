const game = {
    width: 0,
    height: 0,
    screenOptions: {
        min: {
            width: 480,
            height: 330
        },
        max: {
            width: 800,
            height: 480
        }
    }, 
    screenData: null,
    canvas: null,
    ctx: null,
    board: null,
    snake: null,
    pictures: {
        field: null,
        body: null,
        apple: null,
        head: null,
        bomb: null,
        bonus: null,
        failure: null,
        additBomb: null,
    },
    sounds: {
        appleSound: null,
        bombSound: null,
        themeSound: null,
        dieSound: null
    },
    intervalGame: 0,
    intervalBomb: 0,
    score: 0,
    moving: false,
    
    init() {
        this.clearIntervals();
        this.canvas = document.querySelector('canvas');
        this.ctx = canvas.getContext('2d');
        
        this.setScreenParametres();

        this.preload(() => {
            this.start();
        });
    },

    setScreenParametres() {
        this.screenData = {
            minWidth: this.screenOptions.min.width,
            minHeight: this.screenOptions.min.height,
            maxWidth: this.screenOptions.max.width,
            maxHeight: this.screenOptions.max.height,

            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
        };

        if (this.screenData.screenWidth/this.screenData.screenHeight > this.screenData.maxWidth/this.screenData.maxHeight) {
            this.height = Math.round(this.width * this.screenData.screenHeight / this.screenData.screenWidth);
            this.height = Math.min(this.height, this.screenData.maxHeight);
            this.height = Math.max(this.height, this.screenData.minHeight);
            this.width = Math.round(this.screenData.screenWidth * this.screenData.maxHeight / this.screenData.screenHeight);

            this.canvas.style.width = "100%";
        } else {
            this.width = Math.round(this.screenData.screenWidth * this.screenData.maxHeight / this.screenData.screenHeight);
            this.width = Math.min(this.width, this.screenData.maxWidth);
            this.width = Math.max(this.width, this.screenData.minWidth);
            this.height = Math.round(this.width * this.screenData.screenHeight / this.screenData.screenWidth);
            this.canvas.style.height = "100%";
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    preload(run) {
        let counter = 0;
        let numberOfPictures = Object.keys(this.pictures).length + Object.keys(this.sounds).length;
        
        function checkLoadedPictures() {
            counter++;

            if (counter >= numberOfPictures){
                run();
            }
        }

        for (let key in this.pictures) {
            this.pictures[key] = new Image();
            this.pictures[key].src = `static/image/${key}.png`;
            this.pictures[key].addEventListener('load', checkLoadedPictures);
        }

        for (let key in this.sounds) {
            this.sounds[key] = new Audio();
            this.sounds[key].src = `static/sound/${key}.mp3`;
            this.sounds[key].addEventListener('canplaythrough', checkLoadedPictures, {once:true});
        }
    },

    start() {
        this.board.create();
        this.snake.create();
        this.board.createApple();
        this.board.createBomb();

        //анимация начала игры
        this.clearHeader();
        this.startHeader();

        this.setListeners()
        this.setIntervals();
    },

    setIntervals() {
        this.intervalGame = setInterval( () => {
            this.snake.move();

            requestAnimationFrame(() => {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.board.renderBoard();
                this.snake.renderSnake();
                this.ctx.font = "18px myFont";
                this.ctx.fillStyle = "black";
                this.ctx.fillText(`Score: ${this.score}`, 40, 60);

                if (window.localStorage.getItem("currentUser") ) {
                    this.ctx.fillText(`User: ${JSON.parse( window.localStorage.getItem("currentUser")).username}`, 40, 80);

                }
            });
        }, 100);

        this.intervalBomb = setInterval( () => {
            if (this.snake.moving && this.score > 6) {
                this.board.createBomb();
                this.board.createAdditBomb();
            } else if (this.snake.moving) {
                this.board.createBomb();
            }
        }, 4000);

        
        (function runInterval() {
            interval = game.board.random(5,6)*2000;
            setTimeout( function() {
                if (game.snake.moving && game.score > 4 ) {
                    game.board.createBonus();
                    setTimeout( () => {
                        game.board.createFailure();  
                    }, 2000);
                }
                runInterval();
            }, interval);

        })();
    },

    clearIntervals() {
        clearInterval(this.intervalGame);
        clearInterval(this.intervalBomb);
    },

    setListeners() {

        window.addEventListener('keydown', e => {
            this.clearHeader();
            if (e.keyCode === 37 && window.location.hash === '#game' || e.keyCode === 38 && window.location.hash === '#game'||
            e.keyCode === 39 && window.location.hash === '#game' || e.keyCode === 40 && window.location.hash === '#game') {
                this.snake.go(e.keyCode);
            }

        });

        this.canvas.addEventListener('touchstart', e => {
            this.snake.goMobile(e);

        }, false);

        this.canvas.addEventListener('touchend', e => {
            this.snake.goMobile(e);

        }, false);
    },

    stop() {
        this.snake.realMoving = false;
        this.stopHeader();

        if (location.hash === "#rules" || location.hash === "#records") {
            this.snake.moving = false;
            this.clearIntervals();
            window.location.reload();
            this.saveScore();
        }

        this.sounds.bombSound.play();
        this.sounds.dieSound.play();

        this.clearIntervals();

        setInterval( () => {
            window.location.reload();
        }, 2000);

        this.saveScore();
    },
    
    saveScore() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        user.score = this.score;

        fetch('http://127.0.0.1:4000/saveUserScore', {
            method: 'POST',
            body: JSON.stringify(user),
        })
        .then((data) => {
            console.log(data);
        });
    },

    startHeader() {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return;
          } else {
            const content = document.getElementById('content');
            const pressingToStart = document.createElement('div');
            pressingToStart.classList = "arrowUp";
            pressingToStart.innerHTML = "PRESS TO START";
            const arrowUp = new Image();
            arrowUp.src = "static/image/arrowUp.png";
            pressingToStart.append(arrowUp);
            content.append(pressingToStart);
        }
        

    },

    stopHeader() {
        const content = document.getElementById('content');
        const gameOver = document.createElement('div');
        const gameScore = document.createElement('div');
        gameOver.classList = "arrowUp";
        gameOver.innerHTML = `GAME OVER!`
        gameScore.innerHTML = `YOUR SCORE: ${this.score}`;
        gameOver.append(gameScore);
        content.append(gameOver);
    },

    clearHeader() {
        if ( document.querySelector('.arrowUp') ) {
            let pressingToStart = document.querySelector('.arrowUp');
            pressingToStart.style.display = "none";
        }
    }
};
