game.snake = {
    game: game,
    board: game.board,
    moving: false,
    realMoving: true,
    snakeCells: [],
    directions: {
        up: {
            row: -1,
            col: 0,
            angle: 0
        },
        down: {
            row: 1,
            col: 0,
            angle: 180
        },
        left: {
            row: 0,
            col: -1,
            angle: 270
        },
        right: {
            row: 0,
            col: 1,
            angle: 90
        }
    },
    presentMovement: false,
    previousCol: 4,
    previousRow: 4,
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendX: 0,


    clearSnakeCells() {
        this.snakeCells = [];
    },

    create() {
        this.clearSnakeCells();
        const startCells = [
            {row: this.board.rowNumber/2,
            col: this.board.colNumber/2},

            {row: this.board.rowNumber/2 + 1,
            col: this.board.colNumber/2},

            {row: this.board.rowNumber/2 + 2,
            col: this.board.colNumber/2},
        ];

        for (let startCell of startCells) {
            let findedItem = this.getBodyCell(startCell.row, startCell.col);
            this.snakeCells.push(findedItem);
        }

    },

    getBodyCell(row, col) {
        return this.board.fieldCells.find(cell => cell.row === row && cell.col === col);
    },

    renderSnake() {
        this.renderHead();
        this.renderBody();
        
    },
    
    renderHead() {

        if(this.previousCol != this.presentMovement.col && this.previousRow == this.presentMovement.row ||
            this.previousCol == this.presentMovement.col && this.previousRow != this.presentMovement.row) {
                const head = this.snakeCells[0];
                const halfSize = this.game.pictures.field.width/2;
                //поворачиваем контекст
                this.game.ctx.save();
                //точка отсчета координат в центр головы
                this.game.ctx.translate(head.x + halfSize, head.y + halfSize);
                // вращаем контекст
                let degree = this.previousAngle;
                this.game.ctx.rotate(degree * Math.PI / 180);
                this.game.ctx.drawImage(this.game.pictures.head, -halfSize, -halfSize, this.game.pictures.field.width+1, this.game.pictures.field.height+1);
                this.game.ctx.restore();
            
		} else {
            const head = this.snakeCells[0];
            const halfSize = this.game.pictures.field.width/2;
            this.game.ctx.save();
            this.game.ctx.translate(head.x + halfSize, head.y + halfSize);
            let degree = this.presentMovement.angle;
            this.game.ctx.rotate(degree * Math.PI / 180);
            this.game.ctx.drawImage(this.game.pictures.head, -halfSize, -halfSize, this.game.pictures.field.width+1, this.game.pictures.field.height+1);
            this.game.ctx.restore();
        }
        
    },

    renderBody() {

        for (let i = 1; i < this.snakeCells.length-1; i++) {
            this.game.ctx.drawImage(this.game.pictures.body, this.snakeCells[i].x, this.snakeCells[i].y, this.game.pictures.field.width, this.game.pictures.field.height);
        }
        
    },
    
    go(keyCode) {
        switch (keyCode) {
            case 38:
                this.presentMovement = this.directions.up;
                break;
            case 40:
                this.presentMovement = this.directions.down;
                break;
            case 37:
                this.presentMovement = this.directions.left;

                break;
            case 39:
                this.presentMovement = this.directions.right;
                break;
        }

        if (!this.moving) {
            this.game.sounds.themeSound.loop = true;
            this.game.sounds.themeSound.play();
        }

        this.moving = true;
    },

    goMobile(event) {

        if (event.type === "touchstart") {
            event.preventDefault()  
            this.touchstartX = event.changedTouches[0].screenX;
            this.touchstartY = event.changedTouches[0].screenY;
        } else if (event.type === "touchend") {
            event.preventDefault()
            this.touchendX = event.changedTouches[0].screenX;
            this.touchendY = event.changedTouches[0].screenY;
            this.setDirection();
        }

    },

    setDirection() {
        let pageWidth = window.innerWidth || document.body.clientWidth;
        let treshold = Math.max( 1,Math.floor( 0.01 * (pageWidth) ) );
        
        const limit = Math.tan(45 * 1.5 / 180 * Math.PI);

        let x = this.touchendX - this.touchstartX;
        let y = this.touchendY - this.touchstartY;
        let xy = Math.abs(x / y);
        let yx = Math.abs(y / x);

        if (Math.abs(x) > treshold || Math.abs(y) > treshold ) {
            if (yx <= limit) {
                if (x < 0) {
                    this.presentMovement = this.directions.left;
                } else {
                    this.presentMovement = this.directions.right;
                }
            }
            if (xy <= limit) {
                if (y < 0) {
                    this.presentMovement = this.directions.up;
                } else {
                    this.presentMovement = this.directions.down;
                }
            }
        } 

        if (!this.moving) {
            this.game.sounds.themeSound.loop = true;
            this.game.sounds.themeSound.play();
        }

        this.moving = true;
                
    },

    move() {
        if (this.moving) {
            let nextCell = this.getNextCell();

            if ( !nextCell || this.board.isBomb(nextCell) || this.board.isAdditBomb(nextCell) ||
             this.hasCell(nextCell) ) {
                //завершение игры 
                this.game.stop();
            }

            if (nextCell) {
                this.snakeCells.unshift(nextCell);
            //если не яблоко
                if (!this.board.isApple(nextCell) && !this.board.isBonus(nextCell) && !this.board.isFailure(nextCell)) {
                    this.snakeCells.pop();
                } else if (this.board.isBonus(nextCell)) {
                    this.game.score++;
                    this.game.score++;
                    this.snakeCells.unshift(nextCell);
                    this.snakeCells.unshift(nextCell);
                    this.game.sounds.appleSound.play();
                    this.board.createBonus();
                } else if (this.board.isFailure(nextCell)) {
                    this.game.score--;
                    this.game.sounds.bombSound.play();
                    this.board.createFailure();
                } else {
                    this.game.score++;
                    this.game.sounds.appleSound.play();
                    this.board.createApple(); 
                }
            } 
        }
        
    },

    getNextCell() {
        let head = this.snakeCells[0]; 
        
        if (this.previousCol != this.presentMovement.col && this.previousRow == this.presentMovement.row ||
            this.previousCol == this.presentMovement.col && this.previousRow != this.presentMovement.row) {
                let row = head.row + this.previousRow;
                let col = head.col + this.previousCol;
                return this.getBodyCell(row, col);
		}

		this.previousCol = this.presentMovement.col;
		this.previousRow = this.presentMovement.row;
        this.previousAngle = this.presentMovement.angle;
        
        let row = head.row + this.presentMovement.row;
        let col = head.col + this.presentMovement.col;
        return this.getBodyCell(row, col);
    },

    hasCell(item) {
        return this.snakeCells.find(element => element === item);
    }
};