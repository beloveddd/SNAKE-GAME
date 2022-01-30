game.board = {
    game: game,
    fieldCells: [],
    rowNumber: 16,
    colNumber: 24, 

    clearfieldCells() {
        this.fieldCells = [];
    },

    create() {
        this.clearfieldCells();
        for (let row = 0; row < this.rowNumber; row++) {
            for (let col = 0; col < this.colNumber; col++) {
                this.fieldCells.push(this.createFieldCell(row, col));
            }
        }
    },
    createFieldCell(row, col) {
        const fieldCellSize = this.game.pictures.field.width+1;
        let x = (this.game.width - fieldCellSize * this.colNumber) / 2;
        let y = (this.game.height - fieldCellSize * this.rowNumber) / 2;
        return {
            row: row,
            col: col,
            x: x + fieldCellSize * col, 
            y: y + fieldCellSize * row
        }
    },

    createStuff(type) {
        let element = this.fieldCells.find(item => item.type === type);
            if (element) {
                element.type = false;
            }

        element = this.getRandomCell();
        element.type = type;
    }, 
    createApple() {
        this.createStuff("apple");

    },
    isApple(nextCell) {
        return nextCell.type === "apple";
    },

    createBomb() {
        this.createStuff("bomb");
    },
    isBomb(nextCell) {
        return nextCell.type === "bomb";
    },

    createBonus() {
        this.createStuff("bonus");
    },
    isBonus(nextCell) {
        return nextCell.type === "bonus";
    },

    createFailure() {
        this.createStuff("failure");

    },
    isFailure(nextCell) {
        return nextCell.type === "failure";
    },

    createAdditBomb() {
        this.createStuff("additBomb");

    },
    isAdditBomb(nextCell) {
        return nextCell.type === "additBomb";
    },

    random(min, max) {
        return Math.floor(Math.random() * (max + 1) - min) + min;
    },

    getRandomCell() {
        let availableCells = this.fieldCells.filter( item => item.type || !this.game.snake.hasCell(item));

        let index = this.random(0, availableCells.length - 1);
        return availableCells[index];
    },

    renderBoard() {
        this.fieldCells.forEach(element => { //отрисовка доски
            this.game.ctx.drawImage(this.game.pictures.field, element.x, element.y);

            if (element.type === "bonus") {
                    this.game.ctx.drawImage(this.game.pictures[element.type], element.x, element.y, this.game.pictures.field.width, this.game.pictures.field.height);
            } else if (element.type) {
                this.game.ctx.drawImage(this.game.pictures[element.type], element.x, element.y, this.game.pictures.field.width, this.game.pictures.field.height);
            } 
            
        }); 
    },
};