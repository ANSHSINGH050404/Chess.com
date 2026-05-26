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
    // Validate the move using chess.js

    if (this.board.moves.length % 2 === 0 && player !== this.player1) {
      return; // Not player1's turn
    }
    if (this.board.moves.length % 2 === 1 && player !== this.player2) {
      return; // Not player2's turn
    }

    try {
      this.board.move(move);
    } catch (e) {
      return; // Invalid move
    }

    if (this.board.isGameOver()) {
      this.player1.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        }),
      );
      this.player2.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        }),
      );
      return;
    }

    if (this.board.moves.length % 2 === 0) {
      this.player2.emit(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    } else {
      this.player1.emit(
        JSON.stringify({
          type: MOVE,
          payload: move,
        }),
      );
    }
  }
}
