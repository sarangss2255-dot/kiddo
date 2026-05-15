export type ChessColor = 'white' | 'black';
export type ChessPieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export interface ChessPiece {
  id: string;
  type: ChessPieceType;
  color: ChessColor;
}

export type ChessBoard = (ChessPiece | null)[][];

export interface ChessPosition {
  row: number;
  col: number;
}

export interface ChessMove {
  from: ChessPosition;
  to: ChessPosition;
}

const backRank: ChessPieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

export const createInitialBoard = (): ChessBoard => {
  const board: ChessBoard = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));

  backRank.forEach((type, col) => {
    board[0][col] = { id: `b-${type}-${col}`, type, color: 'black' };
    board[1][col] = { id: `b-pawn-${col}`, type: 'pawn', color: 'black' };
    board[6][col] = { id: `w-pawn-${col}`, type: 'pawn', color: 'white' };
    board[7][col] = { id: `w-${type}-${col}`, type, color: 'white' };
  });

  return board;
};

export const isInsideBoard = (row: number, col: number) => row >= 0 && row < 8 && col >= 0 && col < 8;

export const cloneBoard = (board: ChessBoard): ChessBoard => board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));

const addSlidingMoves = (
  board: ChessBoard,
  piece: ChessPiece,
  from: ChessPosition,
  deltas: Array<[number, number]>,
): ChessPosition[] => {
  const moves: ChessPosition[] = [];

  deltas.forEach(([rowDelta, colDelta]) => {
    let nextRow = from.row + rowDelta;
    let nextCol = from.col + colDelta;

    while (isInsideBoard(nextRow, nextCol)) {
      const target = board[nextRow][nextCol];
      if (!target) {
        moves.push({ row: nextRow, col: nextCol });
      } else {
        if (target.color !== piece.color) {
          moves.push({ row: nextRow, col: nextCol });
        }
        break;
      }

      nextRow += rowDelta;
      nextCol += colDelta;
    }
  });

  return moves;
};

export const getLegalMoves = (board: ChessBoard, from: ChessPosition): ChessPosition[] => {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  if (piece.type === 'pawn') {
    const moves: ChessPosition[] = [];
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;
    const oneStepRow = from.row + direction;

    if (isInsideBoard(oneStepRow, from.col) && !board[oneStepRow][from.col]) {
      moves.push({ row: oneStepRow, col: from.col });

      const twoStepRow = from.row + direction * 2;
      if (from.row === startRow && !board[twoStepRow][from.col]) {
        moves.push({ row: twoStepRow, col: from.col });
      }
    }

    [-1, 1].forEach((colDelta) => {
      const nextCol = from.col + colDelta;
      if (!isInsideBoard(oneStepRow, nextCol)) return;
      const target = board[oneStepRow][nextCol];
      if (target && target.color !== piece.color) {
        moves.push({ row: oneStepRow, col: nextCol });
      }
    });

    return moves;
  }

  if (piece.type === 'rook') {
    return addSlidingMoves(board, piece, from, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
  }

  if (piece.type === 'bishop') {
    return addSlidingMoves(board, piece, from, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  }

  if (piece.type === 'queen') {
    return addSlidingMoves(board, piece, from, [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1],
    ]);
  }

  if (piece.type === 'knight') {
    return [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2],
    ]
      .map(([rowDelta, colDelta]) => ({ row: from.row + rowDelta, col: from.col + colDelta }))
      .filter(({ row, col }) => isInsideBoard(row, col))
      .filter(({ row, col }) => {
        const target = board[row][col];
        return !target || target.color !== piece.color;
      });
  }

  return [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ]
    .map(([rowDelta, colDelta]) => ({ row: from.row + rowDelta, col: from.col + colDelta }))
    .filter(({ row, col }) => isInsideBoard(row, col))
    .filter(({ row, col }) => {
      const target = board[row][col];
      return !target || target.color !== piece.color;
    });
};

export const applyMove = (board: ChessBoard, move: ChessMove) => {
  const nextBoard = cloneBoard(board);
  const movingPiece = nextBoard[move.from.row][move.from.col];
  const capturedPiece = nextBoard[move.to.row][move.to.col];

  if (!movingPiece) {
    return { board: nextBoard, capturedPiece: null };
  }

  nextBoard[move.to.row][move.to.col] = movingPiece;
  nextBoard[move.from.row][move.from.col] = null;

  if (movingPiece.type === 'pawn' && (move.to.row === 0 || move.to.row === 7)) {
    nextBoard[move.to.row][move.to.col] = { ...movingPiece, type: 'queen' };
  }

  return { board: nextBoard, capturedPiece };
};

export const listAllMoves = (board: ChessBoard, color: ChessColor): ChessMove[] => {
  const moves: ChessMove[] = [];

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.color !== color) continue;
      const legalMoves = getLegalMoves(board, { row, col });
      legalMoves.forEach((to) => moves.push({ from: { row, col }, to }));
    }
  }

  return moves;
};

export const pickBotMove = (board: ChessBoard): ChessMove | null => {
  const moves = listAllMoves(board, 'black');
  if (moves.length === 0) return null;

  const captureKingMove = moves.find((move) => board[move.to.row][move.to.col]?.type === 'king');
  if (captureKingMove) return captureKingMove;

  const captureMoves = moves.filter((move) => board[move.to.row][move.to.col]);
  const source = captureMoves.length > 0 ? captureMoves : moves;
  return source[Math.floor(Math.random() * source.length)];
};

export const hasKing = (board: ChessBoard, color: ChessColor) =>
  board.some((row) => row.some((piece) => piece?.type === 'king' && piece.color === color));

export const countPlayerMoves = (board: ChessBoard, color: ChessColor) => listAllMoves(board, color).length;
