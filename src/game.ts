import BoardView from "./boardView";
import { createMovesPool, MovesPool } from "./utils";
import { Status } from "./constants";

export default class Game {
  private view: BoardView;
  private pool: MovesPool;
  private delay: number;
  private timerId: NodeJS.Timeout | null;
  private _userScore: number;
  private _computerScore: number;
  private _running: boolean;
  private _rendered: boolean;
  private _onGameOver?: (winner: number) => void;

  constructor(
    width: number,
    delay: number,
    boardWidth: string,
    boardHeight: string
  ) {
    this.view = new BoardView(width, boardWidth, boardHeight);
    this.pool = createMovesPool(width);
    this.delay = delay;
    this.timerId = null;
    this._rendered = false;
    this._running = false;
    this._userScore = 0;
    this._computerScore = 0;
    this.view.onClick = (x, y, status) => {
      if (status === Status.ACTIVE) {
        clearInterval(this.timerId!);
        this.view.setCellStatus(x, y, Status.USER);
        this._userScore++;
        this.processGameOver();
        this.makeMove();
      }
    };
  }

  start() {
    if (!this._running) {
      this._running = true;
      this.makeMove();
    }
  }

  pause() {
    this._running = false;
    clearInterval(this.timerId!);
    this.timerId = null;
  }

  reset() {
    this.pause();
    this.pool = createMovesPool(this.view.width);
    this.view.clear();
    this._computerScore = 0;
    this._userScore = 0;
  }

  makeMove() {
    let nextMove = this._running && this.pool.next();
    if (nextMove && !nextMove.done) {
      const [x, y] = nextMove.value!;
      this.view.setCellStatus(x, y, Status.ACTIVE);
      this.timerId = setTimeout(() => {
        this.view.setCellStatus(x, y, Status.COMPUTER);
        this._computerScore++;
        this.processGameOver();
        this.makeMove();
      }, this.delay);
    }
  }

  render(rootNode: HTMLElement) {
    if (!this._rendered) {
      this._rendered = true;
      rootNode.appendChild(this.view.wrapper);
    }
  }

  processGameOver() {
    const requiredPoints = Math.floor(this.view.width ** 2 / 2);
    let winner;
    if (this._userScore > requiredPoints) {
      winner = Status.USER;
    } else if (this._computerScore > requiredPoints) {
      winner = Status.COMPUTER;
    }

    if (winner) {
      this.pause();
      if (this._onGameOver) {
        this._onGameOver(winner);
      }
    }
  }

  destroy() {
    this.view.wrapper.parentElement?.removeChild(this.view.wrapper);
  }

  set onGameOver(fn: (winner: number) => void) {
    if (typeof fn === "function") {
      this._onGameOver = fn;
    }
  }

  get isRendered() {
    return this._rendered;
  }

  get isRunning() {
    return this._running;
  }

  get userScore() {
    return this._userScore;
  }

  get computerScore() {
    return this._computerScore;
  }
}
