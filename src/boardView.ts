import { CLASSNAMES, Status } from "./constants";

export default class BoardView {
  private _wrapper: HTMLElement;
  readonly width: number;
  private filled: [number, number][];
  private clickHandler: (e: Event) => void;
  private _onClick?: (
    x: number,
    y: number,
    status: number,
    event: Event
  ) => void;

  constructor(width: number, boardWidth: string, boardHeight: string) {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    for (let y = 0; y < width; y++) {
      const row = document.createElement("ul");
      row.className = "list";
      for (let x = 0; x < width; x++) {
        const col = document.createElement("li");
        col.dataset.x = x.toString();
        col.dataset.y = y.toString();
        col.dataset.status = Status.DEFAULT.toString();
        col.style.width = `calc(${boardWidth} / ${width})`;
        col.style.height = `calc(${boardHeight} / ${width})`;
        col.className = CLASSNAMES[Status.DEFAULT];
        row.appendChild(col);
      }
      wrapper.appendChild(row);
    }
    this._wrapper = wrapper;
    this.width = width;
    this.filled = [];
    const self = this;
    this.clickHandler = function (e: Event) {
      const target = e.target as HTMLElement;
      if ((target as HTMLElement).dataset.status) {
        const { x, y, status } = target.dataset;
        if (self._onClick) {
          self._onClick.call(self._wrapper, +x!, +y!, +status!, e);
        }
      }
    };
    wrapper.addEventListener("click", this.clickHandler);
  }

  setCellStatus(x: number, y: number, status: Status) {
    if (x > -1 && x < this.width && y > -1 && y < this.width) {
      const className = CLASSNAMES[status];
      if (className) {
        const cell = this._wrapper.children[y].children[x] as HTMLElement;
        cell.classList.replace(
          CLASSNAMES[+cell.dataset.status!],
          CLASSNAMES[status]
        );
        cell.dataset.status = status.toString();
        if (status !== Status.DEFAULT) {
          this.filled.push([x, y]);
        }
      }
    }
  }

  clear() {
    for (let i = 0; i < this.filled.length; i++) {
      const [x, y] = this.filled[i];
      this.setCellStatus(x, y, Status.DEFAULT);
    }
    this.filled = [];
  }

  set onClick(
    fn: (x: number, y: number, status: number, event: Event) => void
  ) {
    if (typeof fn === "function") {
      this._onClick = fn;
    }
  }

  get wrapper() {
    return this._wrapper;
  }
}
