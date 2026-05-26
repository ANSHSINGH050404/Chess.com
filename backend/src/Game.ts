import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game {
  private player1: WebSocket;
  private player2: WebSocket;
  private board: Chess;
  private moves: string[] = [];
  private startTime = Date.now();

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = Date.now();
    this.moves = [];
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      }),
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      }),
    );
  }

  makeMove(player: WebSocket, move: { from: string; to: string }) {
    const moveCount = this.board.history().length;

    if (moveCount % 2 === 0 && player !== this.player1) {
      return;
    }
    if (moveCount % 2 === 1 && player !== this.player2) {
      return;
    }

    try {
      this.board.move(move);
    } catch (e) {
      return;
    }

    if (this.board.isGameOver()) {
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        }),
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        }),
      );
      return;
    }

    const newMoveCount = this.board.history().length;
    if (newMoveCount % 2 === 1) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    }
  }
}
