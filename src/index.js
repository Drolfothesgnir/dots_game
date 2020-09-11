import Game from "./game";
import { Status } from "./constants";
import "./game.less";
import "bootstrap/js/dist/util";
import "bootstrap/js/dist/dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery/dist/jquery.slim";

const $modeSelect = $("#mode");
const $app = $("#app");
const $play = $("#play");
const $name = $("#name");
const $message = $("#message");
const $leaderBoard = $("#leader-board");

const defaultSettings = {
  easyMode: {
    field: 5,
    delay: 2000,
  },
  normalMode: {
    field: 10,
    delay: 1000,
  },
  hardMode: {
    field: 15,
    delay: 900,
  },
};
const size = "(90vh - 140px)";
let currentName = "User";
function setGame(width, delay) {
  const game = new Game(width, delay, size, size);
  game.render($app[0]);
  game.onGameOver = (winner) => {
    game.reset();
    const name = winner === Status.USER ? currentName : "Computer";
    $message.find(".text").text(`${name} won!`);
    $play.text("Play again");
    fetch("https://starnavi-frontend-test-task.herokuapp.com/winners", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ winner: name, date: Date() }),
    }).then(fillLeaderBoard);
  };
  return game;
}

function fillLeaderBoard() {
  fetch("https://starnavi-frontend-test-task.herokuapp.com/winners")
    .then((res) => res.json())
    .then((data) => {
      const $ul = $('<ul class="list"></ul>');
      data.forEach(({ winner, date }) => {
        const $li = $(
          `<li><strong>${winner}</strong><strong>${date}</strong></li>`
        );
        $ul.append($li);
      });
      $leaderBoard.html("");
      $leaderBoard.append($ul);
    });
}

fillLeaderBoard();

setInterval(fillLeaderBoard, 30000);

function resetControls() {
  $message.find(".text").text("");
}

$name.on("change", (e) => {
  currentName = e.target.value || "User";
});

let currentGame = setGame(5, 2000);

(async function () {
  let settings;
  try {
    settings = await fetch(
      "https://starnavi-frontend-test-task.herokuapp.com/game-settings"
    ).then((res) => res.json());
  } catch (e) {
    settings = defaultSettings;
  }

  const fragment = document.createDocumentFragment();
  Object.entries(settings).forEach(([label]) => {
    let text = label.split("Mode")[0];
    text = text.charAt(0).toUpperCase() + text.slice(1);

    const $option = $(
      `<div class="dropdown-item" data-value="${label}">${text}</div>`
    );
    $option[0].onclick = function (e) {
      e.preventDefault();
      const { field, delay } = settings[label];
      currentGame.destroy();
      currentGame = setGame(field, delay);
      resetControls();
    };
    fragment.appendChild($option[0]);
  });
  $modeSelect.append(fragment);

  $play.on("click", () => {
    resetControls();
    currentGame.start();
  });
})();
