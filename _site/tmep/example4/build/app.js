(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright (c) 2021, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

var Chess = function(fen) {
    var BLACK = 'b'
    var WHITE = 'w'
  
    var EMPTY = -1
  
    var PAWN = 'p'
    var KNIGHT = 'n'
    var BISHOP = 'b'
    var ROOK = 'r'
    var QUEEN = 'q'
    var KING = 'k'
  
    var SYMBOLS = 'pnbrqkPNBRQK'
  
    var DEFAULT_POSITION =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  
    var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*']
  
    var PAWN_OFFSETS = {
      b: [16, 32, 17, 15],
      w: [-16, -32, -17, -15]
    }
  
    var PIECE_OFFSETS = {
      n: [-18, -33, -31, -14, 18, 33, 31, 14],
      b: [-17, -15, 17, 15],
      r: [-16, 1, 16, -1],
      q: [-17, -16, -15, 1, 17, 16, 15, -1],
      k: [-17, -16, -15, 1, 17, 16, 15, -1]
    }
  
    // prettier-ignore
    var ATTACKS = [
      20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
       0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
       0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
       0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
       0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
      24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
       0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
       0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
       0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
       0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
      20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
    ];
  
    // prettier-ignore
    var RAYS = [
       17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
        0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
        0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
        0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
        0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
        1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
        0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
        0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
        0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
        0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
        0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
      -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
    ];
  
    var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }
  
    var FLAGS = {
      NORMAL: 'n',
      CAPTURE: 'c',
      BIG_PAWN: 'b',
      EP_CAPTURE: 'e',
      PROMOTION: 'p',
      KSIDE_CASTLE: 'k',
      QSIDE_CASTLE: 'q'
    }
  
    var BITS = {
      NORMAL: 1,
      CAPTURE: 2,
      BIG_PAWN: 4,
      EP_CAPTURE: 8,
      PROMOTION: 16,
      KSIDE_CASTLE: 32,
      QSIDE_CASTLE: 64
    }
  
    var RANK_1 = 7
    var RANK_2 = 6
    var RANK_3 = 5
    var RANK_4 = 4
    var RANK_5 = 3
    var RANK_6 = 2
    var RANK_7 = 1
    var RANK_8 = 0
  
    // prettier-ignore
    var SQUARES = {
      a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
      a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
      a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
      a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
      a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
      a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
      a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
      a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    };
  
    var ROOKS = {
      w: [
        { square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
        { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }
      ],
      b: [
        { square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
        { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }
      ]
    }
  
    var board = new Array(128)
    var kings = { w: EMPTY, b: EMPTY }
    var turn = WHITE
    var castling = { w: 0, b: 0 }
    var ep_square = EMPTY
    var half_moves = 0
    var move_number = 1
    var history = []
    var header = {}
    var comments = {}
  
    /* if the user passes in a fen string, load it, else default to
     * starting position
     */
    if (typeof fen === 'undefined') {
      load(DEFAULT_POSITION)
    } else {
      load(fen)
    }
  
    function clear(keep_headers) {
      if (typeof keep_headers === 'undefined') {
        keep_headers = false
      }
  
      board = new Array(128)
      kings = { w: EMPTY, b: EMPTY }
      turn = WHITE
      castling = { w: 0, b: 0 }
      ep_square = EMPTY
      half_moves = 0
      move_number = 1
      history = []
      if (!keep_headers) header = {}
      comments = {}
      update_setup(generate_fen())
    }
  
    function prune_comments() {
      var reversed_history = [];
      var current_comments = {};
      var copy_comment = function(fen) {
        if (fen in comments) {
          current_comments[fen] = comments[fen];
        }
      };
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }
      copy_comment(generate_fen());
      while (reversed_history.length > 0) {
        make_move(reversed_history.pop());
        copy_comment(generate_fen());
      }
      comments = current_comments;
    }
  
    function reset() {
      load(DEFAULT_POSITION)
    }
  
    function load(fen, keep_headers) {
      if (typeof keep_headers === 'undefined') {
        keep_headers = false
      }
  
      var tokens = fen.split(/\s+/)
      var position = tokens[0]
      var square = 0
  
      if (!validate_fen(fen).valid) {
        return false
      }
  
      clear(keep_headers)
  
      for (var i = 0; i < position.length; i++) {
        var piece = position.charAt(i)
  
        if (piece === '/') {
          square += 8
        } else if (is_digit(piece)) {
          square += parseInt(piece, 10)
        } else {
          var color = piece < 'a' ? WHITE : BLACK
          put({ type: piece.toLowerCase(), color: color }, algebraic(square))
          square++
        }
      }
  
      turn = tokens[1]
  
      if (tokens[2].indexOf('K') > -1) {
        castling.w |= BITS.KSIDE_CASTLE
      }
      if (tokens[2].indexOf('Q') > -1) {
        castling.w |= BITS.QSIDE_CASTLE
      }
      if (tokens[2].indexOf('k') > -1) {
        castling.b |= BITS.KSIDE_CASTLE
      }
      if (tokens[2].indexOf('q') > -1) {
        castling.b |= BITS.QSIDE_CASTLE
      }
  
      ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]]
      half_moves = parseInt(tokens[4], 10)
      move_number = parseInt(tokens[5], 10)
  
      update_setup(generate_fen())
  
      return true
    }
  
    /* TODO: this function is pretty much crap - it validates structure but
     * completely ignores content (e.g. doesn't verify that each side has a king)
     * ... we should rewrite this, and ditch the silly error_number field while
     * we're at it
     */
    function validate_fen(fen) {
      var errors = {
        0: 'No errors.',
        1: 'FEN string must contain six space-delimited fields.',
        2: '6th field (move number) must be a positive integer.',
        3: '5th field (half move counter) must be a non-negative integer.',
        4: '4th field (en-passant square) is invalid.',
        5: '3rd field (castling availability) is invalid.',
        6: '2nd field (side to move) is invalid.',
        7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
        8: '1st field (piece positions) is invalid [consecutive numbers].',
        9: '1st field (piece positions) is invalid [invalid piece].',
        10: '1st field (piece positions) is invalid [row too large].',
        11: 'Illegal en-passant square'
      }
  
      /* 1st criterion: 6 space-seperated fields? */
      var tokens = fen.split(/\s+/)
      if (tokens.length !== 6) {
        return { valid: false, error_number: 1, error: errors[1] }
      }
  
      /* 2nd criterion: move number field is a integer value > 0? */
      if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
        return { valid: false, error_number: 2, error: errors[2] }
      }
  
      /* 3rd criterion: half move counter is an integer >= 0? */
      if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
        return { valid: false, error_number: 3, error: errors[3] }
      }
  
      /* 4th criterion: 4th field is a valid e.p.-string? */
      if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return { valid: false, error_number: 4, error: errors[4] }
      }
  
      /* 5th criterion: 3th field is a valid castle-string? */
      if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
        return { valid: false, error_number: 5, error: errors[5] }
      }
  
      /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
      if (!/^(w|b)$/.test(tokens[1])) {
        return { valid: false, error_number: 6, error: errors[6] }
      }
  
      /* 7th criterion: 1st field contains 8 rows? */
      var rows = tokens[0].split('/')
      if (rows.length !== 8) {
        return { valid: false, error_number: 7, error: errors[7] }
      }
  
      /* 8th criterion: every row is valid? */
      for (var i = 0; i < rows.length; i++) {
        /* check for right sum of fields AND not two numbers in succession */
        var sum_fields = 0
        var previous_was_number = false
  
        for (var k = 0; k < rows[i].length; k++) {
          if (!isNaN(rows[i][k])) {
            if (previous_was_number) {
              return { valid: false, error_number: 8, error: errors[8] }
            }
            sum_fields += parseInt(rows[i][k], 10)
            previous_was_number = true
          } else {
            if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
              return { valid: false, error_number: 9, error: errors[9] }
            }
            sum_fields += 1
            previous_was_number = false
          }
        }
        if (sum_fields !== 8) {
          return { valid: false, error_number: 10, error: errors[10] }
        }
      }
  
      if (
        (tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')
      ) {
        return { valid: false, error_number: 11, error: errors[11] }
      }
  
      /* everything's okay! */
      return { valid: true, error_number: 0, error: errors[0] }
    }
  
    function generate_fen() {
      var empty = 0
      var fen = ''
  
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (board[i] == null) {
          empty++
        } else {
          if (empty > 0) {
            fen += empty
            empty = 0
          }
          var color = board[i].color
          var piece = board[i].type
  
          fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
        }
  
        if ((i + 1) & 0x88) {
          if (empty > 0) {
            fen += empty
          }
  
          if (i !== SQUARES.h1) {
            fen += '/'
          }
  
          empty = 0
          i += 8
        }
      }
  
      var cflags = ''
      if (castling[WHITE] & BITS.KSIDE_CASTLE) {
        cflags += 'K'
      }
      if (castling[WHITE] & BITS.QSIDE_CASTLE) {
        cflags += 'Q'
      }
      if (castling[BLACK] & BITS.KSIDE_CASTLE) {
        cflags += 'k'
      }
      if (castling[BLACK] & BITS.QSIDE_CASTLE) {
        cflags += 'q'
      }
  
      /* do we have an empty castling flag? */
      cflags = cflags || '-'
      var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square)
  
      return [fen, turn, cflags, epflags, half_moves, move_number].join(' ')
    }
  
    function set_header(args) {
      for (var i = 0; i < args.length; i += 2) {
        if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
          header[args[i]] = args[i + 1]
        }
      }
      return header
    }
  
    /* called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object.  if the FEN is
     * equal to the default position, the SetUp and FEN are deleted
     * the setup is only updated if history.length is zero, ie moves haven't been
     * made.
     */
    function update_setup(fen) {
      if (history.length > 0) return
  
      if (fen !== DEFAULT_POSITION) {
        header['SetUp'] = '1'
        header['FEN'] = fen
      } else {
        delete header['SetUp']
        delete header['FEN']
      }
    }
  
    function get(square) {
      var piece = board[SQUARES[square]]
      return piece ? { type: piece.type, color: piece.color } : null
    }
  
    function put(piece, square) {
      /* check for valid piece object */
      if (!('type' in piece && 'color' in piece)) {
        return false
      }
  
      /* check for piece */
      if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
        return false
      }
  
      /* check for valid square */
      if (!(square in SQUARES)) {
        return false
      }
  
      var sq = SQUARES[square]
  
      /* don't let the user place more than one king */
      if (
        piece.type == KING &&
        !(kings[piece.color] == EMPTY || kings[piece.color] == sq)
      ) {
        return false
      }
  
      board[sq] = { type: piece.type, color: piece.color }
      if (piece.type === KING) {
        kings[piece.color] = sq
      }
  
      update_setup(generate_fen())
  
      return true
    }
  
    function remove(square) {
      var piece = get(square)
      board[SQUARES[square]] = null
      if (piece && piece.type === KING) {
        kings[piece.color] = EMPTY
      }
  
      update_setup(generate_fen())
  
      return piece
    }
  
    function build_move(board, from, to, flags, promotion) {
      var move = {
        color: turn,
        from: from,
        to: to,
        flags: flags,
        piece: board[from].type
      }
  
      if (promotion) {
        move.flags |= BITS.PROMOTION
        move.promotion = promotion
      }
  
      /* atomic: explosion on capture */
      var captures_on;
      if (board[to] && from !== to) {
        move.captured = board[to].type;
        captures_on = move.to;
      } else if (flags & BITS.EP_CAPTURE) {
        captures_on = turn === BLACK ? move.to - 16 : move.to + 16;
        if (board[captures_on]) {
          move.captured = PAWN;
        }
      }
      if (move.captured) {
        // explode capturer
        move.explosion = [{
          square: move.to,
          color: board[captures_on].color,
          type: board[captures_on].type
        }];
        // explode around capture
        PIECE_OFFSETS.k.forEach(offset => {
          let sq = move.to + offset
          if (board[sq] && board[sq].type !== PAWN) {
            move.explosion.push({
              square: sq,
              color: board[sq].color,
              type: board[sq].type
            });
          }
        })
        if (flags & BITS.EP_CAPTURE) {
          // explode passed pawn
          move.explosion.push({
            square: captures_on,
            color: swap_color(move.color),
            type: PAWN
          });
        }
      }
      return move
    }
  
    function generate_moves(options) {
      function add_move(board, moves, from, to, flags) {
        /* if pawn promotion */
        if (
          board[from].type === PAWN &&
          (rank(to) === RANK_8 || rank(to) === RANK_1)
        ) {
          var pieces = [QUEEN, ROOK, BISHOP, KNIGHT]
          for (var i = 0, len = pieces.length; i < len; i++) {
            moves.push(build_move(board, from, to, flags, pieces[i]))
          }
        } else {
          moves.push(build_move(board, from, to, flags))
        }
      }
  
      var moves = []
      var us = turn
      
      /* atomic */
      if (!board[kings[us]]) return [];

      var them = swap_color(us)
      var second_rank = { b: RANK_7, w: RANK_2 }
  
      var first_sq = SQUARES.a8
      var last_sq = SQUARES.h1
      var single_square = false
  
      /* do we want legal moves? */
      /* atomic: no, we don't */
      // var legal =
      //   typeof options !== 'undefined' && 'legal' in options
      //     ? options.legal
      //     : true
  
      /* are we generating moves for a single square? */
      if (typeof options !== 'undefined' && 'square' in options) {
        if (options.square in SQUARES) {
          first_sq = last_sq = SQUARES[options.square]
          single_square = true
        } else {
          /* invalid square */
          return []
        }
      }
  
      for (var i = first_sq; i <= last_sq; i++) {
        /* did we run off the end of the board */
        if (i & 0x88) {
          i += 7
          continue
        }
  
        var piece = board[i]
        if (piece == null || piece.color !== us) {
          continue
        }
  
        if (piece.type === PAWN) {
          /* single square, non-capturing */
          var square = i + PAWN_OFFSETS[us][0]
          if (board[square] == null) {
            add_move(board, moves, i, square, BITS.NORMAL)
  
            /* double square */
            var square = i + PAWN_OFFSETS[us][1]
            if (second_rank[us] === rank(i) && board[square] == null) {
              add_move(board, moves, i, square, BITS.BIG_PAWN)
            }
          }
  
          /* pawn captures */
          for (j = 2; j < 4; j++) {
            var square = i + PAWN_OFFSETS[us][j]
            if (square & 0x88) continue
  
            if (board[square] != null && board[square].color === them) {
              add_move(board, moves, i, square, BITS.CAPTURE)
            } else if (square === ep_square) {
              add_move(board, moves, i, ep_square, BITS.EP_CAPTURE)
            }
          }
        } else {
          for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
            var offset = PIECE_OFFSETS[piece.type][j]
            var square = i
  
            while (true) {
              square += offset
              if (square & 0x88) break
  
              if (board[square] == null) {
                add_move(board, moves, i, square, BITS.NORMAL)
              } else {
                if (board[square].color === us) break
                add_move(board, moves, i, square, BITS.CAPTURE)
                break
              }
  
              /* break, if knight or king */
              if (piece.type === 'n' || piece.type === 'k') break
            }
          }
        }
      }
  
      /* check for castling if: a) we're generating all moves, or b) we're doing
       * single square move generation on the king's square
       */
      if (!single_square || last_sq === kings[us]) {
        /* king-side castling */
        if (castling[us] & BITS.KSIDE_CASTLE) {
          var castling_from = kings[us]
          var castling_to = castling_from + 2
  
          if (
            board[castling_from + 1] == null &&
            board[castling_to] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from + 1) &&
            !attacked(them, castling_to)
          ) {
            add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE)
          }
        }
  
        /* queen-side castling */
        if (castling[us] & BITS.QSIDE_CASTLE) {
          var castling_from = kings[us]
          var castling_to = castling_from - 2
  
          if (
            board[castling_from - 1] == null &&
            board[castling_from - 2] == null &&
            board[castling_from - 3] == null &&
            !attacked(them, kings[us]) &&
            !attacked(them, castling_from - 1) &&
            !attacked(them, castling_to)
          ) {
            add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE)
          }
        }
      }
  
      /* return all pseudo-legal moves (this includes moves that allow the king
       * to be captured)
       */
      // if (!legal) {
      //   return moves
      // }
  
      /* filter out illegal moves */
      var legal_moves = [];
      for (var i = 0, len = moves.length; i < len; i++) {
        make_move(moves[i]);
        if (board[kings[us]] && (!king_attacked(us) || !board[kings[swap_color(us)]])) { /* atomic */
          legal_moves.push(moves[i]);
        }
        undo_move();
      }
      return legal_moves
    }
  
    /* convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} sloppy Use the sloppy SAN generator to work around over
     * disambiguation bugs in Fritz and Chessbase.  See below:
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    function move_to_san(move, sloppy) {
      var output = ''
  
      if (move.flags & BITS.KSIDE_CASTLE) {
        output = 'O-O'
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        output = 'O-O-O'
      } else {
        var disambiguator = get_disambiguator(move, sloppy)
  
        if (move.piece !== PAWN) {
          output += move.piece.toUpperCase() + disambiguator
        }
  
        if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
          if (move.piece === PAWN) {
            output += algebraic(move.from)[0]
          }
          output += 'x'
        }
  
        output += algebraic(move.to)
  
        if (move.flags & BITS.PROMOTION) {
          output += '=' + move.promotion.toUpperCase()
        }
      }
  
      make_move(move)
      if (in_check()) {
        if (in_checkmate()) {
          output += '#'
        } else {
          output += '+'
        }
      }
      undo_move()
  
      return output
    }
  
    // parses all of the decorators out of a SAN string
    function stripped_san(move) {
      return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
    }
  
    function attacked(color, square) {
      /* atomic: return false for king next to other king */
      if (board[square] && board[square].type == 'k') {
        var adjacentSquares = [square-1,square-15,square-16,square-17,square+1,square+15,square+16,square+17]
        for (var i=0; i<adjacentSquares.length; i++) {
          if (square & 0x88) continue;
          if (board[adjacentSquares[i]] && board[adjacentSquares[i]].type == 'k') {
            return false;
          }
        }
      }
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        /* did we run off the end of the board */
        if (i & 0x88) {
          i += 7
          continue
        }
  
        /* if empty square or wrong color */
        if (board[i] == null || board[i].color !== color) continue
  
        var piece = board[i]
        var difference = i - square
        var index = difference + 119
  
        if (ATTACKS[index] & (1 << SHIFTS[piece.type])) {
          if (piece.type === PAWN) {
            if (difference > 0) {
              if (piece.color === WHITE) return true
            } else {
              if (piece.color === BLACK) return true
            }
            continue
          }
          if (piece.type === 'n') return true
          if (piece.type === 'k') return false /* atomic:  */
  
          var offset = RAYS[index]
          var j = i + offset
  
          var blocked = false
          while (j !== square) {
            if (board[j] != null) {
              blocked = true
              break
            }
            j += offset
          }
  
          if (!blocked) return true
        }
      }
  
      return false
    }
  
    function king_attacked(color) {
      return attacked(swap_color(color), kings[color])
    }
  
    function in_check() {
      return king_attacked(turn)
    }
  
    function in_checkmate() {
      return in_check() && generate_moves().length === 0 || !board[kings[turn]]; /* atomic */
    }
  
    function in_stalemate() {
      return !in_check() && generate_moves().length === 0
    }
  
    function insufficient_material() {
      var pieces = {}
      var bishops = []
      var num_pieces = 0
      var sq_color = 0
  
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        sq_color = (sq_color + 1) % 2
        if (i & 0x88) {
          i += 7
          continue
        }
  
        var piece = board[i]
        if (piece) {
          pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1
          if (piece.type === BISHOP) {
            bishops.push(sq_color)
          }
          num_pieces++
        }
      }
  
      /* k vs. k */
      if (num_pieces === 2) {
        return true
      } else if (
        /* k vs. kn .... or .... k vs. kb */
        num_pieces === 3 &&
        (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
      ) {
        return true
      } else if (num_pieces === pieces[BISHOP] + 2) {
        /* kb vs. kb where any number of bishops are all on the same color */
        var sum = 0
        var len = bishops.length
        for (var i = 0; i < len; i++) {
          sum += bishops[i]
        }
        if (sum === 0 || sum === len) {
          return true
        }
      }
  
      return false
    }
  
    function in_threefold_repetition() {
      /* TODO: while this function is fine for casual use, a better
       * implementation would use a Zobrist key (instead of FEN). the
       * Zobrist key would be maintained in the make_move/undo_move functions,
       * avoiding the costly that we do below.
       */
      var moves = []
      var positions = {}
      var repetition = false
  
      while (true) {
        var move = undo_move()
        if (!move) break
        moves.push(move)
      }
  
      while (true) {
        /* remove the last two fields in the FEN string, they're not needed
         * when checking for draw by rep */
        var fen = generate_fen()
          .split(' ')
          .slice(0, 4)
          .join(' ')
  
        /* has the position occurred three or move times */
        positions[fen] = fen in positions ? positions[fen] + 1 : 1
        if (positions[fen] >= 3) {
          repetition = true
        }
  
        if (!moves.length) {
          break
        }
        make_move(moves.pop())
      }
  
      return repetition
    }
  
    function push(move) {
      history.push({
        move: move,
        kings: { b: kings.b, w: kings.w },
        turn: turn,
        castling: { b: castling.b, w: castling.w },
        ep_square: ep_square,
        half_moves: half_moves,
        move_number: move_number
      })
    }
  
    function make_move(move) {
      var us = turn
      var them = swap_color(us)
      push(move)
  
      board[move.to] = board[move.from]
      board[move.from] = null
  
      /* if ep capture, remove the captured pawn */
      if (move.flags & BITS.EP_CAPTURE) {
        if (turn === BLACK) {
          board[move.to - 16] = null
        } else {
          board[move.to + 16] = null
        }
      }
      
      /* atomic: remove exploded pieces */
      if (move.explosion) {
        move.explosion.forEach(function(kaboom) {
          if (castling[them]) {
            for (var i = 0, len = ROOKS[them].length; i < len; i++) {
              if (kaboom.square === ROOKS[them][i].square &&
                  castling[them] & ROOKS[them][i].flag) {
                castling[them] ^= ROOKS[them][i].flag;
                break;
              }
            }
          }
          board[kaboom.square] = null;
        });
      }
      else {
        /* if pawn promotion, replace with new piece */
        if (move.flags & BITS.PROMOTION) {
          board[move.to] = { type: move.promotion, color: us }
        }
    
        /* if we moved the king */
        if (board[move.to].type === KING) {
          kings[board[move.to].color] = move.to
    
          /* if we castled, move the rook next to the king */
          if (move.flags & BITS.KSIDE_CASTLE) {
            var castling_to = move.to - 1
            var castling_from = move.to + 1
            board[castling_to] = board[castling_from]
            board[castling_from] = null
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            var castling_to = move.to + 1
            var castling_from = move.to - 2
            board[castling_to] = board[castling_from]
            board[castling_from] = null
          }
    
          /* turn off castling */
          castling[us] = ''
        }
      }
  
      /* turn off castling if we move a rook */
      if (castling[us]) {
        for (var i = 0, len = ROOKS[us].length; i < len; i++) {
          if (
            move.from === ROOKS[us][i].square &&
            castling[us] & ROOKS[us][i].flag
          ) {
            castling[us] ^= ROOKS[us][i].flag
            break
          }
        }
      }
  
      /* turn off castling if we capture a rook */
      if (castling[them]) {
        for (var i = 0, len = ROOKS[them].length; i < len; i++) {
          if (
            move.to === ROOKS[them][i].square &&
            castling[them] & ROOKS[them][i].flag
          ) {
            castling[them] ^= ROOKS[them][i].flag
            break
          }
        }
      }
  
      /* if big pawn move, update the en passant square */
      if (move.flags & BITS.BIG_PAWN) {
        if (turn === 'b') {
          ep_square = move.to - 16
        } else {
          ep_square = move.to + 16
        }
      } else {
        ep_square = EMPTY
      }
  
      /* reset the 50 move counter if a pawn is moved or a piece is captured */
      if (move.piece === PAWN) {
        half_moves = 0
      } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        half_moves = 0
      } else {
        half_moves++
      }
  
      if (turn === BLACK) {
        move_number++
      }
      turn = swap_color(turn)
    }
  
    function undo_move() {
      var old = history.pop()
      if (old == null) {
        return null
      }
  
      var move = old.move
      kings = old.kings
      turn = old.turn
      castling = old.castling
      ep_square = old.ep_square
      half_moves = old.half_moves
      move_number = old.move_number
  
      var us = turn
      var them = swap_color(turn)

      /* atomic: replace indirectly exploded pieces (exploded pieces other than the captured piece) */
      if (move.explosion) {
        move.explosion.forEach(function(kaboom) {
          if (!(move.flags & BITS.EP_CAPTURE) || move.to != kaboom.square) {
            board[kaboom.square] = {type: kaboom.type, color: kaboom.color};
          }
        });
        board[move.from] = {type: move.piece, color: move.color};
      }
      else {

        board[move.from] = board[move.to]
        board[move.from].type = move.piece // to undo any promotions
        board[move.to] = null
    
        if (move.flags & BITS.CAPTURE) {
          board[move.to] = { type: move.captured, color: them }
        } else if (move.flags & BITS.EP_CAPTURE) {
          var index
          if (us === BLACK) {
            index = move.to - 16
          } else {
            index = move.to + 16
          }
          board[index] = { type: PAWN, color: them }
        }
    
        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
          var castling_to, castling_from
          if (move.flags & BITS.KSIDE_CASTLE) {
            castling_to = move.to + 1
            castling_from = move.to - 1
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            castling_to = move.to - 2
            castling_from = move.to + 1
          }
    
          board[castling_to] = board[castling_from]
          board[castling_from] = null
        }
      }
  
      return move
    }
  
    /* this function is used to uniquely identify ambiguous moves */
    function get_disambiguator(move, sloppy) {
      var moves = generate_moves({ legal: !sloppy })
  
      var from = move.from
      var to = move.to
      var piece = move.piece
  
      var ambiguities = 0
      var same_rank = 0
      var same_file = 0
  
      for (var i = 0, len = moves.length; i < len; i++) {
        var ambig_from = moves[i].from
        var ambig_to = moves[i].to
        var ambig_piece = moves[i].piece
  
        /* if a move of the same piece type ends on the same to square, we'll
         * need to add a disambiguator to the algebraic notation
         */
        if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
          ambiguities++
  
          if (rank(from) === rank(ambig_from)) {
            same_rank++
          }
  
          if (file(from) === file(ambig_from)) {
            same_file++
          }
        }
      }
  
      if (ambiguities > 0) {
        /* if there exists a similar moving piece on the same rank and file as
         * the move in question, use the square as the disambiguator
         */
        if (same_rank > 0 && same_file > 0) {
          return algebraic(from)
        } else if (same_file > 0) {
          /* if the moving piece rests on the same file, use the rank symbol as the
           * disambiguator
           */
          return algebraic(from).charAt(1)
        } else {
          /* else use the file symbol */
          return algebraic(from).charAt(0)
        }
      }
  
      return ''
    }
  
    function ascii() {
      var s = '   +------------------------+\n'
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        /* display the rank */
        if (file(i) === 0) {
          s += ' ' + '87654321'[rank(i)] + ' |'
        }
  
        /* empty piece */
        if (board[i] == null) {
          s += ' . '
        } else {
          var piece = board[i].type
          var color = board[i].color
          var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
          s += ' ' + symbol + ' '
        }
  
        if ((i + 1) & 0x88) {
          s += '|\n'
          i += 8
        }
      }
      s += '   +------------------------+\n'
      s += '     a  b  c  d  e  f  g  h\n'
  
      return s
    }
  
    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    function move_from_san(move, sloppy) {
      // strip off any move decorations: e.g Nf3+?!
      var clean_move = stripped_san(move)
  
      // if we're using the sloppy parser run a regex to grab piece, to, and from
      // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
      if (sloppy) {
        var matches = clean_move.match(
          /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
        )
        if (matches) {
          var piece = matches[1]
          var from = matches[2]
          var to = matches[3]
          var promotion = matches[4]
        }
      }
  
      var moves = generate_moves()
      for (var i = 0, len = moves.length; i < len; i++) {
        // try the strict parser first, then the sloppy parser if requested
        // by the user
        if (
          clean_move === stripped_san(move_to_san(moves[i])) ||
          (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))
        ) {
          return moves[i]
        } else {
          if (
            matches &&
            (!piece || piece.toLowerCase() == moves[i].piece) &&
            SQUARES[from] == moves[i].from &&
            SQUARES[to] == moves[i].to &&
            (!promotion || promotion.toLowerCase() == moves[i].promotion)
          ) {
            return moves[i]
          }
        }
      }
  
      return null
    }
  
    /*****************************************************************************
     * UTILITY FUNCTIONS
     ****************************************************************************/
    function rank(i) {
      return i >> 4
    }
  
    function file(i) {
      return i & 15
    }
  
    function algebraic(i) {
      var f = file(i),
        r = rank(i)
      return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
    }
  
    function swap_color(c) {
      return c === WHITE ? BLACK : WHITE
    }
  
    function is_digit(c) {
      return '0123456789'.indexOf(c) !== -1
    }
  
    /* pretty = external move object */
    function make_pretty(ugly_move) {
      var move = clone(ugly_move)
      move.san = move_to_san(move, false)
      move.to = algebraic(move.to)
      move.from = algebraic(move.from)
  
      var flags = ''
  
      for (var flag in BITS) {
        if (BITS[flag] & move.flags) {
          flags += FLAGS[flag]
        }
      }
      move.flags = flags
  
      return move
    }
  
    function clone(obj) {
      var dupe = obj instanceof Array ? [] : {}
  
      for (var property in obj) {
        if (typeof property === 'object') {
          dupe[property] = clone(obj[property])
        } else {
          dupe[property] = obj[property]
        }
      }
  
      return dupe
    }
  
    function trim(str) {
      return str.replace(/^\s+|\s+$/g, '')
    }
  
    /*****************************************************************************
     * DEBUGGING UTILITIES
     ****************************************************************************/
    function perft(depth) {
      var moves = generate_moves({ legal: false })
      var nodes = 0
      var color = turn
  
      for (var i = 0, len = moves.length; i < len; i++) {
        make_move(moves[i])
        if (!king_attacked(color)) {
          if (depth - 1 > 0) {
            var child_nodes = perft(depth - 1)
            nodes += child_nodes
          } else {
            nodes++
          }
        }
        undo_move()
      }
  
      return nodes
    }
  
    return {
      /***************************************************************************
       * PUBLIC CONSTANTS (is there a better way to do this?)
       **************************************************************************/
      WHITE: WHITE,
      BLACK: BLACK,
      PAWN: PAWN,
      KNIGHT: KNIGHT,
      BISHOP: BISHOP,
      ROOK: ROOK,
      QUEEN: QUEEN,
      KING: KING,
      SQUARES: (function() {
        /* from the ECMA-262 spec (section 12.6.4):
         * "The mechanics of enumerating the properties ... is
         * implementation dependent"
         * so: for (var sq in SQUARES) { keys.push(sq); } might not be
         * ordered correctly
         */
        var keys = []
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          if (i & 0x88) {
            i += 7
            continue
          }
          keys.push(algebraic(i))
        }
        return keys
      })(),
      FLAGS: FLAGS,
  
      /***************************************************************************
       * PUBLIC API
       **************************************************************************/
      load: function(fen) {
        return load(fen)
      },
  
      reset: function() {
        return reset()
      },
  
      moves: function(options) {
        /* The internal representation of a chess move is in 0x88 format, and
         * not meant to be human-readable.  The code below converts the 0x88
         * square coordinates to algebraic coordinates.  It also prunes an
         * unnecessary move keys resulting from a verbose call.
         */
  
        var ugly_moves = generate_moves(options)
        var moves = []
  
        for (var i = 0, len = ugly_moves.length; i < len; i++) {
          /* does the user want a full move object (most likely not), or just
           * SAN
           */
          if (
            typeof options !== 'undefined' &&
            'verbose' in options &&
            options.verbose
          ) {
            moves.push(make_pretty(ugly_moves[i]))
          } else {
            moves.push(move_to_san(ugly_moves[i], false))
          }
        }
  
        return moves
      },
  
      in_check: function() {
        return in_check()
      },
  
      in_checkmate: function() {
        return in_checkmate()
      },
  
      in_stalemate: function() {
        return in_stalemate()
      },
  
      in_draw: function() {
        return (
          half_moves >= 100 ||
          in_stalemate() ||
          insufficient_material() ||
          in_threefold_repetition()
        )
      },
  
      insufficient_material: function() {
        return insufficient_material()
      },
  
      in_threefold_repetition: function() {
        return in_threefold_repetition()
      },
  
      game_over: function() {
        return (
          half_moves >= 100 ||
          in_checkmate() ||
          in_stalemate() ||
          insufficient_material() ||
          in_threefold_repetition()
        )
      },
  
      validate_fen: function(fen) {
        return validate_fen(fen)
      },
  
      fen: function() {
        return generate_fen()
      },
  
      board: function() {
        var output = [],
          row = []
  
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          if (board[i] == null) {
            row.push(null)
          } else {
            row.push({ type: board[i].type, color: board[i].color })
          }
          if ((i + 1) & 0x88) {
            output.push(row)
            row = []
            i += 8
          }
        }
  
        return output
      },
  
      pgn: function(options) {
        /* using the specification from http://www.chessclub.com/help/PGN-spec
         * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
         */
        var newline =
          typeof options === 'object' && typeof options.newline_char === 'string'
            ? options.newline_char
            : '\n'
        var max_width =
          typeof options === 'object' && typeof options.max_width === 'number'
            ? options.max_width
            : 0
        var result = []
        var header_exists = false
  
        /* add the PGN header headerrmation */
        for (var i in header) {
          /* TODO: order of enumerated properties in header object is not
           * guaranteed, see ECMA-262 spec (section 12.6.4)
           */
          result.push('[' + i + ' "' + header[i] + '"]' + newline)
          header_exists = true
        }
  
        if (header_exists && history.length) {
          result.push(newline)
        }
  
        var append_comment = function(move_string) {
          var comment = comments[generate_fen()]
          if (typeof comment !== 'undefined') {
            var delimiter = move_string.length > 0 ? ' ' : '';
            move_string = `${move_string}${delimiter}{${comment}}`
          }
          return move_string
        }
  
        /* pop all of history onto reversed_history */
        var reversed_history = []
        while (history.length > 0) {
          reversed_history.push(undo_move())
        }
  
        var moves = []
        var move_string = ''
  
        /* special case of a commented starting position with no moves */
        if (reversed_history.length === 0) {
          moves.push(append_comment(''))
        }
  
        /* build the list of moves.  a move_string looks like: "3. e3 e6" */
        while (reversed_history.length > 0) {
          move_string = append_comment(move_string)
          var move = reversed_history.pop()
  
          /* if the position started with black to move, start PGN with 1. ... */
          if (!history.length && move.color === 'b') {
            move_string = move_number + '. ...'
          } else if (move.color === 'w') {
            /* store the previous generated move_string if we have one */
            if (move_string.length) {
              moves.push(move_string)
            }
            move_string = move_number + '.'
          }
  
          move_string = move_string + ' ' + move_to_san(move, false)
          make_move(move)
        }
  
        /* are there any other leftover moves? */
        if (move_string.length) {
          moves.push(append_comment(move_string))
        }
  
        /* is there a result? */
        if (typeof header.Result !== 'undefined') {
          moves.push(header.Result)
        }
  
        /* history should be back to what it was before we started generating PGN,
         * so join together moves
         */
        if (max_width === 0) {
          return result.join('') + moves.join(' ')
        }
  
        var strip = function() {
          if (result.length > 0 && result[result.length - 1] === ' ') {
            result.pop();
            return true;
          }
          return false;
        };
  
        /* NB: this does not preserve comment whitespace. */
        var wrap_comment = function(width, move) {
          for (var token of move.split(' ')) {
            if (!token) {
              continue;
            }
            if (width + token.length > max_width) {
              while (strip()) {
                width--;
              }
              result.push(newline);
              width = 0;
            }
            result.push(token);
            width += token.length;
            result.push(' ');
            width++;
          }
          if (strip()) {
            width--;
          }
          return width;
        };
  
        /* wrap the PGN output at max_width */
        var current_width = 0
        for (var i = 0; i < moves.length; i++) {
          if (current_width + moves[i].length > max_width) {
            if (moves[i].includes('{')) {
              current_width = wrap_comment(current_width, moves[i]);
              continue;
            }
          }
          /* if the current move will push past max_width */
          if (current_width + moves[i].length > max_width && i !== 0) {
            /* don't end the line with whitespace */
            if (result[result.length - 1] === ' ') {
              result.pop()
            }
  
            result.push(newline)
            current_width = 0
          } else if (i !== 0) {
            result.push(' ')
            current_width++
          }
          result.push(moves[i])
          current_width += moves[i].length
        }
  
        return result.join('')
      },
  
      load_pgn: function(pgn, options) {
        // allow the user to specify the sloppy move parser to work around over
        // disambiguation bugs in Fritz and Chessbase
        var sloppy =
          typeof options !== 'undefined' && 'sloppy' in options
            ? options.sloppy
            : false
  
        function mask(str) {
          return str.replace(/\\/g, '\\')
        }
  
        function has_keys(object) {
          for (var key in object) {
            return true
          }
          return false
        }
  
        function parse_pgn_header(header, options) {
          var newline_char =
            typeof options === 'object' &&
            typeof options.newline_char === 'string'
              ? options.newline_char
              : '\r?\n'
          var header_obj = {}
          var headers = header.split(new RegExp(mask(newline_char)))
          var key = ''
          var value = ''
  
          for (var i = 0; i < headers.length; i++) {
            key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1')
            value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1')
            if (trim(key).length > 0) {
              header_obj[key] = value
            }
          }
  
          return header_obj
        }
  
        var newline_char =
          typeof options === 'object' && typeof options.newline_char === 'string'
            ? options.newline_char
            : '\r?\n'
  
        // RegExp to split header. Takes advantage of the fact that header and movetext
        // will always have a blank line between them (ie, two newline_char's).
        // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
        var header_regex = new RegExp(
          '^(\\[((?:' +
            mask(newline_char) +
            ')|.)*\\])' +
            '(?:' +
            mask(newline_char) +
            '){2}'
        )
  
        // If no header given, begin with moves.
        var header_string = header_regex.test(pgn)
          ? header_regex.exec(pgn)[1]
          : ''
  
        // Put the board in the starting position
        reset()
  
        /* parse PGN header */
        var headers = parse_pgn_header(header_string, options)
        for (var key in headers) {
          set_header([key, headers[key]])
        }
  
        /* load the starting position indicated by [Setup '1'] and
         * [FEN position] */
        if (headers['SetUp'] === '1') {
          if (!('FEN' in headers && load(headers['FEN'], true))) {
            // second argument to load: don't clear the headers
            return false
          }
        }
  
        /* NB: the regexes below that delete move numbers, recursive
         * annotations, and numeric annotation glyphs may also match
         * text in comments. To prevent this, we transform comments
         * by hex-encoding them in place and decoding them again after
         * the other tokens have been deleted.
         *
         * While the spec states that PGN files should be ASCII encoded,
         * we use {en,de}codeURIComponent here to support arbitrary UTF8
         * as a convenience for modern users */
  
        var to_hex = function(string) {
          return Array
            .from(string)
            .map(function(c) {
              /* encodeURI doesn't transform most ASCII characters,
               * so we handle these ourselves */
              return c.charCodeAt(0) < 128
                ? c.charCodeAt(0).toString(16)
                : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
            })
            .join('')
        }
  
        var from_hex = function(string) {
          return string.length == 0
            ? ''
            : decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'))
        }
  
        var encode_comment = function(string) {
          string = string.replace(new RegExp(mask(newline_char), 'g'), ' ')
          return `{${to_hex(string.slice(1, string.length - 1))}}`
        }
  
        var decode_comment = function(string) {
          if (string.startsWith('{') && string.endsWith('}')) {
            return from_hex(string.slice(1, string.length - 1))
          }
        }
  
        /* delete header to get the moves */
        var ms = pgn
          .replace(header_string, '')
          .replace(
            /* encode comments so they don't get deleted below */
            new RegExp(`(\{[^}]*\})+?|;([^${mask(newline_char)}]*)`, 'g'),
            function(match, bracket, semicolon) {
              return bracket !== undefined
                ? encode_comment(bracket)
                : ' ' + encode_comment(`{${semicolon.slice(1)}}`)
            }
          )
          .replace(new RegExp(mask(newline_char), 'g'), ' ')
  
        /* delete recursive annotation variations */
        var rav_regex = /(\([^\(\)]+\))+?/g
        while (rav_regex.test(ms)) {
          ms = ms.replace(rav_regex, '')
        }
  
        /* delete move numbers */
        ms = ms.replace(/\d+\.(\.\.)?/g, '')
  
        /* delete ... indicating black to move */
        ms = ms.replace(/\.\.\./g, '')
  
        /* delete numeric annotation glyphs */
        ms = ms.replace(/\$\d+/g, '')
  
        /* trim and get array of moves */
        var moves = trim(ms).split(new RegExp(/\s+/))
  
        /* delete empty entries */
        moves = moves
          .join(',')
          .replace(/,,+/g, ',')
          .split(',')
        var move = ''
  
        for (var half_move = 0; half_move < moves.length - 1; half_move++) {
          var comment = decode_comment(moves[half_move])
          if (comment !== undefined) {
            comments[generate_fen()] = comment
            continue
          }
          move = move_from_san(moves[half_move], sloppy)
  
          /* move not possible! (don't clear the board to examine to show the
           * latest valid position)
           */
          if (move == null) {
            return false
          } else {
            make_move(move)
          }
        }
  
        comment = decode_comment(moves[moves.length - 1])
        if (comment !== undefined) {
          comments[generate_fen()] = comment
          moves.pop()
        }
  
        /* examine last move */
        move = moves[moves.length - 1]
        if (POSSIBLE_RESULTS.indexOf(move) > -1) {
          if (has_keys(header) && typeof header.Result === 'undefined') {
            set_header(['Result', move])
          }
        } else {
          move = move_from_san(move, sloppy)
          if (move == null) {
            return false
          } else {
            make_move(move)
          }
        }
        return true
      },
  
      header: function() {
        return set_header(arguments)
      },
  
      ascii: function() {
        return ascii()
      },
  
      turn: function() {
        return turn
      },
  
      move: function(move, options) {
        /* The move function can be called with in the following parameters:
         *
         * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
         *
         * .move({ from: 'h7', <- where the 'move' is a move object (additional
         *         to :'h8',      fields are ignored)
         *         promotion: 'q',
         *      })
         */
  
        // allow the user to specify the sloppy move parser to work around over
        // disambiguation bugs in Fritz and Chessbase
        var sloppy =
          typeof options !== 'undefined' && 'sloppy' in options
            ? options.sloppy
            : false
  
        var move_obj = null
        var moves = generate_moves()

        if (typeof move === 'string') {
          move_obj = move_from_san(move, sloppy);
          /* atomic:  */
          if (!move_obj && move[move.length -1] === '#') {
            move = move.replace('#', '+');
            for (var i = 0, len = moves.length; i < len; i++) {
              if (move === move_to_san(moves[i], moves)) {
                move_obj = moves[i];
                break;
              }
            }
          }
          /* atomic: allow move to be made because kings connected to each other are not in check */
          if (!move_obj) {
            for (var i = 0, len = moves.length; i < len; i++) {
              var san = move_to_san(moves[i], moves);
              if (san[san.length -1] === '+' && move === san.slice(0, san.length -1)) {
                move_obj = moves[i];
                break;
              }
            }
          }
        } else if (typeof move === 'object') {
          /* convert the pretty move object to an ugly move object */
          for (var i = 0, len = moves.length; i < len; i++) {
            if (
              move.from === algebraic(moves[i].from) &&
              move.to === algebraic(moves[i].to) &&
              (!('promotion' in moves[i]) ||
                move.promotion === moves[i].promotion)
            ) {
              move_obj = moves[i]
              break
            }
          }
        }
  
        /* failed to find move */
        if (!move_obj) {
          return null
        }
  
        /* need to make a copy of move because we can't generate SAN after the
         * move is made
         */
        var pretty_move = make_pretty(move_obj)
  
        make_move(move_obj)
  
        return pretty_move
      },
  
      undo: function() {
        var move = undo_move()
        return move ? make_pretty(move) : null
      },
  
      clear: function() {
        return clear()
      },
  
      put: function(piece, square) {
        return put(piece, square)
      },
  
      get: function(square) {
        return get(square)
      },
  
      remove: function(square) {
        return remove(square)
      },
  
      perft: function(depth) {
        return perft(depth)
      },
  
      square_color: function(square) {
        if (square in SQUARES) {
          var sq_0x88 = SQUARES[square]
          return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark'
        }
  
        return null
      },
  
      history: function(options) {
        var reversed_history = []
        var move_history = []
        var verbose =
          typeof options !== 'undefined' &&
          'verbose' in options &&
          options.verbose
  
        while (history.length > 0) {
          reversed_history.push(undo_move())
        }
  
        while (reversed_history.length > 0) {
          var move = reversed_history.pop()
          if (verbose) {
            move_history.push(make_pretty(move))
          } else {
            move_history.push(move_to_san(move))
          }
          make_move(move)
        }
  
        return move_history
      },
  
      get_comment: function() {
        return comments[generate_fen()];
      },
  
      set_comment: function(comment) {
        comments[generate_fen()] = comment.replace('{', '[').replace('}', ']');
      },
  
      delete_comment: function() {
        var comment = comments[generate_fen()];
        delete comments[generate_fen()];
        return comment;
      },
  
      get_comments: function() {
        prune_comments();
        return Object.keys(comments).map(function(fen) {
          return {fen: fen, comment: comments[fen]};
        });
      },
  
      delete_comments: function() {
        prune_comments();
        return Object.keys(comments)
          .map(function(fen) {
            var comment = comments[fen];
            delete comments[fen];
            return {fen: fen, comment: comment};
          });
      }
    }
  }
  
  /* export Chess object if using node or any other CommonJS compatible
   * environment */
  if (typeof exports !== 'undefined') exports.Chess = Chess
  /* export Chess object for any RequireJS compatible environment */
  if (typeof define !== 'undefined')
    define(function() {
      return Chess
    })
},{}],2:[function(require,module,exports){
// var Chess = require('../../assets/libs/chess.min.js').Chess;
var Chess = require('../../chess.js').Chess;
var Chessground = require("chessground");
var Parser = require('@mliebelt/pgn-parser');

var games = [];
var grounds = [];
var n = 1;

var groundOptions = {
    orientation: 'white',
    animation: {
        enabled: true,  // enable piece animations, moving and fading
        duration: 165,  // animation duration in milliseconds
    },
    highlight: {
        lastMove: true,       // add last-move class to squares
        check: true,          // add check class to squares
        dragOver: true        // add drag-over class to square when dragging over it
    },
    movable: {
        free: false, // all moves are valid - board editor
        color: "both", // color that can move. "white" | "black" | "both" | null
        dests: {}, // valid moves. {a2: ["a3", "a4"], b1: ["a3", "c3"]} | null
        dropOff: "revert", // when a piece is dropped outside the board. "revert" | "trash"
        showDests: true, // add the move-dest class to squares
        events: {
            // called after the move has been played
            after: function(orig, dest, metadata) {
                console.log('' + orig + ' ' + dest + ' ' + metadata);
            }
        }
    }
};

for (var i=0; i<n; i++) {
    var newGame = new Chess();
    games.push(newGame);
    var newGround = Chessground(document.getElementById(`ground${i}`), groundOptions);
    grounds.push(newGround);
}

function singleMove(move, gameNum) {
    games[gameNum].move(move);
    grounds[gameNum].set({
        fen: games[gameNum].fen()
    })
}

function timedMover(moves, gameNum, i) {
    if (i < moves.length) {
        singleMove(moves[i++], gameNum);
        window.setTimeout(function() { timedMover(moves, gameNum, i); }, 750);
    }
}

function move(moves, gameNum) {
    window.setTimeout(function() { timedMover(moves, gameNum, 0); }, 500);
}

var pgn =  [
    `[Variant "Atomic"] 1. Nh3 h6 2. d4 e6 3. Bg5 f6 4. Bf4 Bb4+ 5. c3 d6 6. Na3 Bxa3 7. Qa4+ c6 8. O-O-O { 8 ... Ne7 or Nd7 can be met with 9. Bxd6 (or perhaps 9. d5).
        8 ... Na6 allows 9. d5, with tactics similar to those of 1. e4 e6 2. Qh5 g6 3. Qh4 f6 4. f4 Nh6 5. e5 Ng4 6. exf6.
        8 ... e5 allows 9. Bd3 (black does not have 9 ... exd4 10. Qe4 +-), which threatens 10. dxe5, which in turn threatens both 11. Qe4 and 11. Bxa7.
        8 ... h5 followed by 9 ... Na6 is too slow because of 8 ... h5 9. d5 Na6 10. Bd3 Ng4 11. Bxa7. If white gets off 11. Bxa7, a tempo is gained because of the threat of 12. dxc6 b5 13. Qe4. } { [%csl Ga5][%cal Gd8a5,Ga7a5,Gb7b5,Ge6e5,Gf6f5,Gg7g6,Gg7g5,Gh6h5] } 8... Qa5 { [%csl Gd6][%cal Gf4d6,Ge2e4] } (8... b5 9. Qa5 (9. Qc2 f5 10. d5 cxd5 11. Qd3 Nf6 12. Bxd6 Qd4 (12... O-O 13. Qd7) 13. Qxd4 Nd5 14. Nf4 O-O (14... g6 15. Nxe6 O-O) 15. Ng6) 9... Qxa5 { [%csl Gd6][%cal Gf4d6,Ge2e4] } 10. Bxd6 (10. e4 e5 11. Bd2 Ne7 12. dxe5 { [%csl Gg6][%cal Gg7g6,Ge8h8] } 12... g6 (12... O-O 13. Nf4 Bg4 14. Kb1 g6 15. Ne6 Re8 16. f3) 13. e5 O-O 14. Be3 Bg4 15. f3 Bxf3 16. exd6 Nd7) 10... Ne7 (10... Bb7 11. d5 { [%csl Yc5][%cal Yc6c5,Yg8e7] } 11... c5 (11... Ne7 12. dxe6 O-O 13. Nf4 { [%cal Yg7g5,Yf8d8] } 13... g5 (13... Rd8 14. Rd7 Rxd7 15. Ne6 g5 16. Nc7) 14. Ne6 { [%csl Ye8][%cal Yf8e8,Ye8d8,Yg8h8] } 14... Re8 { [%csl Yc5][%cal Ye6c5,Ye6c7] } (14... Rd8 15. Nxd8 Nd7 16. Rd6 c5 17. e4)  (14... Kh8 { [%csl Yd8][%cal Yd1d8,Ye6c7] } 15. Rd8 (15. Nc7) 15... Rxd8 16. Nc7) 15. Nc5 { [%cal Yb7a6,Yb7c8] } 15... Ba6 (15... Bc8 16. Rd7 Bxd7 (16... Re7 17. Rxa7)) 16. Rd7 { [%csl Yd7][%cal Yb8d7,Ye8e7] } 16... Nxd7 (16... Re7 17. Rxa7)))  (10... g5) 11. d5 Ng6 12. dxe6 O-O 13. Rd8 { [%cal Yf8e8,Yg8h8,Yf8d8] } 13... Re8 (13... Kh8 14. Ng5)  (13... Rxd8 14. Nf4 { [%csl Yf4][%cal Yg6f4,Yg6h4] } 14... Nxf4 15. e4 { [%cal Yb8a6,Yb8d7] }))  (8... a5 9. d5 b5 10. Qc2 f5 (10... g6) 11. e4 b4 (11... Na6)  (11... e5 12. Bxe5 g6 (12... Qh4 13. Re1 Ne7 14. Nf4 O-O 15. g3 Qg5 (15... g6 16. gxh4))  (12... f4) 13. e5 cxd5 (13... Ne7 14. Re1 O-O 15. exd6 Be6)  (13... Nf6 14. exf6 Qe7 15. Re1 Qe2 16. Rxe2 O-O 17. Re1) 14. Nf4 d5 15. Qd3 Ne7 16. Ne6 Bxe6 17. Qd4 Nd7)  (11... g6))  (8... h5 9. d5 { [%cal Yg8h6,Gd8a5] } 9... Qa5 (9... Nh6 10. Be3 { [%csl Yg4][%cal Yd8a5,Yh6g4] } 10... Ng4 (10... Qa5 11. Bxa7 Ng4 12. Nf4) 11. Bxa7 O-O (11... Nxh2 12. dxc6+ b5 13. Qe4) 12. Nf4))  (8... Na6 9. d5 Nb4 (9... Kf8)  (9... e5 10. Be3 Bf5 11. Bxa7 Bc2 12. Rd4 Bxa4 (12... exd4) 13. Ra4) 10. dxc6+ b5 11. Qa5 Kf8 12. Qc7 Bd7 (12... Qxc7 13. Bxd6 Rd8 14. Rd7 Rxd7 15. Nf4) 13. cxb4 Qxc7 14. Rd3 b4 15. Rd4)  (8... e5 9. Be3 { dxe5 creates both Qe4 and Bxa7. } 9... b5 (9... Qa5)  (9... Bg4 10. dxe5 Bf5 (10... Be6)  (10... f5 11. Qb3 d5 12. Qb4 c5 13. Qb5+ Nc6 14. Rxd5+) 11. Bxa7)  (9... Na6 10. d5)  (9... Ne7 10. dxe5 Be6 11. Bxa7 Bb3 12. Rd3))  (8... f5 9. d5 { [%csl Gb5][%cal Gb7b5,Ge6e5] } 9... b5 (9... e5 10. Be3 (10. dxc6+ Nc6 (10... b5 11. Qb3) 11. Qb5 { [%csl Ga6][%cal Ga7a6,Gd8a5] } 11... a6 (11... Qa5) 12. Qxb7) 10... a5 { [%csl Gb6][%cal Ge3b6,Gd5c6] } 11. Bb6 (11. dxc6+ b5 { [%csl Gb6][%cal Ge3b6,Ga4b3] } 12. Bb6 { [%csl Gg5][%cal Gd8g5,Gd8h4,Gd8d7] } (12. Qb3 Be6 (12... d5 13. Qa3 Qd6 14. Rxd5 b4 15. Qa4+ Nc6 16. Qd1) 13. Bb6 Qh4 (13... Qc8 14. Bc7 a4 15. Bxb8 a3 16. Qxa3 Bc4 17. e4 Be2 18. Rd2) 14. Rxd6 Qc4 (14... Qb4 15. Bxa5 Rxa2 16. e4) 15. Qd1 Qd5 16. Qd4) 12... Qg5+ (12... Qh4 13. e4 { [%csl Gf6][%cal Gg8f6,Ra4b3,Gg8e7] } 13... Nf6 14. Qb3 Nd5 15. exd5 { [%csl Ge6][%cal Gc8e6,Gh4c4] } 15... Be6 (15... Qc4 16. Bc7 { [%csl Gd7][%cal Gb8d7,Ge8h8] } 16... Nd7 (16... O-O 17. Bxb8 Qxc3 18. Rd3 b4 19. Rd5 Rc8+ 20. Bc4) 17. Bxd6 O-O 18. Rd8 Kh8 19. Qxb5) 16. Rxd6 Qc4 17. Nf4 { [%csl Gg5][%cal Gg7g5,Ge5f4,Gc4c3] } 17... g5 (17... exf4 18. Bd3 O-O (18... Qxc3 19. Re1+ Kd7 20. Rd1+ Ke6 21. Rd6+ Ke7 22. Bd8+ Kf8 23. Be7+ Kf7 24. Bf8 g5 25. Re6) 19. Re1 Re8 20. Re7 Rxe7 21. Qd1)  (17... Qxc3 18. Bc4 bxc4 19. Rd1 Kf7 20. Ne6 g5 21. Nd8+) 18. Ne6) 13. Nxg5 bxa4 14. e4 Ba6 15. Bc4 { [%csl Gc4][%cal Ga6c4,Gd6d5] } 15... Bxc4 (15... d5 16. Bb5+ { [%csl Gb5][%cal Ge8f8,Ga6b5] } 16... Bxb5 (16... Kf8 17. Bd8 { [%csl Gf6][%cal Gg8f6,Ga6b5] } 17... Nf6 (17... Bxb5 18. Be7+ Kf7 19. exd5) 18. Be8 { [%cal Rd8e7,Re8f7,Rf7g8,Rg8h7,Re7f6] } 18... Nc6 19. Be7+ Kg8 20. exd5 $18) 17. exd5 Nf6 18. Rd8+ Ke7 19. Re8+ Kd7 20. Rd1+ Nd5 21. c4 $18) 16. Bc7 Na6 17. Bxd6 Nc5 18. Rd8+ Ke7) 11... Qh4 12. e4)) 9. Bxd6 (9. e4 e5 10. Bxe5 Qb4 11. Qxb4 Ne7 12. e5 Bg4 13. f3 Nc8 14. Ng5 O-O 15. Bc4+ d5 16. Nh7 Re8 17. fxg4 Nd7 18. Rhe1 Ncb6 19. b3 Nxe5) 9... Qb4 10. Qxb4 Ne7 11. d5 Ng6 (11... O-O 12. dxe6) 12. dxe6 O-O 13. Rd8 { [%csl Gh8][%cal Gf8e8,Gg8h8] } 13... Kh8 (13... Re8 14. Rd7 Bxd7 (14... Re7 15. e4 b5 16. Nf4 Nxf4 (16... Nh4 17. Nh5 g5 18. Bc4+ bxc4 19. Rhd1) 17. Rxa7) 15. e4 (15. Nf4 Nxf4 16. e4 Nd7 17. Bc4+ Kh8 18. Rd1 c5 (18... Nf8) 19. Rd6)) 14. Ng5 fxg5 { [%csl Ge4][%cal Gg2g4,Ge2e4] } 15. e4 { [%csl Gd7][%cal Gb8a6,Gb8d7,Gb7b5,Gg7g5,Gc8e6] } (15. g4) 15... Nd7 (15... Na6 16. Bxa6 { [%cal Gc8e6,Gc8g4] } 16... Be6 (16... Bg4 17. f3) 17. f4 Bg4 18. f5 Raxd8 (18... Be2 19. Rd7 Rf7 20. f6 g5 21. e5) 19. f6) *`
    ,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
,`[Variant "Atomic"] 1. Nh3 1... h6 2. d4 d5 3. Nc3 { [%cal Ge7e6,Ga7a6,Gc7c6,Gb7b5] } 3... a6 { [%csl Ge4][%cal Gc3e4,Ge2e4] } (3... e6 { [%cal Gc1f4,Gc1g5] } 4. Bg5 { [%cal Gg8f6,Gh6g5] } (4. Bf4 Qh4 (4... Nf6 5. f3 { [%cal Gf6g4,Gf6e4] } 5... Ng4 (5... Ne4 6. Nxd5) 6. Nb5 { [%csl Gf2][%cal Gg4f2,Gf8b4] } 6... Nf2 (6... Bb4+ 7. c3 Ne3 8. Bxe3) 7. Qc1 Bb4+ 8. c3 { [%cal Gd8g5,Gd8h4] }) 5. g3 Bb4 6. Ng5 Qxg5 7. e4 e5 8. a3) 4... Nf6 (4... hxg5 5. Ng5 f5 { [%cal Ge2e4,Gc3b5] } 6. Nb5) 5. e3 Bb4 6. Qf3 { [%cal Rg5h4] } 6... O-O 7. Bxf6 { [%csl Gh8][%cal Gf7f5,Gg8h8] } 7... Kh8 (7... f5 8. Qg3 { [%csl Gg5][%cal Gd8g5,Gg7g6] } 8... Qg5 (8... g6 9. Qxc7 e5 10. a3) 9. Nxg5 g5 10. Qe5) 8. Qg3 Qg5 9. Nxg5 g6 10. Qxc7 e5 { [%cal Ga2a3,Gd4e5] } 11. dxe5 d4 12. Bb5 d3 13. O-O dxc2) 4. Ne4 (4. e4 { [%cal Ge7e6,Ge7e5] }) 4... Bg4 5. f3 Bxf3 6. g3 { [%cal Gd8d7,Ge7e6] } (6. e4) 6... e6 (6... Qd7 7. Bg2 Qb5 8. Qd3 { [%cal Ge7e6,Ge7e5,Gg7g6] } 8... e5 (8... g6 9. O-O f5 (9... f6 10. Nf4 e6 11. Nh5))  (8... e6 9. O-O { [%cal Gf7f5,Ge8d8] } 9... f5 (9... Kd8 10. Bf4 e5 11. Bg5+ { [%cal Gf7f6,Gg8f6] } 11... Nf6 (11... f6 12. Bxf6 Nf6 13. dxe5) 12. dxe5+ hxg5 13. Rf5 Qb6+ 14. e3 { [%cal Gb6f6,Gh8h6] } 14... Rh6 (14... Qf6 15. Bxd5+ Bd6 16. Rxf6 Rh6 17. Qf5 Re6 18. Rd1) 15. Bxd5+) 10. g4 Bd6 (10... Qxd3 11. gxf5 Bd6 (11... Nf6 12. Ng5 Kd8 13. Nf7+ Kc8 (13... Ke8 14. Nd8) 14. Bf4 e5 15. Nd8 b5 16. Ne6 c5 17. Nxg7) 12. Nf4)  (10... g6 11. gxf5 Bd6 (11... Nf6 12. Ng5) 12. Nf4) 11. Bxd5) 9. O-O f5 10. dxe5 Bb4 (10... Nf6 11. Rxf5 Bc5+ (11... g6) 12. Bxd5 Qxd3 13. Nf4) 11. Qxb5 Nf6 12. e4 O-O 13. Ng5 Ng4 14. h4 Ne3 (14... Nh2 15. Re1 hxg5 16. exd5) 15. Bxe3 hxg5) 7. e4 f5 8. Bg2 f4 { [%cal Rf4g3] } 9. Rf1 { [%csl Gb4][%cal Gf4f3,Gf8b4,Gb8d7] } (9. O-O Ba3 (9... Nf6) 10. gxf4 (10. bxa3 Nf6 11. Ng5) 10... Qf6 11. Bf4 dxe4 (11... Qh4 12. Bg3 Nf6 13. Bxh4 O-O 14. bxa3 Kh8 15. h3 Nbd7 16. exd5 Nd5 17. Rf7 Rxf7 18. Qg4 g6 19. Qxe6) 12. Rxf6 Nf6 13. Ng5 hxg5 14. Qh5+ g6 15. Qh7 Bxb2 16. Bxb7 Rxh7) 9... Bb4+ (9... f3 10. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 10... Nf6 (10... Qf6 11. Bf4)) 10. c3 { [%csl Gf3][%cal Gf4f3,Gg7g6] } 10... f3 (10... g6 11. e5 { [%csl Gd7][%cal Gb8d7,Gg8e7,Gc7c5,Gb8c6,Gc7c6,Ga6a5] } 11... Nd7 (11... Ne7 12. gxf4 Nf5 13. Bg5 O-O 14. Qf3)  (11... c5 12. Ng5 hxg5 13. Bxf4 Nf6 14. Qf3 Nbd7 15. Bh3 Rh4 16. gxh4 Qc7 17. Qh3 O-O-O 18. Qh7 Nxh7 19. Rf7 Kb8 20. Rxd7)  (11... c6 12. Bxf4 Nf6 13. Ng5)  (11... a5 12. Bxf4 Nf6 13. Ng5 O-O 14. Qf3 Nc6 15. Bh3 Bxc3 16. Rc1 b5 17. Kd1 b4 18. Nf7 Nh5 19. Nxd8 Nf4 20. Qh1 Kh8 21. gxf4 Rf4 22. Rxf4 Rf8 23. Qf3) 12. Bxf4 Ngf6 13. Ng5 O-O 14. Qc1 c5 15. Qf4 cxd4 16. Nxe6 Rf5 17. Qxf5 Qf6 18. Rxf6 Rf8 19. Bf3 Bc5 20. O-O-O Be3+) 11. Bxf3 { [%csl Gf6][%cal Gg8f6,Gd8f6] } 11... Nf6 (11... Qf6 12. Bf4 { [%cal Gf6f8,Gd5e4,Gb8d7] } 12... Qf8 (12... dxe4 13. Nf4)  (12... Nd7 13. Ng5 Qg6 14. Qg4) 13. Ng5 g6 14. Nh7 Rxh7) 12. Ng5 O-O *`
]

function findRandomLine(moveArray) {
    var line = []
    var index = 0;
    while (moveArray[index] && moveArray[index]["notation"]) {
        var moveObj = moveArray[index];
        var n = moveObj["variations"].length;
        var random = Math.floor(Math.random() * (n+1));
        if (random == 0) {
            // continue with mainline
            var nextMove = moveObj["notation"]["notation"];
            index++;
            line.push(nextMove)
        }
        else {
            // continue with a variation
            var variationArray = moveObj["variations"][random-1];
            moveArray = variationArray;
            var nextMove = moveArray[0]["notation"]["notation"];
            index = 1;
            line.push(nextMove)
        }
    }
    return line;
}

/* play out random lines in each board */
for (var gameNum=0; gameNum<n; gameNum++) {
    var pgnDataObject = Parser.parse(pgn[gameNum], { startRule: "game" });
    var moves = findRandomLine(pgnDataObject["moves"]);
    console.log(moves);
    move(moves, gameNum);
}
},{"../../chess.js":1,"@mliebelt/pgn-parser":4,"chessground":15}],3:[function(require,module,exports){
/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { pgn: peg$parsepgn, tags: peg$parsetags, game: peg$parsegame, games: peg$parsegames },
      peg$startRuleFunction  = peg$parsepgn,

      peg$c0 = function(head, m) { return m; },
      peg$c1 = function(head, tail) { return [head].concat(tail) },
      peg$c2 = function(games) { return games },
      peg$c3 = function(t, p) { return { tags: t, moves: p[0] }; },
      peg$c4 = function(head, tail) {
              var result = {};
              [head].concat(tail).forEach(function(element) {
                result[element.name] = element.value;
              });
              return result;
            },
      peg$c5 = function(members) { return members !== null ? members: {}; },
      peg$c6 = function(tag) { return tag; },
      peg$c7 = function(value) { return { name: 'Event', value: value }; },
      peg$c8 = function(value) { return { name: 'Site', value: value }; },
      peg$c9 = function(value) { return { name: 'Date', value: value }; },
      peg$c10 = function(value) { return { name: 'Round', value: value }; },
      peg$c11 = function(value) { return { name: 'WhiteTitle', value: value }; },
      peg$c12 = function(value) { return { name: 'BlackTitle', value: value }; },
      peg$c13 = function(value) { return { name: 'WhiteELO', value: value }; },
      peg$c14 = function(value) { return { name: 'BlackELO', value: value }; },
      peg$c15 = function(value) { return { name: 'WhiteUSCF', value: value }; },
      peg$c16 = function(value) { return { name: 'BlackUSCF', value: value }; },
      peg$c17 = function(value) { return { name: 'WhiteNA', value: value }; },
      peg$c18 = function(value) { return { name: 'BlackNA', value: value }; },
      peg$c19 = function(value) { return { name: 'WhiteType', value: value }; },
      peg$c20 = function(value) { return { name: 'BlackType', value: value }; },
      peg$c21 = function(value) { return { name: 'White', value: value }; },
      peg$c22 = function(value) { return { name: 'Black', value: value }; },
      peg$c23 = function(value) { return { name: 'Result', value: value }; },
      peg$c24 = function(value) { return { name: 'EventDate', value: value }; },
      peg$c25 = function(value) { return { name: 'EventSponsor', value: value }; },
      peg$c26 = function(value) { return { name: 'Section', value: value }; },
      peg$c27 = function(value) { return { name: 'Stage', value: value }; },
      peg$c28 = function(value) { return { name: 'Board', value: value }; },
      peg$c29 = function(value) { return { name: 'Opening', value: value }; },
      peg$c30 = function(value) { return { name: 'Variation', value: value }; },
      peg$c31 = function(value) { return { name: 'SubVariation', value: value }; },
      peg$c32 = function(value) { return { name: 'ECO', value: value }; },
      peg$c33 = function(value) { return { name: 'NIC', value: value }; },
      peg$c34 = function(value) { return { name: 'Time', value: value }; },
      peg$c35 = function(value) { return { name: 'UTCTime', value: value }; },
      peg$c36 = function(value) { return { name: 'UTCDate', value: value }; },
      peg$c37 = function(value) { return { name: 'TimeControl', value: value }; },
      peg$c38 = function(value) { return { name: 'SetUp', value: value }; },
      peg$c39 = function(value) { return { name: 'FEN', value: value }; },
      peg$c40 = function(value) { return { name: 'Termination', value: value }; },
      peg$c41 = function(value) { return { name: 'Annotator', value: value }; },
      peg$c42 = function(value) { return { name: 'Mode', value: value }; },
      peg$c43 = function(value) { return { name: 'PlyCount', value: value }; },
      peg$c44 = function(any, value) { return { name: any, value: value }; },
      peg$c45 = "Event",
      peg$c46 = peg$literalExpectation("Event", false),
      peg$c47 = "event",
      peg$c48 = peg$literalExpectation("event", false),
      peg$c49 = "Site",
      peg$c50 = peg$literalExpectation("Site", false),
      peg$c51 = "site",
      peg$c52 = peg$literalExpectation("site", false),
      peg$c53 = "Date",
      peg$c54 = peg$literalExpectation("Date", false),
      peg$c55 = "date",
      peg$c56 = peg$literalExpectation("date", false),
      peg$c57 = "Round",
      peg$c58 = peg$literalExpectation("Round", false),
      peg$c59 = "round",
      peg$c60 = peg$literalExpectation("round", false),
      peg$c61 = "White",
      peg$c62 = peg$literalExpectation("White", false),
      peg$c63 = "Black",
      peg$c64 = peg$literalExpectation("Black", false),
      peg$c65 = "black",
      peg$c66 = peg$literalExpectation("black", false),
      peg$c67 = "Result",
      peg$c68 = peg$literalExpectation("Result", false),
      peg$c69 = "result",
      peg$c70 = peg$literalExpectation("result", false),
      peg$c71 = "WhiteTitle",
      peg$c72 = peg$literalExpectation("WhiteTitle", false),
      peg$c73 = "Whitetitle",
      peg$c74 = peg$literalExpectation("Whitetitle", false),
      peg$c75 = "whitetitle",
      peg$c76 = peg$literalExpectation("whitetitle", false),
      peg$c77 = "BlackTitle",
      peg$c78 = peg$literalExpectation("BlackTitle", false),
      peg$c79 = "Blacktitle",
      peg$c80 = peg$literalExpectation("Blacktitle", false),
      peg$c81 = "blacktitle",
      peg$c82 = peg$literalExpectation("blacktitle", false),
      peg$c83 = "WhiteELO",
      peg$c84 = peg$literalExpectation("WhiteELO", false),
      peg$c85 = "WhiteElo",
      peg$c86 = peg$literalExpectation("WhiteElo", false),
      peg$c87 = "Whiteelo",
      peg$c88 = peg$literalExpectation("Whiteelo", false),
      peg$c89 = "whiteelo",
      peg$c90 = peg$literalExpectation("whiteelo", false),
      peg$c91 = "BlackELO",
      peg$c92 = peg$literalExpectation("BlackELO", false),
      peg$c93 = "BlackElo",
      peg$c94 = peg$literalExpectation("BlackElo", false),
      peg$c95 = "Blackelo",
      peg$c96 = peg$literalExpectation("Blackelo", false),
      peg$c97 = "blackelo",
      peg$c98 = peg$literalExpectation("blackelo", false),
      peg$c99 = "WhiteUSCF",
      peg$c100 = peg$literalExpectation("WhiteUSCF", false),
      peg$c101 = "WhiteUscf",
      peg$c102 = peg$literalExpectation("WhiteUscf", false),
      peg$c103 = "Whiteuscf",
      peg$c104 = peg$literalExpectation("Whiteuscf", false),
      peg$c105 = "whiteuscf",
      peg$c106 = peg$literalExpectation("whiteuscf", false),
      peg$c107 = "BlackUSCF",
      peg$c108 = peg$literalExpectation("BlackUSCF", false),
      peg$c109 = "BlackUscf",
      peg$c110 = peg$literalExpectation("BlackUscf", false),
      peg$c111 = "Blackuscf",
      peg$c112 = peg$literalExpectation("Blackuscf", false),
      peg$c113 = "blackuscf",
      peg$c114 = peg$literalExpectation("blackuscf", false),
      peg$c115 = "WhiteNA",
      peg$c116 = peg$literalExpectation("WhiteNA", false),
      peg$c117 = "WhiteNa",
      peg$c118 = peg$literalExpectation("WhiteNa", false),
      peg$c119 = "Whitena",
      peg$c120 = peg$literalExpectation("Whitena", false),
      peg$c121 = "whitena",
      peg$c122 = peg$literalExpectation("whitena", false),
      peg$c123 = "BlackNA",
      peg$c124 = peg$literalExpectation("BlackNA", false),
      peg$c125 = "BlackNa",
      peg$c126 = peg$literalExpectation("BlackNa", false),
      peg$c127 = "Blackna",
      peg$c128 = peg$literalExpectation("Blackna", false),
      peg$c129 = "blackna",
      peg$c130 = peg$literalExpectation("blackna", false),
      peg$c131 = "WhiteType",
      peg$c132 = peg$literalExpectation("WhiteType", false),
      peg$c133 = "Whitetype",
      peg$c134 = peg$literalExpectation("Whitetype", false),
      peg$c135 = "whitetype",
      peg$c136 = peg$literalExpectation("whitetype", false),
      peg$c137 = "BlackType",
      peg$c138 = peg$literalExpectation("BlackType", false),
      peg$c139 = "Blacktype",
      peg$c140 = peg$literalExpectation("Blacktype", false),
      peg$c141 = "blacktype",
      peg$c142 = peg$literalExpectation("blacktype", false),
      peg$c143 = "EventDate",
      peg$c144 = peg$literalExpectation("EventDate", false),
      peg$c145 = "Eventdate",
      peg$c146 = peg$literalExpectation("Eventdate", false),
      peg$c147 = "eventdate",
      peg$c148 = peg$literalExpectation("eventdate", false),
      peg$c149 = "EventSponsor",
      peg$c150 = peg$literalExpectation("EventSponsor", false),
      peg$c151 = "Eventsponsor",
      peg$c152 = peg$literalExpectation("Eventsponsor", false),
      peg$c153 = "eventsponsor",
      peg$c154 = peg$literalExpectation("eventsponsor", false),
      peg$c155 = "Section",
      peg$c156 = peg$literalExpectation("Section", false),
      peg$c157 = "section",
      peg$c158 = peg$literalExpectation("section", false),
      peg$c159 = "Stage",
      peg$c160 = peg$literalExpectation("Stage", false),
      peg$c161 = "stage",
      peg$c162 = peg$literalExpectation("stage", false),
      peg$c163 = "Board",
      peg$c164 = peg$literalExpectation("Board", false),
      peg$c165 = "board",
      peg$c166 = peg$literalExpectation("board", false),
      peg$c167 = "Opening",
      peg$c168 = peg$literalExpectation("Opening", false),
      peg$c169 = "opening",
      peg$c170 = peg$literalExpectation("opening", false),
      peg$c171 = "Variation",
      peg$c172 = peg$literalExpectation("Variation", false),
      peg$c173 = "variation",
      peg$c174 = peg$literalExpectation("variation", false),
      peg$c175 = "SubVariation",
      peg$c176 = peg$literalExpectation("SubVariation", false),
      peg$c177 = "Subvariation",
      peg$c178 = peg$literalExpectation("Subvariation", false),
      peg$c179 = "subvariation",
      peg$c180 = peg$literalExpectation("subvariation", false),
      peg$c181 = "ECO",
      peg$c182 = peg$literalExpectation("ECO", false),
      peg$c183 = "Eco",
      peg$c184 = peg$literalExpectation("Eco", false),
      peg$c185 = "eco",
      peg$c186 = peg$literalExpectation("eco", false),
      peg$c187 = "NIC",
      peg$c188 = peg$literalExpectation("NIC", false),
      peg$c189 = "Nic",
      peg$c190 = peg$literalExpectation("Nic", false),
      peg$c191 = "nic",
      peg$c192 = peg$literalExpectation("nic", false),
      peg$c193 = "Time",
      peg$c194 = peg$literalExpectation("Time", false),
      peg$c195 = "time",
      peg$c196 = peg$literalExpectation("time", false),
      peg$c197 = "UTCTime",
      peg$c198 = peg$literalExpectation("UTCTime", false),
      peg$c199 = "UTCtime",
      peg$c200 = peg$literalExpectation("UTCtime", false),
      peg$c201 = "UtcTime",
      peg$c202 = peg$literalExpectation("UtcTime", false),
      peg$c203 = "Utctime",
      peg$c204 = peg$literalExpectation("Utctime", false),
      peg$c205 = "utctime",
      peg$c206 = peg$literalExpectation("utctime", false),
      peg$c207 = "UTCDate",
      peg$c208 = peg$literalExpectation("UTCDate", false),
      peg$c209 = "UTCdate",
      peg$c210 = peg$literalExpectation("UTCdate", false),
      peg$c211 = "UtcDate",
      peg$c212 = peg$literalExpectation("UtcDate", false),
      peg$c213 = "Utcdate",
      peg$c214 = peg$literalExpectation("Utcdate", false),
      peg$c215 = "utcdate",
      peg$c216 = peg$literalExpectation("utcdate", false),
      peg$c217 = "TimeControl",
      peg$c218 = peg$literalExpectation("TimeControl", false),
      peg$c219 = "Timecontrol",
      peg$c220 = peg$literalExpectation("Timecontrol", false),
      peg$c221 = "timecontrol",
      peg$c222 = peg$literalExpectation("timecontrol", false),
      peg$c223 = "SetUp",
      peg$c224 = peg$literalExpectation("SetUp", false),
      peg$c225 = "Setup",
      peg$c226 = peg$literalExpectation("Setup", false),
      peg$c227 = "setup",
      peg$c228 = peg$literalExpectation("setup", false),
      peg$c229 = "FEN",
      peg$c230 = peg$literalExpectation("FEN", false),
      peg$c231 = "Fen",
      peg$c232 = peg$literalExpectation("Fen", false),
      peg$c233 = "fen",
      peg$c234 = peg$literalExpectation("fen", false),
      peg$c235 = "Termination",
      peg$c236 = peg$literalExpectation("Termination", false),
      peg$c237 = "termination",
      peg$c238 = peg$literalExpectation("termination", false),
      peg$c239 = "Annotator",
      peg$c240 = peg$literalExpectation("Annotator", false),
      peg$c241 = "annotator",
      peg$c242 = peg$literalExpectation("annotator", false),
      peg$c243 = "Mode",
      peg$c244 = peg$literalExpectation("Mode", false),
      peg$c245 = "mode",
      peg$c246 = peg$literalExpectation("mode", false),
      peg$c247 = "PlyCount",
      peg$c248 = peg$literalExpectation("PlyCount", false),
      peg$c249 = "Plycount",
      peg$c250 = peg$literalExpectation("Plycount", false),
      peg$c251 = "plycount",
      peg$c252 = peg$literalExpectation("plycount", false),
      peg$c253 = peg$otherExpectation("whitespace"),
      peg$c254 = /^[ \t\n\r]/,
      peg$c255 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),
      peg$c256 = /^[\n\r]/,
      peg$c257 = peg$classExpectation(["\n", "\r"], false, false),
      peg$c258 = peg$otherExpectation("string"),
      peg$c259 = function(chars) { return chars.join(""); },
      peg$c260 = /^[a-zA-Z0-9]/,
      peg$c261 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
      peg$c262 = "\"",
      peg$c263 = peg$literalExpectation("\"", false),
      peg$c264 = /^[^\0-\x1F"\\]/,
      peg$c265 = peg$classExpectation([["\0", "\x1F"], "\"", "\\"], true, false),
      peg$c266 = /^[0-9?]/,
      peg$c267 = peg$classExpectation([["0", "9"], "?"], false, false),
      peg$c268 = ".",
      peg$c269 = peg$literalExpectation(".", false),
      peg$c270 = function(year, month, day) { return "" + year.join("") + '.' + month.join("") + '.' + day.join("");},
      peg$c271 = function(res) { return res; },
      peg$c272 = "1-0",
      peg$c273 = peg$literalExpectation("1-0", false),
      peg$c274 = function(res) {return res; },
      peg$c275 = "1:0",
      peg$c276 = peg$literalExpectation("1:0", false),
      peg$c277 = "0-1",
      peg$c278 = peg$literalExpectation("0-1", false),
      peg$c279 = "0:1",
      peg$c280 = peg$literalExpectation("0:1", false),
      peg$c281 = "1/2-1/2",
      peg$c282 = peg$literalExpectation("1/2-1/2", false),
      peg$c283 = "*",
      peg$c284 = peg$literalExpectation("*", false),
      peg$c285 = "-",
      peg$c286 = peg$literalExpectation("-", false),
      peg$c287 = /^[0-9]/,
      peg$c288 = peg$classExpectation([["0", "9"]], false, false),
      peg$c289 = function(digits) { return makeInteger(digits); },
      peg$c290 = function(pw, all) { var arr = (all ? all : []); arr.unshift(pw);return arr; },
      peg$c291 = function(pb, all) { var arr = (all ? all : []); arr.unshift(pb); return arr; },
      peg$c292 = function() { return [[]]; },
      peg$c293 = function(pw) { return pw; },
      peg$c294 = function(pb) { return pb; },
      peg$c295 = function(cm, mn, cb, hm, nag, ca, cd, vari, all) { var arr = (all ? all : []);
            var move = {}; move.turn = 'w'; move.moveNumber = mn;
            move.notation = hm; move.commentBefore = cb; move.commentAfter = ca; move.commentMove = cm;
            move.variations = (vari ? vari : []); move.nag = (nag ? nag : null); arr.unshift(move); 
            move.commentDiag = cd;
            if (cd && cd.text) { move.commentAfter = [move.commentAfter, cd.text].join(' '); }
            return arr; },
      peg$c296 = function(cm, me, cb, hm, nag, ca, cd, vari, all) { var arr = (all ? all : []);
            var move = {}; move.turn = 'b'; move.moveNumber = me;
            move.notation = hm; move.commentBefore = cb; move.commentAfter = ca; move.commentMove = cm;
            move.variations = (vari ? vari : []); arr.unshift(move); move.nag = (nag ? nag : null);
            move.commentDiag = cd;
            if (cd && cd.text) { move.commentAfter = [move.commentAfter, cd.text].join(' ').trim(); }
            return arr; },
      peg$c297 = function() { return ["1:0"]; },
      peg$c298 = function() { return ["0:1"]; },
      peg$c299 = function() { return ["1-0"]; },
      peg$c300 = function() { return ["0-1"]; },
      peg$c301 = function() { return ["1/2-1/2"]; },
      peg$c302 = function() { return ["*"]; },
      peg$c303 = function(cf, cfl) { var comm = cf; for (var i=0; i < cfl.length; i++) { comm += " " + cfl[i][1]}; return comm; },
      peg$c304 = function(cm) { return cm; },
      peg$c305 = /^[^\n\r]/,
      peg$c306 = peg$classExpectation(["\n", "\r"], true, false),
      peg$c307 = function(cm) { return cm.join(""); },
      peg$c308 = /^[^}]/,
      peg$c309 = peg$classExpectation(["}"], true, false),
      peg$c310 = function(cas, cm) { return {...cas, text: cm}; },
      peg$c311 = function(ca, cal) { var ret = { }; if (cal) { var o = cal[0]; return {...ca, ...o}; } return ca; },
      peg$c312 = function(caf) { var ret = {}; ret.colorFields = caf; return ret; },
      peg$c313 = function(caa) { var ret = {}; ret.colorArrows = caa; return ret; },
      peg$c314 = function(cac) { var ret = {}; ret.clock = cac; return ret; },
      peg$c315 = "%csl",
      peg$c316 = peg$literalExpectation("%csl", false),
      peg$c317 = function(cfs) { return cfs; },
      peg$c318 = "%cal",
      peg$c319 = peg$literalExpectation("%cal", false),
      peg$c320 = ",",
      peg$c321 = peg$literalExpectation(",", false),
      peg$c322 = function(cf, cfl) { var arr = []; arr.push(cf); for (var i=0; i < cfl.length; i++) { arr.push(cfl[i][2])}; return arr; },
      peg$c323 = function(col, f) { return col + f; },
      peg$c324 = function(col, ff, ft) { return col + ff + ft; },
      peg$c325 = "Y",
      peg$c326 = peg$literalExpectation("Y", false),
      peg$c327 = function() { return "Y"; },
      peg$c328 = "G",
      peg$c329 = peg$literalExpectation("G", false),
      peg$c330 = function() { return "G"; },
      peg$c331 = "R",
      peg$c332 = peg$literalExpectation("R", false),
      peg$c333 = function() { return "R"; },
      peg$c334 = "B",
      peg$c335 = peg$literalExpectation("B", false),
      peg$c336 = function() { return "B"; },
      peg$c337 = function(col, row) { return col + row; },
      peg$c338 = "{",
      peg$c339 = peg$literalExpectation("{", false),
      peg$c340 = "}",
      peg$c341 = peg$literalExpectation("}", false),
      peg$c342 = "[",
      peg$c343 = peg$literalExpectation("[", false),
      peg$c344 = "]",
      peg$c345 = peg$literalExpectation("]", false),
      peg$c346 = ";",
      peg$c347 = peg$literalExpectation(";", false),
      peg$c348 = "%",
      peg$c349 = peg$literalExpectation("%", false),
      peg$c350 = function(cc, cv) { var ret = {}; ret.type = cc; ret.value = cv; return ret; },
      peg$c351 = "clk",
      peg$c352 = peg$literalExpectation("clk", false),
      peg$c353 = function() { return "clk"; },
      peg$c354 = "egt",
      peg$c355 = peg$literalExpectation("egt", false),
      peg$c356 = function() { return "egt"; },
      peg$c357 = "emt",
      peg$c358 = peg$literalExpectation("emt", false),
      peg$c359 = function() { return "emt"; },
      peg$c360 = "mct",
      peg$c361 = peg$literalExpectation("mct", false),
      peg$c362 = function() { return "mct"; },
      peg$c363 = ":",
      peg$c364 = peg$literalExpectation(":", false),
      peg$c365 = function(h1, h2, m1, m2, s1, s2) { var ret = h1; if (h2) { ret += h2 }; ret += ":" + m1 + m2 + ":" + s1 + s2; return ret; },
      peg$c366 = function(d) { return d; },
      peg$c367 = function(vari, all) { var arr = (all ? all : []); arr.unshift(vari); return arr; },
      peg$c368 = "(",
      peg$c369 = peg$literalExpectation("(", false),
      peg$c370 = ")",
      peg$c371 = peg$literalExpectation(")", false),
      peg$c372 = function(num) { return num; },
      peg$c373 = peg$otherExpectation("integer"),
      peg$c374 = " ",
      peg$c375 = peg$literalExpectation(" ", false),
      peg$c376 = function() { return '';},
      peg$c377 = function(fig, disc, str, col, row, pr, ch) { var hm = {}; hm.fig = (fig ? fig : null); hm.disc =  (disc ? disc : null); hm.strike = (str ? str : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.promotion = pr; hm.notation = (fig ? fig : "") + (disc ? disc : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : ""); return hm; },
      peg$c378 = function(fig, cols, rows, str, col, row, pr, ch) { var hm = {}; hm.fig = (fig ? fig : null); hm.strike = (str =='x' ? str : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.notation = (fig && (fig!=='P') ? fig : "") + cols + rows + (str=='x' ? str : "-") + col  + row + (pr ? pr : "") + (ch ? ch : ""); hm.promotion = pr; return hm; },
      peg$c379 = function(fig, str, col, row, pr, ch) { var hm = {}; hm.fig = (fig ? fig : null); hm.strike = (str ? str : null); hm.col = col; hm.row = row; hm.check = (ch ? ch : null); hm.notation = (fig ? fig : "") + (str ? str : "") + col  + row + (pr ? pr : "") + (ch ? ch : ""); hm.promotion = pr; return hm; },
      peg$c380 = "O-O-O",
      peg$c381 = peg$literalExpectation("O-O-O", false),
      peg$c382 = function(ch) { var hm = {}; hm.notation = 'O-O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; },
      peg$c383 = "O-O",
      peg$c384 = peg$literalExpectation("O-O", false),
      peg$c385 = function(ch) { var hm = {}; hm.notation = 'O-O'+ (ch ? ch : ""); hm.check = (ch ? ch : null); return  hm; },
      peg$c386 = "+-",
      peg$c387 = peg$literalExpectation("+-", false),
      peg$c388 = "+",
      peg$c389 = peg$literalExpectation("+", false),
      peg$c390 = function(ch) { return ch[1]; },
      peg$c391 = "$$$",
      peg$c392 = peg$literalExpectation("$$$", false),
      peg$c393 = "#",
      peg$c394 = peg$literalExpectation("#", false),
      peg$c395 = "=",
      peg$c396 = peg$literalExpectation("=", false),
      peg$c397 = function(f) { return '=' + f; },
      peg$c398 = function(nag, nags) { var arr = (nags ? nags : []); arr.unshift(nag); return arr; },
      peg$c399 = "$",
      peg$c400 = peg$literalExpectation("$", false),
      peg$c401 = function(num) { return '$' + num; },
      peg$c402 = "!!",
      peg$c403 = peg$literalExpectation("!!", false),
      peg$c404 = function() { return '$3'; },
      peg$c405 = "??",
      peg$c406 = peg$literalExpectation("??", false),
      peg$c407 = function() { return '$4'; },
      peg$c408 = "!?",
      peg$c409 = peg$literalExpectation("!?", false),
      peg$c410 = function() { return '$5'; },
      peg$c411 = "?!",
      peg$c412 = peg$literalExpectation("?!", false),
      peg$c413 = function() { return '$6'; },
      peg$c414 = "!",
      peg$c415 = peg$literalExpectation("!", false),
      peg$c416 = function() { return '$1'; },
      peg$c417 = "?",
      peg$c418 = peg$literalExpectation("?", false),
      peg$c419 = function() { return '$2'; },
      peg$c420 = "\u203C",
      peg$c421 = peg$literalExpectation("\u203C", false),
      peg$c422 = "\u2047",
      peg$c423 = peg$literalExpectation("\u2047", false),
      peg$c424 = "\u2049",
      peg$c425 = peg$literalExpectation("\u2049", false),
      peg$c426 = "\u2048",
      peg$c427 = peg$literalExpectation("\u2048", false),
      peg$c428 = "\u25A1",
      peg$c429 = peg$literalExpectation("\u25A1", false),
      peg$c430 = function() { return '$7'; },
      peg$c431 = function() { return '$10'; },
      peg$c432 = "\u221E",
      peg$c433 = peg$literalExpectation("\u221E", false),
      peg$c434 = function() { return '$13'; },
      peg$c435 = "\u2A72",
      peg$c436 = peg$literalExpectation("\u2A72", false),
      peg$c437 = function() { return '$14'; },
      peg$c438 = "\u2A71",
      peg$c439 = peg$literalExpectation("\u2A71", false),
      peg$c440 = function() { return '$15';},
      peg$c441 = "\xB1",
      peg$c442 = peg$literalExpectation("\xB1", false),
      peg$c443 = function() { return '$16';},
      peg$c444 = "\u2213",
      peg$c445 = peg$literalExpectation("\u2213", false),
      peg$c446 = function() { return '$17';},
      peg$c447 = function() { return '$18';},
      peg$c448 = "-+",
      peg$c449 = peg$literalExpectation("-+", false),
      peg$c450 = function() { return '$19';},
      peg$c451 = "\u2A00",
      peg$c452 = peg$literalExpectation("\u2A00", false),
      peg$c453 = function() { return '$22'; },
      peg$c454 = "\u27F3",
      peg$c455 = peg$literalExpectation("\u27F3", false),
      peg$c456 = function() { return '$32'; },
      peg$c457 = "\u2192",
      peg$c458 = peg$literalExpectation("\u2192", false),
      peg$c459 = function() { return '$36'; },
      peg$c460 = "\u2191",
      peg$c461 = peg$literalExpectation("\u2191", false),
      peg$c462 = function() { return '$40'; },
      peg$c463 = "\u21C6",
      peg$c464 = peg$literalExpectation("\u21C6", false),
      peg$c465 = function() { return '$132'; },
      peg$c466 = "D",
      peg$c467 = peg$literalExpectation("D", false),
      peg$c468 = function() { return '$220'; },
      peg$c469 = /^[RNBQKP]/,
      peg$c470 = peg$classExpectation(["R", "N", "B", "Q", "K", "P"], false, false),
      peg$c471 = /^[RNBQ]/,
      peg$c472 = peg$classExpectation(["R", "N", "B", "Q"], false, false),
      peg$c473 = /^[a-h]/,
      peg$c474 = peg$classExpectation([["a", "h"]], false, false),
      peg$c475 = /^[1-8]/,
      peg$c476 = peg$classExpectation([["1", "8"]], false, false),
      peg$c477 = "x",
      peg$c478 = peg$literalExpectation("x", false),

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parsegames() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parsegame();
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$currPos;
        s6 = peg$parsewsp();
        if (s6 !== peg$FAILED) {
          s7 = peg$parsegame();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s5;
            s6 = peg$c0(s3, s7);
            s5 = s6;
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$currPos;
          s6 = peg$parsewsp();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsegame();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c0(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        }
        if (s4 !== peg$FAILED) {
          peg$savedPos = s2;
          s3 = peg$c1(s3, s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsegame() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parsetags();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgn();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c3(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsetags() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parsetag();
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$currPos;
        s6 = peg$parsews();
        if (s6 !== peg$FAILED) {
          s7 = peg$parsetag();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s5;
            s6 = peg$c0(s3, s7);
            s5 = s6;
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$currPos;
          s6 = peg$parsews();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsetag();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c0(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        }
        if (s4 !== peg$FAILED) {
          peg$savedPos = s2;
          s3 = peg$c4(s3, s4);
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c5(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsetag() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsebl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsetagKeyValue();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsebr();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsetagKeyValue() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseeventKey();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsestring();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c7(s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsesiteKey();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsews();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsestring();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c8(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsedateKey();
        if (s1 !== peg$FAILED) {
          s2 = peg$parsews();
          if (s2 !== peg$FAILED) {
            s3 = peg$parsedate();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c9(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseroundKey();
          if (s1 !== peg$FAILED) {
            s2 = peg$parsews();
            if (s2 !== peg$FAILED) {
              s3 = peg$parsestring();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parsewhiteTitleKey();
            if (s1 !== peg$FAILED) {
              s2 = peg$parsews();
              if (s2 !== peg$FAILED) {
                s3 = peg$parsestring();
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c11(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseblackTitleKey();
              if (s1 !== peg$FAILED) {
                s2 = peg$parsews();
                if (s2 !== peg$FAILED) {
                  s3 = peg$parsestring();
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c12(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsewhiteEloKey();
                if (s1 !== peg$FAILED) {
                  s2 = peg$parsews();
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parseintegerOrDash();
                    if (s3 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c13(s3);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$parseblackEloKey();
                  if (s1 !== peg$FAILED) {
                    s2 = peg$parsews();
                    if (s2 !== peg$FAILED) {
                      s3 = peg$parseintegerOrDash();
                      if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c14(s3);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parsewhiteUSCFKey();
                    if (s1 !== peg$FAILED) {
                      s2 = peg$parsews();
                      if (s2 !== peg$FAILED) {
                        s3 = peg$parseintegerString();
                        if (s3 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c15(s3);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      s1 = peg$parseblackUSCFKey();
                      if (s1 !== peg$FAILED) {
                        s2 = peg$parsews();
                        if (s2 !== peg$FAILED) {
                          s3 = peg$parseintegerString();
                          if (s3 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c16(s3);
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = peg$parsewhiteNAKey();
                        if (s1 !== peg$FAILED) {
                          s2 = peg$parsews();
                          if (s2 !== peg$FAILED) {
                            s3 = peg$parsestring();
                            if (s3 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c17(s3);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          s1 = peg$parseblackNAKey();
                          if (s1 !== peg$FAILED) {
                            s2 = peg$parsews();
                            if (s2 !== peg$FAILED) {
                              s3 = peg$parsestring();
                              if (s3 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c18(s3);
                                s0 = s1;
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                          if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            s1 = peg$parsewhiteTypeKey();
                            if (s1 !== peg$FAILED) {
                              s2 = peg$parsews();
                              if (s2 !== peg$FAILED) {
                                s3 = peg$parsestring();
                                if (s3 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c19(s3);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                            if (s0 === peg$FAILED) {
                              s0 = peg$currPos;
                              s1 = peg$parseblackTypeKey();
                              if (s1 !== peg$FAILED) {
                                s2 = peg$parsews();
                                if (s2 !== peg$FAILED) {
                                  s3 = peg$parsestring();
                                  if (s3 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c20(s3);
                                    s0 = s1;
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                              if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                s1 = peg$parsewhiteKey();
                                if (s1 !== peg$FAILED) {
                                  s2 = peg$parsews();
                                  if (s2 !== peg$FAILED) {
                                    s3 = peg$parsestring();
                                    if (s3 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c21(s3);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                                if (s0 === peg$FAILED) {
                                  s0 = peg$currPos;
                                  s1 = peg$parseblackKey();
                                  if (s1 !== peg$FAILED) {
                                    s2 = peg$parsews();
                                    if (s2 !== peg$FAILED) {
                                      s3 = peg$parsestring();
                                      if (s3 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c22(s3);
                                        s0 = s1;
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    s1 = peg$parseresultKey();
                                    if (s1 !== peg$FAILED) {
                                      s2 = peg$parsews();
                                      if (s2 !== peg$FAILED) {
                                        s3 = peg$parseresult();
                                        if (s3 !== peg$FAILED) {
                                          peg$savedPos = s0;
                                          s1 = peg$c23(s3);
                                          s0 = s1;
                                        } else {
                                          peg$currPos = s0;
                                          s0 = peg$FAILED;
                                        }
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                    if (s0 === peg$FAILED) {
                                      s0 = peg$currPos;
                                      s1 = peg$parseeventDateKey();
                                      if (s1 !== peg$FAILED) {
                                        s2 = peg$parsews();
                                        if (s2 !== peg$FAILED) {
                                          s3 = peg$parsedate();
                                          if (s3 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c24(s3);
                                            s0 = s1;
                                          } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                          }
                                        } else {
                                          peg$currPos = s0;
                                          s0 = peg$FAILED;
                                        }
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                      }
                                      if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        s1 = peg$parseeventSponsorKey();
                                        if (s1 !== peg$FAILED) {
                                          s2 = peg$parsews();
                                          if (s2 !== peg$FAILED) {
                                            s3 = peg$parsestring();
                                            if (s3 !== peg$FAILED) {
                                              peg$savedPos = s0;
                                              s1 = peg$c25(s3);
                                              s0 = s1;
                                            } else {
                                              peg$currPos = s0;
                                              s0 = peg$FAILED;
                                            }
                                          } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                          }
                                        } else {
                                          peg$currPos = s0;
                                          s0 = peg$FAILED;
                                        }
                                        if (s0 === peg$FAILED) {
                                          s0 = peg$currPos;
                                          s1 = peg$parsesectionKey();
                                          if (s1 !== peg$FAILED) {
                                            s2 = peg$parsews();
                                            if (s2 !== peg$FAILED) {
                                              s3 = peg$parsestring();
                                              if (s3 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c26(s3);
                                                s0 = s1;
                                              } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                              }
                                            } else {
                                              peg$currPos = s0;
                                              s0 = peg$FAILED;
                                            }
                                          } else {
                                            peg$currPos = s0;
                                            s0 = peg$FAILED;
                                          }
                                          if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            s1 = peg$parsestageKey();
                                            if (s1 !== peg$FAILED) {
                                              s2 = peg$parsews();
                                              if (s2 !== peg$FAILED) {
                                                s3 = peg$parsestring();
                                                if (s3 !== peg$FAILED) {
                                                  peg$savedPos = s0;
                                                  s1 = peg$c27(s3);
                                                  s0 = s1;
                                                } else {
                                                  peg$currPos = s0;
                                                  s0 = peg$FAILED;
                                                }
                                              } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                              }
                                            } else {
                                              peg$currPos = s0;
                                              s0 = peg$FAILED;
                                            }
                                            if (s0 === peg$FAILED) {
                                              s0 = peg$currPos;
                                              s1 = peg$parseboardKey();
                                              if (s1 !== peg$FAILED) {
                                                s2 = peg$parsews();
                                                if (s2 !== peg$FAILED) {
                                                  s3 = peg$parseintegerString();
                                                  if (s3 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c28(s3);
                                                    s0 = s1;
                                                  } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                  }
                                                } else {
                                                  peg$currPos = s0;
                                                  s0 = peg$FAILED;
                                                }
                                              } else {
                                                peg$currPos = s0;
                                                s0 = peg$FAILED;
                                              }
                                              if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                s1 = peg$parseopeningKey();
                                                if (s1 !== peg$FAILED) {
                                                  s2 = peg$parsews();
                                                  if (s2 !== peg$FAILED) {
                                                    s3 = peg$parsestring();
                                                    if (s3 !== peg$FAILED) {
                                                      peg$savedPos = s0;
                                                      s1 = peg$c29(s3);
                                                      s0 = s1;
                                                    } else {
                                                      peg$currPos = s0;
                                                      s0 = peg$FAILED;
                                                    }
                                                  } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                  }
                                                } else {
                                                  peg$currPos = s0;
                                                  s0 = peg$FAILED;
                                                }
                                                if (s0 === peg$FAILED) {
                                                  s0 = peg$currPos;
                                                  s1 = peg$parsevariationKey();
                                                  if (s1 !== peg$FAILED) {
                                                    s2 = peg$parsews();
                                                    if (s2 !== peg$FAILED) {
                                                      s3 = peg$parsestring();
                                                      if (s3 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c30(s3);
                                                        s0 = s1;
                                                      } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                      }
                                                    } else {
                                                      peg$currPos = s0;
                                                      s0 = peg$FAILED;
                                                    }
                                                  } else {
                                                    peg$currPos = s0;
                                                    s0 = peg$FAILED;
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    s1 = peg$parsesubVariationKey();
                                                    if (s1 !== peg$FAILED) {
                                                      s2 = peg$parsews();
                                                      if (s2 !== peg$FAILED) {
                                                        s3 = peg$parsestring();
                                                        if (s3 !== peg$FAILED) {
                                                          peg$savedPos = s0;
                                                          s1 = peg$c31(s3);
                                                          s0 = s1;
                                                        } else {
                                                          peg$currPos = s0;
                                                          s0 = peg$FAILED;
                                                        }
                                                      } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                      }
                                                    } else {
                                                      peg$currPos = s0;
                                                      s0 = peg$FAILED;
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      s0 = peg$currPos;
                                                      s1 = peg$parseecoKey();
                                                      if (s1 !== peg$FAILED) {
                                                        s2 = peg$parsews();
                                                        if (s2 !== peg$FAILED) {
                                                          s3 = peg$parsestring();
                                                          if (s3 !== peg$FAILED) {
                                                            peg$savedPos = s0;
                                                            s1 = peg$c32(s3);
                                                            s0 = s1;
                                                          } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                          }
                                                        } else {
                                                          peg$currPos = s0;
                                                          s0 = peg$FAILED;
                                                        }
                                                      } else {
                                                        peg$currPos = s0;
                                                        s0 = peg$FAILED;
                                                      }
                                                      if (s0 === peg$FAILED) {
                                                        s0 = peg$currPos;
                                                        s1 = peg$parsenicKey();
                                                        if (s1 !== peg$FAILED) {
                                                          s2 = peg$parsews();
                                                          if (s2 !== peg$FAILED) {
                                                            s3 = peg$parsestring();
                                                            if (s3 !== peg$FAILED) {
                                                              peg$savedPos = s0;
                                                              s1 = peg$c33(s3);
                                                              s0 = s1;
                                                            } else {
                                                              peg$currPos = s0;
                                                              s0 = peg$FAILED;
                                                            }
                                                          } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                          }
                                                        } else {
                                                          peg$currPos = s0;
                                                          s0 = peg$FAILED;
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                          s0 = peg$currPos;
                                                          s1 = peg$parsetimeKey();
                                                          if (s1 !== peg$FAILED) {
                                                            s2 = peg$parsews();
                                                            if (s2 !== peg$FAILED) {
                                                              s3 = peg$parsestring();
                                                              if (s3 !== peg$FAILED) {
                                                                peg$savedPos = s0;
                                                                s1 = peg$c34(s3);
                                                                s0 = s1;
                                                              } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                              }
                                                            } else {
                                                              peg$currPos = s0;
                                                              s0 = peg$FAILED;
                                                            }
                                                          } else {
                                                            peg$currPos = s0;
                                                            s0 = peg$FAILED;
                                                          }
                                                          if (s0 === peg$FAILED) {
                                                            s0 = peg$currPos;
                                                            s1 = peg$parseutcTimeKey();
                                                            if (s1 !== peg$FAILED) {
                                                              s2 = peg$parsews();
                                                              if (s2 !== peg$FAILED) {
                                                                s3 = peg$parsestring();
                                                                if (s3 !== peg$FAILED) {
                                                                  peg$savedPos = s0;
                                                                  s1 = peg$c35(s3);
                                                                  s0 = s1;
                                                                } else {
                                                                  peg$currPos = s0;
                                                                  s0 = peg$FAILED;
                                                                }
                                                              } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                              }
                                                            } else {
                                                              peg$currPos = s0;
                                                              s0 = peg$FAILED;
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                              s0 = peg$currPos;
                                                              s1 = peg$parseutcDateKey();
                                                              if (s1 !== peg$FAILED) {
                                                                s2 = peg$parsews();
                                                                if (s2 !== peg$FAILED) {
                                                                  s3 = peg$parsestring();
                                                                  if (s3 !== peg$FAILED) {
                                                                    peg$savedPos = s0;
                                                                    s1 = peg$c36(s3);
                                                                    s0 = s1;
                                                                  } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                  }
                                                                } else {
                                                                  peg$currPos = s0;
                                                                  s0 = peg$FAILED;
                                                                }
                                                              } else {
                                                                peg$currPos = s0;
                                                                s0 = peg$FAILED;
                                                              }
                                                              if (s0 === peg$FAILED) {
                                                                s0 = peg$currPos;
                                                                s1 = peg$parsetimeControlKey();
                                                                if (s1 !== peg$FAILED) {
                                                                  s2 = peg$parsews();
                                                                  if (s2 !== peg$FAILED) {
                                                                    s3 = peg$parsestring();
                                                                    if (s3 !== peg$FAILED) {
                                                                      peg$savedPos = s0;
                                                                      s1 = peg$c37(s3);
                                                                      s0 = s1;
                                                                    } else {
                                                                      peg$currPos = s0;
                                                                      s0 = peg$FAILED;
                                                                    }
                                                                  } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                  }
                                                                } else {
                                                                  peg$currPos = s0;
                                                                  s0 = peg$FAILED;
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                  s0 = peg$currPos;
                                                                  s1 = peg$parsesetUpKey();
                                                                  if (s1 !== peg$FAILED) {
                                                                    s2 = peg$parsews();
                                                                    if (s2 !== peg$FAILED) {
                                                                      s3 = peg$parsestring();
                                                                      if (s3 !== peg$FAILED) {
                                                                        peg$savedPos = s0;
                                                                        s1 = peg$c38(s3);
                                                                        s0 = s1;
                                                                      } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                      }
                                                                    } else {
                                                                      peg$currPos = s0;
                                                                      s0 = peg$FAILED;
                                                                    }
                                                                  } else {
                                                                    peg$currPos = s0;
                                                                    s0 = peg$FAILED;
                                                                  }
                                                                  if (s0 === peg$FAILED) {
                                                                    s0 = peg$currPos;
                                                                    s1 = peg$parsefenKey();
                                                                    if (s1 !== peg$FAILED) {
                                                                      s2 = peg$parsews();
                                                                      if (s2 !== peg$FAILED) {
                                                                        s3 = peg$parsestring();
                                                                        if (s3 !== peg$FAILED) {
                                                                          peg$savedPos = s0;
                                                                          s1 = peg$c39(s3);
                                                                          s0 = s1;
                                                                        } else {
                                                                          peg$currPos = s0;
                                                                          s0 = peg$FAILED;
                                                                        }
                                                                      } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                      }
                                                                    } else {
                                                                      peg$currPos = s0;
                                                                      s0 = peg$FAILED;
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                      s0 = peg$currPos;
                                                                      s1 = peg$parseterminationKey();
                                                                      if (s1 !== peg$FAILED) {
                                                                        s2 = peg$parsews();
                                                                        if (s2 !== peg$FAILED) {
                                                                          s3 = peg$parsestring();
                                                                          if (s3 !== peg$FAILED) {
                                                                            peg$savedPos = s0;
                                                                            s1 = peg$c40(s3);
                                                                            s0 = s1;
                                                                          } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                          }
                                                                        } else {
                                                                          peg$currPos = s0;
                                                                          s0 = peg$FAILED;
                                                                        }
                                                                      } else {
                                                                        peg$currPos = s0;
                                                                        s0 = peg$FAILED;
                                                                      }
                                                                      if (s0 === peg$FAILED) {
                                                                        s0 = peg$currPos;
                                                                        s1 = peg$parseanotatorKey();
                                                                        if (s1 !== peg$FAILED) {
                                                                          s2 = peg$parsews();
                                                                          if (s2 !== peg$FAILED) {
                                                                            s3 = peg$parsestring();
                                                                            if (s3 !== peg$FAILED) {
                                                                              peg$savedPos = s0;
                                                                              s1 = peg$c41(s3);
                                                                              s0 = s1;
                                                                            } else {
                                                                              peg$currPos = s0;
                                                                              s0 = peg$FAILED;
                                                                            }
                                                                          } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                          }
                                                                        } else {
                                                                          peg$currPos = s0;
                                                                          s0 = peg$FAILED;
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                          s0 = peg$currPos;
                                                                          s1 = peg$parsemodeKey();
                                                                          if (s1 !== peg$FAILED) {
                                                                            s2 = peg$parsews();
                                                                            if (s2 !== peg$FAILED) {
                                                                              s3 = peg$parsestring();
                                                                              if (s3 !== peg$FAILED) {
                                                                                peg$savedPos = s0;
                                                                                s1 = peg$c42(s3);
                                                                                s0 = s1;
                                                                              } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                              }
                                                                            } else {
                                                                              peg$currPos = s0;
                                                                              s0 = peg$FAILED;
                                                                            }
                                                                          } else {
                                                                            peg$currPos = s0;
                                                                            s0 = peg$FAILED;
                                                                          }
                                                                          if (s0 === peg$FAILED) {
                                                                            s0 = peg$currPos;
                                                                            s1 = peg$parseplyCountKey();
                                                                            if (s1 !== peg$FAILED) {
                                                                              s2 = peg$parsews();
                                                                              if (s2 !== peg$FAILED) {
                                                                                s3 = peg$parseintegerString();
                                                                                if (s3 !== peg$FAILED) {
                                                                                  peg$savedPos = s0;
                                                                                  s1 = peg$c43(s3);
                                                                                  s0 = s1;
                                                                                } else {
                                                                                  peg$currPos = s0;
                                                                                  s0 = peg$FAILED;
                                                                                }
                                                                              } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                              }
                                                                            } else {
                                                                              peg$currPos = s0;
                                                                              s0 = peg$FAILED;
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                              s0 = peg$currPos;
                                                                              s1 = peg$parsestringNoQuot();
                                                                              if (s1 !== peg$FAILED) {
                                                                                s2 = peg$parsews();
                                                                                if (s2 !== peg$FAILED) {
                                                                                  s3 = peg$parsestring();
                                                                                  if (s3 !== peg$FAILED) {
                                                                                    peg$savedPos = s0;
                                                                                    s1 = peg$c44(s1, s3);
                                                                                    s0 = s1;
                                                                                  } else {
                                                                                    peg$currPos = s0;
                                                                                    s0 = peg$FAILED;
                                                                                  }
                                                                                } else {
                                                                                  peg$currPos = s0;
                                                                                  s0 = peg$FAILED;
                                                                                }
                                                                              } else {
                                                                                peg$currPos = s0;
                                                                                s0 = peg$FAILED;
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseeventKey() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c45) {
      s0 = peg$c45;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c46); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c47) {
        s0 = peg$c47;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c48); }
      }
    }

    return s0;
  }

  function peg$parsesiteKey() {
    var s0;

    if (input.substr(peg$currPos, 4) === peg$c49) {
      s0 = peg$c49;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c50); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c51) {
        s0 = peg$c51;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
    }

    return s0;
  }

  function peg$parsedateKey() {
    var s0;

    if (input.substr(peg$currPos, 4) === peg$c53) {
      s0 = peg$c53;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c54); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c55) {
        s0 = peg$c55;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c56); }
      }
    }

    return s0;
  }

  function peg$parseroundKey() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c57) {
      s0 = peg$c57;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c58); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c59) {
        s0 = peg$c59;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
    }

    return s0;
  }

  function peg$parsewhiteKey() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c61) {
      s0 = peg$c61;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c62); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c61) {
        s0 = peg$c61;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c62); }
      }
    }

    return s0;
  }

  function peg$parseblackKey() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c63) {
      s0 = peg$c63;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c64); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c65) {
        s0 = peg$c65;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c66); }
      }
    }

    return s0;
  }

  function peg$parseresultKey() {
    var s0;

    if (input.substr(peg$currPos, 6) === peg$c67) {
      s0 = peg$c67;
      peg$currPos += 6;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c68); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 6) === peg$c69) {
        s0 = peg$c69;
        peg$currPos += 6;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
    }

    return s0;
  }

  function peg$parsewhiteTitleKey() {
    var s0;

    if (input.substr(peg$currPos, 10) === peg$c71) {
      s0 = peg$c71;
      peg$currPos += 10;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c72); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 10) === peg$c73) {
        s0 = peg$c73;
        peg$currPos += 10;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c74); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 10) === peg$c75) {
          s0 = peg$c75;
          peg$currPos += 10;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c76); }
        }
      }
    }

    return s0;
  }

  function peg$parseblackTitleKey() {
    var s0;

    if (input.substr(peg$currPos, 10) === peg$c77) {
      s0 = peg$c77;
      peg$currPos += 10;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c78); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 10) === peg$c79) {
        s0 = peg$c79;
        peg$currPos += 10;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c80); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 10) === peg$c81) {
          s0 = peg$c81;
          peg$currPos += 10;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c82); }
        }
      }
    }

    return s0;
  }

  function peg$parsewhiteEloKey() {
    var s0;

    if (input.substr(peg$currPos, 8) === peg$c83) {
      s0 = peg$c83;
      peg$currPos += 8;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c84); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 8) === peg$c85) {
        s0 = peg$c85;
        peg$currPos += 8;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c86); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c87) {
          s0 = peg$c87;
          peg$currPos += 8;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c88); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c89) {
            s0 = peg$c89;
            peg$currPos += 8;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c90); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseblackEloKey() {
    var s0;

    if (input.substr(peg$currPos, 8) === peg$c91) {
      s0 = peg$c91;
      peg$currPos += 8;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c92); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 8) === peg$c93) {
        s0 = peg$c93;
        peg$currPos += 8;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c95) {
          s0 = peg$c95;
          peg$currPos += 8;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c96); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c97) {
            s0 = peg$c97;
            peg$currPos += 8;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c98); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsewhiteUSCFKey() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c99) {
      s0 = peg$c99;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c100); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c101) {
        s0 = peg$c101;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c103) {
          s0 = peg$c103;
          peg$currPos += 9;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c104); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 9) === peg$c105) {
            s0 = peg$c105;
            peg$currPos += 9;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c106); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseblackUSCFKey() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c107) {
      s0 = peg$c107;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c108); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c109) {
        s0 = peg$c109;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c110); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c111) {
          s0 = peg$c111;
          peg$currPos += 9;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c112); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 9) === peg$c113) {
            s0 = peg$c113;
            peg$currPos += 9;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c114); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsewhiteNAKey() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c115) {
      s0 = peg$c115;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c116); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c117) {
        s0 = peg$c117;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c118); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c119) {
          s0 = peg$c119;
          peg$currPos += 7;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c120); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c121) {
            s0 = peg$c121;
            peg$currPos += 7;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c122); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseblackNAKey() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c123) {
      s0 = peg$c123;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c124); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c125) {
        s0 = peg$c125;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c126); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c127) {
          s0 = peg$c127;
          peg$currPos += 7;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c128); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c129) {
            s0 = peg$c129;
            peg$currPos += 7;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c130); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsewhiteTypeKey() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c131) {
      s0 = peg$c131;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c132); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c133) {
        s0 = peg$c133;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c134); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c135) {
          s0 = peg$c135;
          peg$currPos += 9;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c136); }
        }
      }
    }

    return s0;
  }

  function peg$parseblackTypeKey() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c137) {
      s0 = peg$c137;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c138); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c139) {
        s0 = peg$c139;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c140); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c141) {
          s0 = peg$c141;
          peg$currPos += 9;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c142); }
        }
      }
    }

    return s0;
  }

  function peg$parseeventDateKey() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c143) {
      s0 = peg$c143;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c144); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c145) {
        s0 = peg$c145;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c146); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c147) {
          s0 = peg$c147;
          peg$currPos += 9;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c148); }
        }
      }
    }

    return s0;
  }

  function peg$parseeventSponsorKey() {
    var s0;

    if (input.substr(peg$currPos, 12) === peg$c149) {
      s0 = peg$c149;
      peg$currPos += 12;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c150); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 12) === peg$c151) {
        s0 = peg$c151;
        peg$currPos += 12;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c152); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 12) === peg$c153) {
          s0 = peg$c153;
          peg$currPos += 12;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c154); }
        }
      }
    }

    return s0;
  }

  function peg$parsesectionKey() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c155) {
      s0 = peg$c155;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c156); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c157) {
        s0 = peg$c157;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c158); }
      }
    }

    return s0;
  }

  function peg$parsestageKey() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c159) {
      s0 = peg$c159;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c160); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c161) {
        s0 = peg$c161;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c162); }
      }
    }

    return s0;
  }

  function peg$parseboardKey() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c163) {
      s0 = peg$c163;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c164); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c165) {
        s0 = peg$c165;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c166); }
      }
    }

    return s0;
  }

  function peg$parseopeningKey() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c167) {
      s0 = peg$c167;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c168); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c169) {
        s0 = peg$c169;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c170); }
      }
    }

    return s0;
  }

  function peg$parsevariationKey() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c171) {
      s0 = peg$c171;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c172); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c173) {
        s0 = peg$c173;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c174); }
      }
    }

    return s0;
  }

  function peg$parsesubVariationKey() {
    var s0;

    if (input.substr(peg$currPos, 12) === peg$c175) {
      s0 = peg$c175;
      peg$currPos += 12;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c176); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 12) === peg$c177) {
        s0 = peg$c177;
        peg$currPos += 12;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c178); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 12) === peg$c179) {
          s0 = peg$c179;
          peg$currPos += 12;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c180); }
        }
      }
    }

    return s0;
  }

  function peg$parseecoKey() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c181) {
      s0 = peg$c181;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c182); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c183) {
        s0 = peg$c183;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c184); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c185) {
          s0 = peg$c185;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c186); }
        }
      }
    }

    return s0;
  }

  function peg$parsenicKey() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c187) {
      s0 = peg$c187;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c188); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c189) {
        s0 = peg$c189;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c190); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c191) {
          s0 = peg$c191;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c192); }
        }
      }
    }

    return s0;
  }

  function peg$parsetimeKey() {
    var s0;

    if (input.substr(peg$currPos, 4) === peg$c193) {
      s0 = peg$c193;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c194); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c195) {
        s0 = peg$c195;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c196); }
      }
    }

    return s0;
  }

  function peg$parseutcTimeKey() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c197) {
      s0 = peg$c197;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c198); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c199) {
        s0 = peg$c199;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c200); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c201) {
          s0 = peg$c201;
          peg$currPos += 7;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c202); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c203) {
            s0 = peg$c203;
            peg$currPos += 7;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c204); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c205) {
              s0 = peg$c205;
              peg$currPos += 7;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c206); }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseutcDateKey() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c207) {
      s0 = peg$c207;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c208); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c209) {
        s0 = peg$c209;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c210); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c211) {
          s0 = peg$c211;
          peg$currPos += 7;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c212); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c213) {
            s0 = peg$c213;
            peg$currPos += 7;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c214); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c215) {
              s0 = peg$c215;
              peg$currPos += 7;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c216); }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsetimeControlKey() {
    var s0;

    if (input.substr(peg$currPos, 11) === peg$c217) {
      s0 = peg$c217;
      peg$currPos += 11;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c218); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 11) === peg$c219) {
        s0 = peg$c219;
        peg$currPos += 11;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c220); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c221) {
          s0 = peg$c221;
          peg$currPos += 11;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c222); }
        }
      }
    }

    return s0;
  }

  function peg$parsesetUpKey() {
    var s0;

    if (input.substr(peg$currPos, 5) === peg$c223) {
      s0 = peg$c223;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c224); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c225) {
        s0 = peg$c225;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c226); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c227) {
          s0 = peg$c227;
          peg$currPos += 5;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c228); }
        }
      }
    }

    return s0;
  }

  function peg$parsefenKey() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c229) {
      s0 = peg$c229;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c230); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 3) === peg$c231) {
        s0 = peg$c231;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c232); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c233) {
          s0 = peg$c233;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c234); }
        }
      }
    }

    return s0;
  }

  function peg$parseterminationKey() {
    var s0;

    if (input.substr(peg$currPos, 11) === peg$c235) {
      s0 = peg$c235;
      peg$currPos += 11;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c236); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 11) === peg$c237) {
        s0 = peg$c237;
        peg$currPos += 11;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c238); }
      }
    }

    return s0;
  }

  function peg$parseanotatorKey() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c239) {
      s0 = peg$c239;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c240); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c241) {
        s0 = peg$c241;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c242); }
      }
    }

    return s0;
  }

  function peg$parsemodeKey() {
    var s0;

    if (input.substr(peg$currPos, 4) === peg$c243) {
      s0 = peg$c243;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c244); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c245) {
        s0 = peg$c245;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c246); }
      }
    }

    return s0;
  }

  function peg$parseplyCountKey() {
    var s0;

    if (input.substr(peg$currPos, 8) === peg$c247) {
      s0 = peg$c247;
      peg$currPos += 8;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c248); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 8) === peg$c249) {
        s0 = peg$c249;
        peg$currPos += 8;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c250); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c251) {
          s0 = peg$c251;
          peg$currPos += 8;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c252); }
        }
      }
    }

    return s0;
  }

  function peg$parsews() {
    var s0, s1;

    peg$silentFails++;
    s0 = [];
    if (peg$c254.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c255); }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (peg$c254.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c255); }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c253); }
    }

    return s0;
  }

  function peg$parsewsp() {
    var s0, s1;

    s0 = [];
    if (peg$c254.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c255); }
    }
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c254.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c255); }
        }
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseeol() {
    var s0, s1;

    s0 = [];
    if (peg$c256.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c257); }
    }
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c256.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c257); }
        }
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsestring() {
    var s0, s1, s2, s3;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parsequotation_mark();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsechar();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsechar();
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsequotation_mark();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c259(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c258); }
    }

    return s0;
  }

  function peg$parsestringNoQuot() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    if (peg$c260.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c261); }
    }
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      if (peg$c260.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c261); }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c259(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsequotation_mark() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 34) {
      s0 = peg$c262;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c263); }
    }

    return s0;
  }

  function peg$parsechar() {
    var s0;

    if (peg$c264.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c265); }
    }

    return s0;
  }

  function peg$parsedate() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = peg$parsequotation_mark();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      if (peg$c266.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c267); }
      }
      if (s3 !== peg$FAILED) {
        if (peg$c266.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c267); }
        }
        if (s4 !== peg$FAILED) {
          if (peg$c266.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c267); }
          }
          if (s5 !== peg$FAILED) {
            if (peg$c266.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c267); }
            }
            if (s6 !== peg$FAILED) {
              s3 = [s3, s4, s5, s6];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c268;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c269); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          if (peg$c266.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c267); }
          }
          if (s5 !== peg$FAILED) {
            if (peg$c266.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c267); }
            }
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s5 = peg$c268;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c269); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos;
              if (peg$c266.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c267); }
              }
              if (s7 !== peg$FAILED) {
                if (peg$c266.test(input.charAt(peg$currPos))) {
                  s8 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c267); }
                }
                if (s8 !== peg$FAILED) {
                  s7 = [s7, s8];
                  s6 = s7;
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsequotation_mark();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c270(s2, s4, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseresult() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsequotation_mark();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseinner_result();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsequotation_mark();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c271(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseinner_result() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c272) {
      s1 = peg$c272;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c273); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c274(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c275) {
        s1 = peg$c275;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c276); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c271(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c277) {
          s1 = peg$c277;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c278); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c271(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 3) === peg$c279) {
            s1 = peg$c279;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c280); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c271(s1);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c281) {
              s1 = peg$c281;
              peg$currPos += 7;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c282); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c271(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c283;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c284); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c271(s1);
              }
              s0 = s1;
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseintegerOrDash() {
    var s0, s1, s2, s3;

    s0 = peg$parseintegerString();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s2 = peg$c285;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c286); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseintegerString() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsequotation_mark();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c287.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c288); }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c287.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c288); }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsequotation_mark();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c289(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsepgn() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parsepgnStartWhite();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnBlack();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c290(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsepgnStartBlack();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsepgnWhite();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c291(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c292();
        }
        s0 = s1;
      }
    }

    return s0;
  }

  function peg$parsepgnStartWhite() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parsepgnWhite();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c293(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsepgnStartBlack() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parsepgnBlack();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c294(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsepgnWhite() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomments();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsemoveNumber();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsews();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecomments();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsews();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsehalfMove();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsews();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsenags();
                      if (s10 === peg$FAILED) {
                        s10 = null;
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsews();
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsecomments();
                          if (s12 === peg$FAILED) {
                            s12 = null;
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parsews();
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parsecommentDiag();
                              if (s14 === peg$FAILED) {
                                s14 = null;
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsews();
                                if (s15 !== peg$FAILED) {
                                  s16 = peg$parsevariationWhite();
                                  if (s16 === peg$FAILED) {
                                    s16 = null;
                                  }
                                  if (s16 !== peg$FAILED) {
                                    s17 = peg$parsepgnBlack();
                                    if (s17 === peg$FAILED) {
                                      s17 = null;
                                    }
                                    if (s17 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c295(s2, s4, s6, s8, s10, s12, s14, s16, s17);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseendGame();
    }

    return s0;
  }

  function peg$parsepgnBlack() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

    s0 = peg$currPos;
    s1 = peg$parsews();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomments();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsews();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsemoveNumber();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsews();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecomments();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsews();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsehalfMove();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsews();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsenags();
                      if (s10 === peg$FAILED) {
                        s10 = null;
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsews();
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsecomments();
                          if (s12 === peg$FAILED) {
                            s12 = null;
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parsews();
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parsecommentDiag();
                              if (s14 === peg$FAILED) {
                                s14 = null;
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsews();
                                if (s15 !== peg$FAILED) {
                                  s16 = peg$parsevariationBlack();
                                  if (s16 === peg$FAILED) {
                                    s16 = null;
                                  }
                                  if (s16 !== peg$FAILED) {
                                    s17 = peg$parsepgnWhite();
                                    if (s17 === peg$FAILED) {
                                      s17 = null;
                                    }
                                    if (s17 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c296(s2, s4, s6, s8, s10, s12, s14, s16, s17);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseendGame();
    }

    return s0;
  }

  function peg$parseendGame() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c275) {
      s1 = peg$c275;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c276); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c297();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c279) {
        s1 = peg$c279;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c280); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c298();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c272) {
          s1 = peg$c272;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c273); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c299();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 3) === peg$c277) {
            s1 = peg$c277;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c278); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c300();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c281) {
              s1 = peg$c281;
              peg$currPos += 7;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c282); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c301();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c283;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c284); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c302();
              }
              s0 = s1;
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsecomments() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsecomment();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parsews();
      if (s4 !== peg$FAILED) {
        s5 = peg$parsecomment();
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parsews();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsecomment();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c303(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecomment() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    s2 = peg$parsecommentDiag();
    peg$silentFails--;
    if (s2 === peg$FAILED) {
      s1 = void 0;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecl();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecommentText();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsecr();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c304(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsecommentEndOfLine();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c304(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parsecommentEndOfLine() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsesemicolon();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c305.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c306); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$c305.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c306); }
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseeol();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c307(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecommentText() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    if (peg$c308.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c309); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c308.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c309); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c307(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsecommentDiag() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$parsecl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecommentAnnotations();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecommentText();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecr();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c310(s3, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecommentAnnotations() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parsecommentAnnotation();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsecommentAnnotation();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsecommentAnnotation();
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c311(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecommentAnnotation() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parsecommentAnnotationFields();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c312(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsecommentAnnotationArrows();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c313(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsecommentAnnotationClock();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c314(s1);
        }
        s0 = s1;
      }
    }

    return s0;
  }

  function peg$parsecommentAnnotationFields() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsebl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c315) {
          s3 = peg$c315;
          peg$currPos += 4;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c316); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecolorFields();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsews();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsebr();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c317(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecommentAnnotationArrows() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsebl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c318) {
          s3 = peg$c318;
          peg$currPos += 4;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c319); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecolorArrows();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsews();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsebr();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c317(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecolorFields() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsecolorField();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c320;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c321); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parsews();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsecolorField();
            if (s7 !== peg$FAILED) {
              s5 = [s5, s6, s7];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c320;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c321); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parsews();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsecolorField();
              if (s7 !== peg$FAILED) {
                s5 = [s5, s6, s7];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c322(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecolorField() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parsecolor();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsefield();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c323(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecolorArrows() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parsecolorArrow();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c320;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c321); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parsews();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsecolorArrow();
            if (s7 !== peg$FAILED) {
              s5 = [s5, s6, s7];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c320;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c321); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parsews();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsecolorArrow();
              if (s7 !== peg$FAILED) {
                s5 = [s5, s6, s7];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c322(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecolorArrow() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsecolor();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsefield();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsefield();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c324(s1, s2, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecolor() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 89) {
      s1 = peg$c325;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c326); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c327();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 71) {
        s1 = peg$c328;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c329); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c330();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 82) {
          s1 = peg$c331;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c332); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c333();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 66) {
            s1 = peg$c334;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c335); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c336();
          }
          s0 = s1;
        }
      }
    }

    return s0;
  }

  function peg$parsefield() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parsecolumn();
    if (s1 !== peg$FAILED) {
      s2 = peg$parserow();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c337(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsecl() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 123) {
      s0 = peg$c338;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c339); }
    }

    return s0;
  }

  function peg$parsecr() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 125) {
      s0 = peg$c340;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c341); }
    }

    return s0;
  }

  function peg$parsebl() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 91) {
      s0 = peg$c342;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c343); }
    }

    return s0;
  }

  function peg$parsebr() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 93) {
      s0 = peg$c344;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c345); }
    }

    return s0;
  }

  function peg$parsesemicolon() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 59) {
      s0 = peg$c346;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c347); }
    }

    return s0;
  }

  function peg$parsecommentAnnotationClock() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = peg$parsebl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 37) {
          s3 = peg$c348;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c349); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseclockCommand();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsews();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseclockValue();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsews();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsebr();
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c350(s4, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseclockCommand() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c351) {
      s1 = peg$c351;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c352); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c353();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c354) {
        s1 = peg$c354;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c355); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c356();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c357) {
          s1 = peg$c357;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c358); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c359();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 3) === peg$c360) {
            s1 = peg$c360;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c361); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c362();
          }
          s0 = s1;
        }
      }
    }

    return s0;
  }

  function peg$parseclockValue() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = peg$parsedigit();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsedigit();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s3 = peg$c363;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c364); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsedigit();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsedigit();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 58) {
                s6 = peg$c363;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c364); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsedigit();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsedigit();
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c365(s1, s2, s4, s5, s7, s8);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedigit() {
    var s0, s1;

    s0 = peg$currPos;
    if (peg$c287.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c288); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c366(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsevariationWhite() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsepl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnWhite();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsepr();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsevariationWhite();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c367(s2, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsevariationBlack() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsepl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnStartBlack();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsepr();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsews();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsevariationBlack();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c367(s2, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsepl() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 40) {
      s0 = peg$c368;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c369); }
    }

    return s0;
  }

  function peg$parsepr() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 41) {
      s0 = peg$c370;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c371); }
    }

    return s0;
  }

  function peg$parsemoveNumber() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseinteger();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsedotOrWhitespace();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsedotOrWhitespace();
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c372(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsedot() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 46) {
      s0 = peg$c268;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c269); }
    }

    return s0;
  }

  function peg$parseinteger() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c287.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c288); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c287.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c288); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c289(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c373); }
    }

    return s0;
  }

  function peg$parsewhiteSpace() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    if (input.charCodeAt(peg$currPos) === 32) {
      s2 = peg$c374;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c375); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c374;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c375); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c376();
    }
    s0 = s1;

    return s0;
  }

  function peg$parsedotOrWhitespace() {
    var s0;

    s0 = peg$parsedot();
    if (s0 === peg$FAILED) {
      s0 = peg$parsewhiteSpace();
    }

    return s0;
  }

  function peg$parsehalfMove() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = peg$parsefigure();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      peg$silentFails++;
      s3 = peg$parsecheckdisc();
      peg$silentFails--;
      if (s3 !== peg$FAILED) {
        peg$currPos = s2;
        s2 = void 0;
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsediscriminator();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsestrike();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecolumn();
            if (s5 !== peg$FAILED) {
              s6 = peg$parserow();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsepromotion();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsecheck();
                  if (s8 === peg$FAILED) {
                    s8 = null;
                  }
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c377(s1, s3, s4, s5, s6, s7, s8);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsefigure();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsecolumn();
        if (s2 !== peg$FAILED) {
          s3 = peg$parserow();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsestrikeOrDash();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecolumn();
              if (s5 !== peg$FAILED) {
                s6 = peg$parserow();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsepromotion();
                  if (s7 === peg$FAILED) {
                    s7 = null;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsecheck();
                    if (s8 === peg$FAILED) {
                      s8 = null;
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c378(s1, s2, s3, s4, s5, s6, s7, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsefigure();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsestrike();
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsecolumn();
            if (s3 !== peg$FAILED) {
              s4 = peg$parserow();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsepromotion();
                if (s5 === peg$FAILED) {
                  s5 = null;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecheck();
                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c379(s1, s2, s3, s4, s5, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 5) === peg$c380) {
            s1 = peg$c380;
            peg$currPos += 5;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c381); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecheck();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c382(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c383) {
              s1 = peg$c383;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c384); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsecheck();
              if (s2 === peg$FAILED) {
                s2 = null;
              }
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c385(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsecheck() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$currPos;
    peg$silentFails++;
    if (input.substr(peg$currPos, 2) === peg$c386) {
      s3 = peg$c386;
      peg$currPos += 2;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c387); }
    }
    peg$silentFails--;
    if (s3 === peg$FAILED) {
      s2 = void 0;
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 43) {
        s3 = peg$c388;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c389); }
      }
      if (s3 !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c390(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c391) {
        s3 = peg$c391;
        peg$currPos += 3;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c392); }
      }
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = void 0;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 35) {
          s3 = peg$c393;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c394); }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c390(s1);
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parsepromotion() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 61) {
      s1 = peg$c395;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c396); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepromFigure();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c397(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsenags() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parsenag();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsews();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenags();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c398(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsenag() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 36) {
      s1 = peg$c399;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c400); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseinteger();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c401(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c402) {
        s1 = peg$c402;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c403); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c404();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c405) {
          s1 = peg$c405;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c406); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c407();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c408) {
            s1 = peg$c408;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c409); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c410();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c411) {
              s1 = peg$c411;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c412); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c413();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 33) {
                s1 = peg$c414;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c415); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c416();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 63) {
                  s1 = peg$c417;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c418); }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c419();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 8252) {
                    s1 = peg$c420;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c421); }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c404();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 8263) {
                      s1 = peg$c422;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c423); }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c407();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 8265) {
                        s1 = peg$c424;
                        peg$currPos++;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c425); }
                      }
                      if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c410();
                      }
                      s0 = s1;
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 8264) {
                          s1 = peg$c426;
                          peg$currPos++;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c427); }
                        }
                        if (s1 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c413();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 9633) {
                            s1 = peg$c428;
                            peg$currPos++;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c429); }
                          }
                          if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c430();
                          }
                          s0 = s1;
                          if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 61) {
                              s1 = peg$c395;
                              peg$currPos++;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c396); }
                            }
                            if (s1 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c431();
                            }
                            s0 = s1;
                            if (s0 === peg$FAILED) {
                              s0 = peg$currPos;
                              if (input.charCodeAt(peg$currPos) === 8734) {
                                s1 = peg$c432;
                                peg$currPos++;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c433); }
                              }
                              if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c434();
                              }
                              s0 = s1;
                              if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 10866) {
                                  s1 = peg$c435;
                                  peg$currPos++;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c436); }
                                }
                                if (s1 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c437();
                                }
                                s0 = s1;
                                if (s0 === peg$FAILED) {
                                  s0 = peg$currPos;
                                  if (input.charCodeAt(peg$currPos) === 10865) {
                                    s1 = peg$c438;
                                    peg$currPos++;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c439); }
                                  }
                                  if (s1 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c440();
                                  }
                                  s0 = s1;
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    if (input.charCodeAt(peg$currPos) === 177) {
                                      s1 = peg$c441;
                                      peg$currPos++;
                                    } else {
                                      s1 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c442); }
                                    }
                                    if (s1 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c443();
                                    }
                                    s0 = s1;
                                    if (s0 === peg$FAILED) {
                                      s0 = peg$currPos;
                                      if (input.charCodeAt(peg$currPos) === 8723) {
                                        s1 = peg$c444;
                                        peg$currPos++;
                                      } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c445); }
                                      }
                                      if (s1 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c446();
                                      }
                                      s0 = s1;
                                      if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        if (input.substr(peg$currPos, 2) === peg$c386) {
                                          s1 = peg$c386;
                                          peg$currPos += 2;
                                        } else {
                                          s1 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c387); }
                                        }
                                        if (s1 !== peg$FAILED) {
                                          peg$savedPos = s0;
                                          s1 = peg$c447();
                                        }
                                        s0 = s1;
                                        if (s0 === peg$FAILED) {
                                          s0 = peg$currPos;
                                          if (input.substr(peg$currPos, 2) === peg$c448) {
                                            s1 = peg$c448;
                                            peg$currPos += 2;
                                          } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c449); }
                                          }
                                          if (s1 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c450();
                                          }
                                          s0 = s1;
                                          if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            if (input.charCodeAt(peg$currPos) === 10752) {
                                              s1 = peg$c451;
                                              peg$currPos++;
                                            } else {
                                              s1 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c452); }
                                            }
                                            if (s1 !== peg$FAILED) {
                                              peg$savedPos = s0;
                                              s1 = peg$c453();
                                            }
                                            s0 = s1;
                                            if (s0 === peg$FAILED) {
                                              s0 = peg$currPos;
                                              if (input.charCodeAt(peg$currPos) === 10227) {
                                                s1 = peg$c454;
                                                peg$currPos++;
                                              } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c455); }
                                              }
                                              if (s1 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c456();
                                              }
                                              s0 = s1;
                                              if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                if (input.charCodeAt(peg$currPos) === 8594) {
                                                  s1 = peg$c457;
                                                  peg$currPos++;
                                                } else {
                                                  s1 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c458); }
                                                }
                                                if (s1 !== peg$FAILED) {
                                                  peg$savedPos = s0;
                                                  s1 = peg$c459();
                                                }
                                                s0 = s1;
                                                if (s0 === peg$FAILED) {
                                                  s0 = peg$currPos;
                                                  if (input.charCodeAt(peg$currPos) === 8593) {
                                                    s1 = peg$c460;
                                                    peg$currPos++;
                                                  } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c461); }
                                                  }
                                                  if (s1 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c462();
                                                  }
                                                  s0 = s1;
                                                  if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    if (input.charCodeAt(peg$currPos) === 8646) {
                                                      s1 = peg$c463;
                                                      peg$currPos++;
                                                    } else {
                                                      s1 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c464); }
                                                    }
                                                    if (s1 !== peg$FAILED) {
                                                      peg$savedPos = s0;
                                                      s1 = peg$c465();
                                                    }
                                                    s0 = s1;
                                                    if (s0 === peg$FAILED) {
                                                      s0 = peg$currPos;
                                                      if (input.charCodeAt(peg$currPos) === 68) {
                                                        s1 = peg$c466;
                                                        peg$currPos++;
                                                      } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c467); }
                                                      }
                                                      if (s1 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c468();
                                                      }
                                                      s0 = s1;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsediscriminator() {
    var s0;

    s0 = peg$parsecolumn();
    if (s0 === peg$FAILED) {
      s0 = peg$parserow();
    }

    return s0;
  }

  function peg$parsecheckdisc() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parsediscriminator();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsestrike();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecolumn();
        if (s3 !== peg$FAILED) {
          s4 = peg$parserow();
          if (s4 !== peg$FAILED) {
            s1 = [s1, s2, s3, s4];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsefigure() {
    var s0;

    if (peg$c469.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c470); }
    }

    return s0;
  }

  function peg$parsepromFigure() {
    var s0;

    if (peg$c471.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c472); }
    }

    return s0;
  }

  function peg$parsecolumn() {
    var s0;

    if (peg$c473.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c474); }
    }

    return s0;
  }

  function peg$parserow() {
    var s0;

    if (peg$c475.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c476); }
    }

    return s0;
  }

  function peg$parsestrike() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 120) {
      s0 = peg$c477;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c478); }
    }

    return s0;
  }

  function peg$parsestrikeOrDash() {
    var s0;

    if (input.charCodeAt(peg$currPos) === 120) {
      s0 = peg$c477;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c478); }
    }
    if (s0 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 45) {
        s0 = peg$c285;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c286); }
      }
    }

    return s0;
  }


      function makeInteger(o) {
          return parseInt(o.join(""), 10);
      }


  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};

},{}],4:[function(require,module,exports){
const parser =  require('./_pgn-parser.js')

/**
 * Patches the original function, to avoid empty games. May include additional functionality
 * for understanding parse errors later.
 */
const parse = function(input, options) {
    // Had to trim the grammar to allow no whitespace after a game, this is consumed only when read many games
    // Therefore the strings are trimmed here.
    if (! options || (options.startRule === 'pgn') || (options.startRule === 'game')) {
        input = input.trim()
    }
    let result = parser.parse(input, options)
    if (options && (options.startRule === 'games')) {
        // result should be an array of games. Check the last game, if it is empty, and remove it then
        if (! Array.isArray(result)) return result
        if (result.length === 0) return result
        let last = result.pop()
        if ( (Object.keys(last.tags).length > 0) || (last.moves.length > 0) ) {
            result.push(last)
        }
        return result
    }
    return result
}

module.exports = {
  SyntaxError: parser.SyntaxError,
  parse:       parse
};

},{"./_pgn-parser.js":3}],5:[function(require,module,exports){
var util = require('./util');

// https://gist.github.com/gre/1650294
var easing = {
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
};

function makePiece(k, piece, invert) {
  var key = invert ? util.invertKey(k) : k;
  return {
    key: key,
    pos: util.key2pos(key),
    role: piece.role,
    color: piece.color
  };
}

function samePiece(p1, p2) {
  return p1.role === p2.role && p1.color === p2.color;
}

function closer(piece, pieces) {
  return pieces.sort(function(p1, p2) {
    return util.distance(piece.pos, p1.pos) - util.distance(piece.pos, p2.pos);
  })[0];
}

function computePlan(prev, current) {
  var bounds = current.bounds(),
    width = bounds.width / 8,
    height = bounds.height / 8,
    anims = {},
    animedOrigs = [],
    fadings = [],
    missings = [],
    news = [],
    invert = prev.orientation !== current.orientation,
    prePieces = {},
    white = current.orientation === 'white';
  for (var pk in prev.pieces) {
    var piece = makePiece(pk, prev.pieces[pk], invert);
    prePieces[piece.key] = piece;
  }
  for (var i = 0; i < util.allKeys.length; i++) {
    var key = util.allKeys[i];
    if (key !== current.movable.dropped[1]) {
      var curP = current.pieces[key];
      var preP = prePieces[key];
      if (curP) {
        if (preP) {
          if (!samePiece(curP, preP)) {
            missings.push(preP);
            news.push(makePiece(key, curP, false));
          }
        } else
          news.push(makePiece(key, curP, false));
      } else if (preP)
        missings.push(preP);
    }
  }
  news.forEach(function(newP) {
    var preP = closer(newP, missings.filter(util.partial(samePiece, newP)));
    if (preP) {
      var orig = white ? preP.pos : newP.pos;
      var dest = white ? newP.pos : preP.pos;
      var vector = [(orig[0] - dest[0]) * width, (dest[1] - orig[1]) * height];
      anims[newP.key] = [vector, vector];
      animedOrigs.push(preP.key);
    }
  });
  missings.forEach(function(p) {
    if (p.key !== current.movable.dropped[0] && !util.containsX(animedOrigs, p.key)) {
      fadings.push({
        piece: {
          role: p.role,
          color: p.color
        },
        left: 12.5 * (white ? (p.pos[0] - 1) : (8 - p.pos[0])) + '%',
        bottom: 12.5 * (white ? (p.pos[1] - 1) : (8 - p.pos[1])) + '%',
        opacity: 1
      });
    }
  });

  return {
    anims: anims,
    fadings: fadings
  };
}

function roundBy(n, by) {
  return Math.round(n * by) / by;
}

function go(data) {
  if (!data.animation.current.start) return; // animation was canceled
  var rest = 1 - (new Date().getTime() - data.animation.current.start) / data.animation.current.duration;
  if (rest <= 0) {
    data.animation.current = {};
    data.render();
  } else {
    var ease = easing.easeInOutCubic(rest);
    for (var key in data.animation.current.anims) {
      var cfg = data.animation.current.anims[key];
      cfg[1] = [roundBy(cfg[0][0] * ease, 10), roundBy(cfg[0][1] * ease, 10)];
    }
    for (var i in data.animation.current.fadings) {
      data.animation.current.fadings[i].opacity = roundBy(ease, 100);
    }
    data.render();
    util.requestAnimationFrame(function() {
      go(data);
    });
  }
}

function animate(transformation, data) {
  // clone data
  var prev = {
    orientation: data.orientation,
    pieces: {}
  };
  // clone pieces
  for (var key in data.pieces) {
    prev.pieces[key] = {
      role: data.pieces[key].role,
      color: data.pieces[key].color
    };
  }
  var result = transformation();
  var plan = computePlan(prev, data);
  if (Object.keys(plan.anims).length > 0 || plan.fadings.length > 0) {
    var alreadyRunning = data.animation.current.start;
    data.animation.current = {
      start: new Date().getTime(),
      duration: data.animation.duration,
      anims: plan.anims,
      fadings: plan.fadings
    };
    if (!alreadyRunning) go(data);
  } else {
    // don't animate, just render right away
    data.renderRAF();
  }
  return result;
}

// transformation is a function
// accepts board data and any number of arguments,
// and mutates the board.
module.exports = function(transformation, data, skip) {
  return function() {
    var transformationArgs = [data].concat(Array.prototype.slice.call(arguments, 0));
    if (!data.render) return transformation.apply(null, transformationArgs);
    else if (data.animation.enabled && !skip)
      return animate(util.partialApply(transformation, transformationArgs), data);
    else {
      var result = transformation.apply(null, transformationArgs);
      data.renderRAF();
      return result;
    }
  };
};

},{"./util":18}],6:[function(require,module,exports){
var board = require('./board');

module.exports = function(controller) {

  return {
    set: controller.set,
    toggleOrientation: controller.toggleOrientation,
    getOrientation: function () {
      return controller.data.orientation;
    },
    getPieces: function() {
      return controller.data.pieces;
    },
    getMaterialDiff: function() {
      return board.getMaterialDiff(controller.data);
    },
    getFen: controller.getFen,
    dump: function() {
      return controller.data;
    },
    move: controller.apiMove,
    newPiece: controller.apiNewPiece,
    setPieces: controller.setPieces,
    setCheck: controller.setCheck,
    playPremove: controller.playPremove,
    playPredrop: controller.playPredrop,
    cancelPremove: controller.cancelPremove,
    cancelPredrop: controller.cancelPredrop,
    cancelMove: controller.cancelMove,
    stop: controller.stop,
    explode: controller.explode,
    setAutoShapes: controller.setAutoShapes,
    setShapes: controller.setShapes,
    data: controller.data // directly exposes chessground state for more messing around
  };
};

},{"./board":7}],7:[function(require,module,exports){
var util = require('./util');
var premove = require('./premove');
var anim = require('./anim');
var hold = require('./hold');

function callUserFunction(f) {
  setTimeout(f, 1);
}

function toggleOrientation(data) {
  data.orientation = util.opposite(data.orientation);
}

function reset(data) {
  data.lastMove = null;
  setSelected(data, null);
  unsetPremove(data);
  unsetPredrop(data);
}

function setPieces(data, pieces) {
  Object.keys(pieces).forEach(function(key) {
    if (pieces[key]) data.pieces[key] = pieces[key];
    else delete data.pieces[key];
  });
  data.movable.dropped = [];
}

function setCheck(data, color) {
  var checkColor = color || data.turnColor;
  Object.keys(data.pieces).forEach(function(key) {
    if (data.pieces[key].color === checkColor && data.pieces[key].role === 'king') data.check = key;
  });
}

function setPremove(data, orig, dest) {
  unsetPredrop(data);
  data.premovable.current = [orig, dest];
  callUserFunction(util.partial(data.premovable.events.set, orig, dest));
}

function unsetPremove(data) {
  if (data.premovable.current) {
    data.premovable.current = null;
    callUserFunction(data.premovable.events.unset);
  }
}

function setPredrop(data, role, key) {
  unsetPremove(data);
  data.predroppable.current = {
    role: role,
    key: key
  };
  callUserFunction(util.partial(data.predroppable.events.set, role, key));
}

function unsetPredrop(data) {
  if (data.predroppable.current.key) {
    data.predroppable.current = {};
    callUserFunction(data.predroppable.events.unset);
  }
}

function tryAutoCastle(data, orig, dest) {
  if (!data.autoCastle) return;
  var king = data.pieces[dest];
  if (king.role !== 'king') return;
  var origPos = util.key2pos(orig);
  if (origPos[0] !== 5) return;
  if (origPos[1] !== 1 && origPos[1] !== 8) return;
  var destPos = util.key2pos(dest),
    oldRookPos, newRookPos, newKingPos;
  if (destPos[0] === 7 || destPos[0] === 8) {
    oldRookPos = util.pos2key([8, origPos[1]]);
    newRookPos = util.pos2key([6, origPos[1]]);
    newKingPos = util.pos2key([7, origPos[1]]);
  } else if (destPos[0] === 3 || destPos[0] === 1) {
    oldRookPos = util.pos2key([1, origPos[1]]);
    newRookPos = util.pos2key([4, origPos[1]]);
    newKingPos = util.pos2key([3, origPos[1]]);
  } else return;
  delete data.pieces[orig];
  delete data.pieces[dest];
  delete data.pieces[oldRookPos];
  data.pieces[newKingPos] = {
    role: 'king',
    color: king.color
  };
  data.pieces[newRookPos] = {
    role: 'rook',
    color: king.color
  };
}

function baseMove(data, orig, dest) {
  var success = anim(function() {
    if (orig === dest || !data.pieces[orig]) return false;
    var captured = (
      data.pieces[dest] &&
      data.pieces[dest].color !== data.pieces[orig].color
    ) ? data.pieces[dest] : null;
    callUserFunction(util.partial(data.events.move, orig, dest, captured));
    data.pieces[dest] = data.pieces[orig];
    delete data.pieces[orig];
    data.lastMove = [orig, dest];
    data.check = null;
    tryAutoCastle(data, orig, dest);
    callUserFunction(data.events.change);
    return true;
  }, data)();
  if (success) data.movable.dropped = [];
  return success;
}

function baseNewPiece(data, piece, key) {
  if (data.pieces[key]) return false;
  callUserFunction(util.partial(data.events.dropNewPiece, piece, key));
  data.pieces[key] = piece;
  data.lastMove = [key, key];
  data.check = null;
  callUserFunction(data.events.change);
  data.movable.dropped = [];
  data.movable.dests = {};
  data.turnColor = util.opposite(data.turnColor);
  data.renderRAF();
  return true;
}

function baseUserMove(data, orig, dest) {
  var result = baseMove(data, orig, dest);
  if (result) {
    data.movable.dests = {};
    data.turnColor = util.opposite(data.turnColor);
  }
  return result;
}

function apiMove(data, orig, dest) {
  return baseMove(data, orig, dest);
}

function apiNewPiece(data, piece, key) {
  return baseNewPiece(data, piece, key);
}

function userMove(data, orig, dest) {
  if (!dest) {
    hold.cancel();
    setSelected(data, null);
    if (data.movable.dropOff === 'trash') {
      delete data.pieces[orig];
      callUserFunction(data.events.change);
    }
  } else if (canMove(data, orig, dest)) {
    if (baseUserMove(data, orig, dest)) {
      var holdTime = hold.stop();
      setSelected(data, null);
      callUserFunction(util.partial(data.movable.events.after, orig, dest, {
        premove: false,
        holdTime: holdTime
      }));
      return true;
    }
  } else if (canPremove(data, orig, dest)) {
    setPremove(data, orig, dest);
    setSelected(data, null);
  } else if (isMovable(data, dest) || isPremovable(data, dest)) {
    setSelected(data, dest);
    hold.start();
  } else setSelected(data, null);
}

function dropNewPiece(data, orig, dest) {
  if (canDrop(data, orig, dest)) {
    var piece = data.pieces[orig];
    delete data.pieces[orig];
    baseNewPiece(data, piece, dest);
    data.movable.dropped = [];
    callUserFunction(util.partial(data.movable.events.afterNewPiece, piece.role, dest, {
      predrop: false
    }));
  } else if (canPredrop(data, orig, dest)) {
    setPredrop(data, data.pieces[orig].role, dest);
  } else {
    unsetPremove(data);
    unsetPredrop(data);
  }
  delete data.pieces[orig];
  setSelected(data, null);
}

function selectSquare(data, key) {
  if (data.selected) {
    if (key) {
      if (data.selectable.enabled && data.selected !== key) {
        if (userMove(data, data.selected, key)) data.stats.dragged = false;
      } else hold.start();
    } else {
      setSelected(data, null);
      hold.cancel();
    }
  } else if (isMovable(data, key) || isPremovable(data, key)) {
    setSelected(data, key);
    hold.start();
  }
  if (key) callUserFunction(util.partial(data.events.select, key));
}

function setSelected(data, key) {
  data.selected = key;
  if (key && isPremovable(data, key))
    data.premovable.dests = premove(data.pieces, key, data.premovable.castle);
  else
    data.premovable.dests = null;
}

function isMovable(data, orig) {
  var piece = data.pieces[orig];
  return piece && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color &&
      data.turnColor === piece.color
    ));
}

function canMove(data, orig, dest) {
  return orig !== dest && isMovable(data, orig) && (
    data.movable.free || util.containsX(data.movable.dests[orig], dest)
  );
}

function canDrop(data, orig, dest) {
  var piece = data.pieces[orig];
  return piece && dest && (orig === dest || !data.pieces[dest]) && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color &&
      data.turnColor === piece.color
    ));
}


function isPremovable(data, orig) {
  var piece = data.pieces[orig];
  return piece && data.premovable.enabled &&
    data.movable.color === piece.color &&
    data.turnColor !== piece.color;
}

function canPremove(data, orig, dest) {
  return orig !== dest &&
    isPremovable(data, orig) &&
    util.containsX(premove(data.pieces, orig, data.premovable.castle), dest);
}

function canPredrop(data, orig, dest) {
  var piece = data.pieces[orig];
  return piece && dest &&
    (!data.pieces[dest] || data.pieces[dest].color !== data.movable.color) &&
    data.predroppable.enabled &&
    (piece.role !== 'pawn' || (dest[1] !== '1' && dest[1] !== '8')) &&
    data.movable.color === piece.color &&
    data.turnColor !== piece.color;
}

function isDraggable(data, orig) {
  var piece = data.pieces[orig];
  return piece && data.draggable.enabled && (
    data.movable.color === 'both' || (
      data.movable.color === piece.color && (
        data.turnColor === piece.color || data.premovable.enabled
      )
    )
  );
}

function playPremove(data) {
  var move = data.premovable.current;
  if (!move) return;
  var orig = move[0],
    dest = move[1],
    success = false;
  if (canMove(data, orig, dest)) {
    if (baseUserMove(data, orig, dest)) {
      callUserFunction(util.partial(data.movable.events.after, orig, dest, {
        premove: true
      }));
      success = true;
    }
  }
  unsetPremove(data);
  return success;
}

function playPredrop(data, validate) {
  var drop = data.predroppable.current,
    success = false;
  if (!drop.key) return;
  if (validate(drop)) {
    var piece = {
      role: drop.role,
      color: data.movable.color
    };
    if (baseNewPiece(data, piece, drop.key)) {
      callUserFunction(util.partial(data.movable.events.afterNewPiece, drop.role, drop.key, {
        predrop: true
      }));
      success = true;
    }
  }
  unsetPredrop(data);
  return success;
}

function cancelMove(data) {
  unsetPremove(data);
  unsetPredrop(data);
  selectSquare(data, null);
}

function stop(data) {
  data.movable.color = null;
  data.movable.dests = {};
  cancelMove(data);
}

function getKeyAtDomPos(data, pos, bounds) {
  if (!bounds && !data.bounds) return;
  bounds = bounds || data.bounds(); // use provided value, or compute it
  var file = Math.ceil(8 * ((pos[0] - bounds.left) / bounds.width));
  file = data.orientation === 'white' ? file : 9 - file;
  var rank = Math.ceil(8 - (8 * ((pos[1] - bounds.top) / bounds.height)));
  rank = data.orientation === 'white' ? rank : 9 - rank;
  if (file > 0 && file < 9 && rank > 0 && rank < 9) return util.pos2key([file, rank]);
}

// {white: {pawn: 3 queen: 1}, black: {bishop: 2}}
function getMaterialDiff(data) {
  var counts = {
    king: 0,
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    pawn: 0
  };
  for (var k in data.pieces) {
    var p = data.pieces[k];
    counts[p.role] += ((p.color === 'white') ? 1 : -1);
  }
  var diff = {
    white: {},
    black: {}
  };
  for (var role in counts) {
    var c = counts[role];
    if (c > 0) diff.white[role] = c;
    else if (c < 0) diff.black[role] = -c;
  }
  return diff;
}

var pieceScores = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};

function getScore(data) {
  var score = 0;
  for (var k in data.pieces) {
    score += pieceScores[data.pieces[k].role] * (data.pieces[k].color === 'white' ? 1 : -1);
  }
  return score;
}

module.exports = {
  reset: reset,
  toggleOrientation: toggleOrientation,
  setPieces: setPieces,
  setCheck: setCheck,
  selectSquare: selectSquare,
  setSelected: setSelected,
  isDraggable: isDraggable,
  canMove: canMove,
  userMove: userMove,
  dropNewPiece: dropNewPiece,
  apiMove: apiMove,
  apiNewPiece: apiNewPiece,
  playPremove: playPremove,
  playPredrop: playPredrop,
  unsetPremove: unsetPremove,
  unsetPredrop: unsetPredrop,
  cancelMove: cancelMove,
  stop: stop,
  getKeyAtDomPos: getKeyAtDomPos,
  getMaterialDiff: getMaterialDiff,
  getScore: getScore
};

},{"./anim":5,"./hold":14,"./premove":16,"./util":18}],8:[function(require,module,exports){
var merge = require('merge');
var board = require('./board');
var fen = require('./fen');

module.exports = function(data, config) {

  if (!config) return;

  // don't merge destinations. Just override.
  if (config.movable && config.movable.dests) delete data.movable.dests;

  merge.recursive(data, config);

  // if a fen was provided, replace the pieces
  if (data.fen) {
    data.pieces = fen.read(data.fen);
    data.check = config.check;
    data.drawable.shapes = [];
    delete data.fen;
  }

  if (data.check === true) board.setCheck(data);

  // forget about the last dropped piece
  data.movable.dropped = [];

  // fix move/premove dests
  if (data.selected) board.setSelected(data, data.selected);

  // no need for such short animations
  if (!data.animation.duration || data.animation.duration < 10)
    data.animation.enabled = false;
};

},{"./board":7,"./fen":13,"merge":20}],9:[function(require,module,exports){
var board = require('./board');
var data = require('./data');
var fen = require('./fen');
var configure = require('./configure');
var anim = require('./anim');
var drag = require('./drag');

module.exports = function(cfg) {

  this.data = data(cfg);

  this.vm = {
    exploding: false
  };

  this.getFen = function() {
    return fen.write(this.data.pieces);
  }.bind(this);

  this.set = anim(configure, this.data);

  this.toggleOrientation = anim(board.toggleOrientation, this.data);

  this.setPieces = anim(board.setPieces, this.data);

  this.selectSquare = anim(board.selectSquare, this.data, true);

  this.apiMove = anim(board.apiMove, this.data);

  this.apiNewPiece = anim(board.apiNewPiece, this.data);

  this.playPremove = anim(board.playPremove, this.data);

  this.playPredrop = anim(board.playPredrop, this.data);

  this.cancelPremove = anim(board.unsetPremove, this.data, true);

  this.cancelPredrop = anim(board.unsetPredrop, this.data, true);

  this.setCheck = anim(board.setCheck, this.data, true);

  this.cancelMove = anim(function(data) {
    board.cancelMove(data);
    drag.cancel(data);
  }.bind(this), this.data, true);

  this.stop = anim(function(data) {
    board.stop(data);
    drag.cancel(data);
  }.bind(this), this.data, true);

  this.explode = function(keys) {
    if (!this.data.render) return;
    this.vm.exploding = {
      stage: 1,
      keys: keys
    };
    this.data.renderRAF();
    setTimeout(function() {
      this.vm.exploding.stage = 2;
      this.data.renderRAF();
      setTimeout(function() {
        this.vm.exploding = false;
        this.data.renderRAF();
      }.bind(this), 120);
    }.bind(this), 120);
  }.bind(this);

  this.setAutoShapes = function(shapes) {
    anim(function(data) {
      data.drawable.autoShapes = shapes;
    }, this.data, false)();
  }.bind(this);

  this.setShapes = function(shapes) {
    anim(function(data) {
      data.drawable.shapes = shapes;
    }, this.data, false)();
  }.bind(this);
};

},{"./anim":5,"./board":7,"./configure":8,"./data":10,"./drag":11,"./fen":13}],10:[function(require,module,exports){
var fen = require('./fen');
var configure = require('./configure');

module.exports = function(cfg) {
  var defaults = {
    pieces: fen.read(fen.initial),
    orientation: 'white', // board orientation. white | black
    turnColor: 'white', // turn to play. white | black
    check: null, // square currently in check "a2" | null
    lastMove: null, // squares part of the last move ["c3", "c4"] | null
    selected: null, // square currently selected "a1" | null
    coordinates: true, // include coords attributes
    render: null, // function that rerenders the board
    renderRAF: null, // function that rerenders the board using requestAnimationFrame
    element: null, // DOM element of the board, required for drag piece centering
    bounds: null, // function that calculates the board bounds
    autoCastle: false, // immediately complete the castle by moving the rook after king move
    viewOnly: false, // don't bind events: the user will never be able to move pieces around
    minimalDom: false, // don't use square elements. Optimization to use only with viewOnly
    disableContextMenu: false, // because who needs a context menu on a chessboard
    resizable: true, // listens to chessground.resize on document.body to clear bounds cache
    highlight: {
      lastMove: true, // add last-move class to squares
      check: true, // add check class to squares
      dragOver: true // add drag-over class to square when dragging over it
    },
    animation: {
      enabled: true,
      duration: 200,
      /*{ // current
       *  start: timestamp,
       *  duration: ms,
       *  anims: {
       *    a2: [
       *      [-30, 50], // animation goal
       *      [-20, 37]  // animation current status
       *    ], ...
       *  },
       *  fading: [
       *    {
       *      pos: [80, 120], // position relative to the board
       *      opacity: 0.34,
       *      role: 'rook',
       *      color: 'black'
       *    }
       *  }
       *}*/
      current: {}
    },
    movable: {
      free: true, // all moves are valid - board editor
      color: 'both', // color that can move. white | black | both | null
      dests: {}, // valid moves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]} | null
      dropOff: 'revert', // when a piece is dropped outside the board. "revert" | "trash"
      dropped: [], // last dropped [orig, dest], not to be animated
      showDests: true, // whether to add the move-dest class on squares
      events: {
        after: function(orig, dest, metadata) {}, // called after the move has been played
        afterNewPiece: function(role, pos) {} // called after a new piece is dropped on the board
      }
    },
    premovable: {
      enabled: true, // allow premoves for color that can not move
      showDests: true, // whether to add the premove-dest class on squares
      castle: true, // whether to allow king castle premoves
      dests: [], // premove destinations for the current selection
      current: null, // keys of the current saved premove ["e2" "e4"] | null
      events: {
        set: function(orig, dest) {}, // called after the premove has been set
        unset: function() {} // called after the premove has been unset
      }
    },
    predroppable: {
      enabled: false, // allow predrops for color that can not move
      current: {}, // current saved predrop {role: 'knight', key: 'e4'} | {}
      events: {
        set: function(role, key) {}, // called after the predrop has been set
        unset: function() {} // called after the predrop has been unset
      }
    },
    draggable: {
      enabled: true, // allow moves & premoves to use drag'n drop
      distance: 3, // minimum distance to initiate a drag, in pixels
      autoDistance: true, // lets chessground set distance to zero when user drags pieces
      centerPiece: true, // center the piece on cursor at drag start
      showGhost: true, // show ghost of piece being dragged
      /*{ // current
       *  orig: "a2", // orig key of dragging piece
       *  rel: [100, 170] // x, y of the piece at original position
       *  pos: [20, -12] // relative current position
       *  dec: [4, -8] // piece center decay
       *  over: "b3" // square being moused over
       *  bounds: current cached board bounds
       *  started: whether the drag has started, as per the distance setting
       *}*/
      current: {}
    },
    selectable: {
      // disable to enforce dragging over click-click move
      enabled: true
    },
    stats: {
      // was last piece dragged or clicked?
      // needs default to false for touch
      dragged: !('ontouchstart' in window)
    },
    events: {
      change: function() {}, // called after the situation changes on the board
      // called after a piece has been moved.
      // capturedPiece is null or like {color: 'white', 'role': 'queen'}
      move: function(orig, dest, capturedPiece) {},
      dropNewPiece: function(role, pos) {},
      capture: function(key, piece) {}, // DEPRECATED called when a piece has been captured
      select: function(key) {} // called when a square is selected
    },
    drawable: {
      enabled: false, // allows SVG drawings
      onChange: function(shapes) {},
      // user shapes
      shapes: [
        // {brush: 'green', orig: 'e8'},
        // {brush: 'yellow', orig: 'c4', dest: 'f7'}
      ],
      // computer shapes
      autoShapes: [
        // {brush: 'paleBlue', orig: 'e8'},
        // {brush: 'paleRed', orig: 'c4', dest: 'f7'}
      ],
      /*{ // current
       *  orig: "a2", // orig key of drawing
       *  pos: [20, -12] // relative current position
       *  dest: "b3" // square being moused over
       *  bounds: // current cached board bounds
       *  brush: 'green' // brush name for shape
       *}*/
      current: {},
      brushes: {
        green: {
          key: 'g',
          color: '#15781B',
          opacity: 1,
          lineWidth: 10,
          circleMargin: 0
        },
        red: {
          key: 'r',
          color: '#882020',
          opacity: 1,
          lineWidth: 10,
          circleMargin: 1
        },
        blue: {
          key: 'b',
          color: '#003088',
          opacity: 1,
          lineWidth: 10,
          circleMargin: 2
        },
        yellow: {
          key: 'y',
          color: '#e68f00',
          opacity: 1,
          lineWidth: 10,
          circleMargin: 3
        },
        paleBlue: {
          key: 'pb',
          color: '#003088',
          opacity: 0.3,
          lineWidth: 15,
          circleMargin: 0
        },
        paleGreen: {
          key: 'pg',
          color: '#15781B',
          opacity: 0.35,
          lineWidth: 15,
          circleMargin: 0
        }
      }
    }
  };

  configure(defaults, cfg || {});

  return defaults;
};

},{"./configure":8,"./fen":13}],11:[function(require,module,exports){
var board = require('./board');
var util = require('./util');
var draw = require('./draw');

var originTarget;

function hashPiece(piece) {
  return piece ? piece.color + piece.role : '';
}

function computeSquareBounds(data, bounds, key) {
  var pos = util.key2pos(key);
  if (data.orientation !== 'white') {
    pos[0] = 9 - pos[0];
    pos[1] = 9 - pos[1];
  }
  return {
    left: bounds.left + bounds.width * (pos[0] - 1) / 8,
    top: bounds.top + bounds.height * (8 - pos[1]) / 8,
    width: bounds.width / 8,
    height: bounds.height / 8
  };
}

function start(data, e) {
  if (e.button !== undefined && e.button !== 0) return; // only touch or left click
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  e.stopPropagation();
  e.preventDefault();
  originTarget = e.target;
  var previouslySelected = data.selected;
  var position = util.eventPosition(e);
  var bounds = data.bounds();
  var orig = board.getKeyAtDomPos(data, position, bounds);
  var hadPremove = !!data.premovable.current;
  var hadPredrop = !!data.predroppable.current.key;
  board.selectSquare(data, orig);
  var stillSelected = data.selected === orig;
  if (!previouslySelected && !data.pieces[orig]) draw.clear(data);
  if (data.pieces[orig] && stillSelected && board.isDraggable(data, orig)) {
    var squareBounds = computeSquareBounds(data, bounds, orig);
    data.draggable.current = {
      previouslySelected: previouslySelected,
      orig: orig,
      piece: hashPiece(data.pieces[orig]),
      rel: position,
      epos: position,
      pos: [0, 0],
      dec: data.draggable.centerPiece ? [
        position[0] - (squareBounds.left + squareBounds.width / 2),
        position[1] - (squareBounds.top + squareBounds.height / 2)
      ] : [0, 0],
      bounds: bounds,
      started: data.draggable.autoDistance && data.stats.dragged
    };
  } else {
    if (hadPremove) board.unsetPremove(data);
    if (hadPredrop) board.unsetPredrop(data);
  }
  processDrag(data);
}

function processDrag(data) {
  util.requestAnimationFrame(function() {
    var cur = data.draggable.current;
    if (cur.orig) {
      // cancel animations while dragging
      if (data.animation.current.start && data.animation.current.anims[cur.orig])
        data.animation.current = {};
      // if moving piece is gone, cancel
      if (hashPiece(data.pieces[cur.orig]) !== cur.piece) cancel(data);
      else {
        if (!cur.started && util.distance(cur.epos, cur.rel) >= data.draggable.distance)
          cur.started = true;
        if (cur.started) {
          cur.pos = [
            cur.epos[0] - cur.rel[0],
            cur.epos[1] - cur.rel[1]
          ];
          cur.over = board.getKeyAtDomPos(data, cur.epos, cur.bounds);
        }
      }
    }
    data.render();
    if (cur.orig) processDrag(data);
  });
}

function move(data, e) {
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  if (data.draggable.current.orig)
    data.draggable.current.epos = util.eventPosition(e);
}

function end(data, e) {
  var draggable = data.draggable;
  var orig = draggable.current ? draggable.current.orig : null;
  if (!orig) return;
  // comparing with the origin target is an easy way to test that the end event
  // has the same touch origin
  if (e && e.type === "touchend" && originTarget !== e.target && !draggable.current.newPiece) {
    draggable.current = {};
    return;
  }
  board.unsetPremove(data);
  board.unsetPredrop(data);
  var dest = draggable.current.over;
  if (draggable.current.started) {
    if (draggable.current.newPiece) board.dropNewPiece(data, orig, dest);
    else {
      if (orig !== dest) data.movable.dropped = [orig, dest];
      if (board.userMove(data, orig, dest)) data.stats.dragged = true;
    }
  }
  if (orig === draggable.current.previouslySelected && (orig === dest || !dest))
    board.setSelected(data, null);
  else if (!data.selectable.enabled) board.setSelected(data, null);
  draggable.current = {};
}

function cancel(data) {
  if (data.draggable.current.orig) {
    data.draggable.current = {};
    board.selectSquare(data, null);
  }
}

module.exports = {
  start: start,
  move: move,
  end: end,
  cancel: cancel,
  processDrag: processDrag // must be exposed for board editors
};

},{"./board":7,"./draw":12,"./util":18}],12:[function(require,module,exports){
var board = require('./board');
var util = require('./util');

var brushes = ['green', 'red', 'blue', 'yellow'];

function hashPiece(piece) {
  return piece ? piece.color + ' ' + piece.role : '';
}

function start(data, e) {
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  e.stopPropagation();
  e.preventDefault();
  board.cancelMove(data);
  var position = util.eventPosition(e);
  var bounds = data.bounds();
  var orig = board.getKeyAtDomPos(data, position, bounds);
  data.drawable.current = {
    orig: orig,
    epos: position,
    bounds: bounds,
    brush: brushes[(e.shiftKey & util.isRightButton(e)) + (e.altKey ? 2 : 0)]
  };
  processDraw(data);
}

function processDraw(data) {
  util.requestAnimationFrame(function() {
    var cur = data.drawable.current;
    if (cur.orig) {
      var dest = board.getKeyAtDomPos(data, cur.epos, cur.bounds);
      if (cur.orig === dest) cur.dest = undefined;
      else cur.dest = dest;
    }
    data.render();
    if (cur.orig) processDraw(data);
  });
}

function move(data, e) {
  if (data.drawable.current.orig)
    data.drawable.current.epos = util.eventPosition(e);
}

function end(data, e) {
  var drawable = data.drawable;
  var orig = drawable.current.orig;
  var dest = drawable.current.dest;
  if (orig && dest) addLine(drawable, orig, dest);
  else if (orig) addCircle(drawable, orig);
  drawable.current = {};
  data.render();
}

function cancel(data) {
  if (data.drawable.current.orig) data.drawable.current = {};
}

function clear(data) {
  if (data.drawable.shapes.length) {
    data.drawable.shapes = [];
    data.render();
    onChange(data.drawable);
  }
}

function not(f) {
  return function(x) {
    return !f(x);
  };
}

function addCircle(drawable, key) {
  var brush = drawable.current.brush;
  var sameCircle = function(s) {
    return s.brush === brush && s.orig === key && !s.dest;
  };
  var exists = drawable.shapes.filter(sameCircle).length > 0;
  if (exists) drawable.shapes = drawable.shapes.filter(not(sameCircle));
  else drawable.shapes.push({
    brush: brush,
    orig: key
  });
  onChange(drawable);
}

function addLine(drawable, orig, dest) {
  var brush = drawable.current.brush;
  var sameLine = function(s) {
    return s.orig && s.dest && (
      (s.orig === orig && s.dest === dest) ||
      (s.dest === orig && s.orig === dest)
    );
  };
  var exists = drawable.shapes.filter(sameLine).length > 0;
  if (exists) drawable.shapes = drawable.shapes.filter(not(sameLine));
  else drawable.shapes.push({
    brush: brush,
    orig: orig,
    dest: dest
  });
  onChange(drawable);
}

function onChange(drawable) {
  drawable.onChange(drawable.shapes);
}

module.exports = {
  start: start,
  move: move,
  end: end,
  cancel: cancel,
  clear: clear,
  processDraw: processDraw
};

},{"./board":7,"./util":18}],13:[function(require,module,exports){
var util = require('./util');

var initial = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

var roles = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king"
};

var letters = {
  pawn: "p",
  rook: "r",
  knight: "n",
  bishop: "b",
  queen: "q",
  king: "k"
};

function read(fen) {
  if (fen === 'start') fen = initial;
  var pieces = {};
  fen.replace(/ .+$/, '').replace(/~/g, '').split('/').forEach(function(row, y) {
    var x = 0;
    row.split('').forEach(function(v) {
      var nb = parseInt(v);
      if (nb) x += nb;
      else {
        x++;
        pieces[util.pos2key([x, 8 - y])] = {
          role: roles[v.toLowerCase()],
          color: v === v.toLowerCase() ? 'black' : 'white'
        };
      }
    });
  });

  return pieces;
}

function write(pieces) {
  return [8, 7, 6, 5, 4, 3, 2].reduce(
    function(str, nb) {
      return str.replace(new RegExp(Array(nb + 1).join('1'), 'g'), nb);
    },
    util.invRanks.map(function(y) {
      return util.ranks.map(function(x) {
        var piece = pieces[util.pos2key([x, y])];
        if (piece) {
          var letter = letters[piece.role];
          return piece.color === 'white' ? letter.toUpperCase() : letter;
        } else return '1';
      }).join('');
    }).join('/'));
}

module.exports = {
  initial: initial,
  read: read,
  write: write
};

},{"./util":18}],14:[function(require,module,exports){
var startAt;

var start = function() {
  startAt = new Date();
};

var cancel = function() {
  startAt = null;
};

var stop = function() {
  if (!startAt) return 0;
  var time = new Date() - startAt;
  startAt = null;
  return time;
};

module.exports = {
  start: start,
  cancel: cancel,
  stop: stop
};

},{}],15:[function(require,module,exports){
var m = require('mithril');
var ctrl = require('./ctrl');
var view = require('./view');
var api = require('./api');

// for usage outside of mithril
function init(element, config) {

  var controller = new ctrl(config);

  m.render(element, view(controller));

  return api(controller);
}

module.exports = init;
module.exports.controller = ctrl;
module.exports.view = view;
module.exports.fen = require('./fen');
module.exports.util = require('./util');
module.exports.configure = require('./configure');
module.exports.anim = require('./anim');
module.exports.board = require('./board');
module.exports.drag = require('./drag');

},{"./anim":5,"./api":6,"./board":7,"./configure":8,"./ctrl":9,"./drag":11,"./fen":13,"./util":18,"./view":19,"mithril":21}],16:[function(require,module,exports){
var util = require('./util');

function diff(a, b) {
  return Math.abs(a - b);
}

function pawn(color, x1, y1, x2, y2) {
  return diff(x1, x2) < 2 && (
    color === 'white' ? (
      // allow 2 squares from 1 and 8, for horde
      y2 === y1 + 1 || (y1 <= 2 && y2 === (y1 + 2) && x1 === x2)
    ) : (
      y2 === y1 - 1 || (y1 >= 7 && y2 === (y1 - 2) && x1 === x2)
    )
  );
}

function knight(x1, y1, x2, y2) {
  var xd = diff(x1, x2);
  var yd = diff(y1, y2);
  return (xd === 1 && yd === 2) || (xd === 2 && yd === 1);
}

function bishop(x1, y1, x2, y2) {
  return diff(x1, x2) === diff(y1, y2);
}

function rook(x1, y1, x2, y2) {
  return x1 === x2 || y1 === y2;
}

function queen(x1, y1, x2, y2) {
  return bishop(x1, y1, x2, y2) || rook(x1, y1, x2, y2);
}

function king(color, rookFiles, canCastle, x1, y1, x2, y2) {
  return (
    diff(x1, x2) < 2 && diff(y1, y2) < 2
  ) || (
    canCastle && y1 === y2 && y1 === (color === 'white' ? 1 : 8) && (
      (x1 === 5 && (x2 === 3 || x2 === 7)) || util.containsX(rookFiles, x2)
    )
  );
}

function rookFilesOf(pieces, color) {
  return Object.keys(pieces).filter(function(key) {
    var piece = pieces[key];
    return piece && piece.color === color && piece.role === 'rook';
  }).map(function(key) {
    return util.key2pos(key)[0];
  });
}

function compute(pieces, key, canCastle) {
  var piece = pieces[key];
  var pos = util.key2pos(key);
  var mobility;
  switch (piece.role) {
    case 'pawn':
      mobility = pawn.bind(null, piece.color);
      break;
    case 'knight':
      mobility = knight;
      break;
    case 'bishop':
      mobility = bishop;
      break;
    case 'rook':
      mobility = rook;
      break;
    case 'queen':
      mobility = queen;
      break;
    case 'king':
      mobility = king.bind(null, piece.color, rookFilesOf(pieces, piece.color), canCastle);
      break;
  }
  return util.allPos.filter(function(pos2) {
    return (pos[0] !== pos2[0] || pos[1] !== pos2[1]) && mobility(pos[0], pos[1], pos2[0], pos2[1]);
  }).map(util.pos2key);
}

module.exports = compute;

},{"./util":18}],17:[function(require,module,exports){
var m = require('mithril');
var key2pos = require('./util').key2pos;
var isTrident = require('./util').isTrident;

function circleWidth(current, bounds) {
  return (current ? 2 : 4) / 512 * bounds.width;
}

function lineWidth(brush, current, bounds) {
  return (brush.lineWidth || 10) * (current ? 0.7 : 1) / 512 * bounds.width;
}

function opacity(brush, current) {
  return (brush.opacity || 1) * (current ? 0.6 : 1);
}

function arrowMargin(current, bounds) {
  return isTrident() ? 0 : ((current ? 10 : 20) / 512 * bounds.width);
}

function pos2px(pos, bounds) {
  var squareSize = bounds.width / 8;
  return [(pos[0] - 0.5) * squareSize, (8.5 - pos[1]) * squareSize];
}

function circle(brush, pos, current, bounds) {
  var o = pos2px(pos, bounds);
  var width = circleWidth(current, bounds);
  var radius = bounds.width / 16;
  return {
    tag: 'circle',
    attrs: {
      key: current ? 'current' : pos + brush.key,
      stroke: brush.color,
      'stroke-width': width,
      fill: 'none',
      opacity: opacity(brush, current),
      cx: o[0],
      cy: o[1],
      r: radius - width / 2 - brush.circleMargin * width * 1.5
    }
  };
}

function arrow(brush, orig, dest, current, bounds) {
  var m = arrowMargin(current, bounds);
  var a = pos2px(orig, bounds);
  var b = pos2px(dest, bounds);
  var dx = b[0] - a[0],
    dy = b[1] - a[1],
    angle = Math.atan2(dy, dx);
  var xo = Math.cos(angle) * m,
    yo = Math.sin(angle) * m;
  return {
    tag: 'line',
    attrs: {
      key: current ? 'current' : orig + dest + brush.key,
      stroke: brush.color,
      'stroke-width': lineWidth(brush, current, bounds),
      'stroke-linecap': 'round',
      'marker-end': isTrident() ? null : 'url(#arrowhead-' + brush.key + ')',
      opacity: opacity(brush, current),
      x1: a[0],
      y1: a[1],
      x2: b[0] - xo,
      y2: b[1] - yo
    }
  };
}

function defs(brushes) {
  return {
    tag: 'defs',
    children: [
      brushes.map(function(brush) {
        return {
          key: brush.key,
          tag: 'marker',
          attrs: {
            id: 'arrowhead-' + brush.key,
            orient: 'auto',
            markerWidth: 4,
            markerHeight: 8,
            refX: 2.05,
            refY: 2.01
          },
          children: [{
            tag: 'path',
            attrs: {
              d: 'M0,0 V4 L3,2 Z',
              fill: brush.color
            }
          }]
        }
      })
    ]
  };
}

function orient(pos, color) {
  return color === 'white' ? pos : [9 - pos[0], 9 - pos[1]];
}

function renderShape(orientation, current, brushes, bounds) {
  return function(shape) {
    if (shape.orig && shape.dest) return arrow(
      brushes[shape.brush],
      orient(key2pos(shape.orig), orientation),
      orient(key2pos(shape.dest), orientation),
      current, bounds);
    else if (shape.orig) return circle(
      brushes[shape.brush],
      orient(key2pos(shape.orig), orientation),
      current, bounds);
  };
}

module.exports = function(ctrl) {
  if (!ctrl.data.bounds) return;
  var d = ctrl.data.drawable;
  var allShapes = d.shapes.concat(d.autoShapes);
  if (!allShapes.length && !d.current.orig) return;
  var bounds = ctrl.data.bounds();
  if (bounds.width !== bounds.height) return;
  var usedBrushes = Object.keys(ctrl.data.drawable.brushes).filter(function(name) {
    return (d.current && d.current.dest && d.current.brush === name) || allShapes.filter(function(s) {
      return s.dest && s.brush === name;
    }).length;
  }).map(function(name) {
    return ctrl.data.drawable.brushes[name];
  });
  return {
    tag: 'svg',
    children: [
      defs(usedBrushes),
      allShapes.map(renderShape(ctrl.data.orientation, false, ctrl.data.drawable.brushes, bounds)),
      renderShape(ctrl.data.orientation, true, ctrl.data.drawable.brushes, bounds)(d.current)
    ]
  };
}

},{"./util":18,"mithril":21}],18:[function(require,module,exports){
var files = "abcdefgh".split('');
var ranks = [1, 2, 3, 4, 5, 6, 7, 8];
var invRanks = [8, 7, 6, 5, 4, 3, 2, 1];

function pos2key(pos) {
  return files[pos[0] - 1] + pos[1];
}

function key2pos(pos) {
  return [(files.indexOf(pos[0]) + 1), parseInt(pos[1])];
}

function invertKey(key) {
  return files[7 - files.indexOf(key[0])] + (9 - parseInt(key[1]));
}

var allPos = (function() {
  var ps = [];
  invRanks.forEach(function(y) {
    ranks.forEach(function(x) {
      ps.push([x, y]);
    });
  });
  return ps;
})();
var invPos = allPos.slice().reverse();
var allKeys = allPos.map(pos2key);

function classSet(classes) {
  var arr = [];
  for (var i in classes) {
    if (classes[i]) arr.push(i);
  }
  return arr.join(' ');
}

function opposite(color) {
  return color === 'white' ? 'black' : 'white';
}

function contains2(xs, x) {
  return xs && (xs[0] === x || xs[1] === x);
}

function containsX(xs, x) {
  return xs && xs.indexOf(x) !== -1;
}

function distance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
}

// this must be cached because of the access to document.body.style
var cachedTransformProp;

function computeTransformProp() {
  return 'transform' in document.body.style ?
    'transform' : 'webkitTransform' in document.body.style ?
    'webkitTransform' : 'mozTransform' in document.body.style ?
    'mozTransform' : 'oTransform' in document.body.style ?
    'oTransform' : 'msTransform';
}

function transformProp() {
  if (!cachedTransformProp) cachedTransformProp = computeTransformProp();
  return cachedTransformProp;
}

var cachedIsTrident = null;

function isTrident() {
  if (cachedIsTrident === null)
    cachedIsTrident = window.navigator.userAgent.indexOf('Trident/') > -1;
  return cachedIsTrident;
}

function translate(pos) {
  return 'translate(' + pos[0] + 'px,' + pos[1] + 'px)';
}

function eventPosition(e) {
  return e.touches ? [e.targetTouches[0].clientX, e.targetTouches[0].clientY] : [e.clientX, e.clientY];
}

function partialApply(fn, args) {
  return fn.bind.apply(fn, [null].concat(args));
}

function partial() {
  return partialApply(arguments[0], Array.prototype.slice.call(arguments, 1));
}

function isRightButton(e) {
  return e.buttons === 2 || e.button === 2;
}

function memo(f) {
  var v, ret = function() {
    if (v === undefined) v = f();
    return v;
  };
  ret.clear = function() {
    v = undefined;
  }
  return ret;
}

module.exports = {
  files: files,
  ranks: ranks,
  invRanks: invRanks,
  allPos: allPos,
  invPos: invPos,
  allKeys: allKeys,
  pos2key: pos2key,
  key2pos: key2pos,
  invertKey: invertKey,
  classSet: classSet,
  opposite: opposite,
  translate: translate,
  contains2: contains2,
  containsX: containsX,
  distance: distance,
  eventPosition: eventPosition,
  partialApply: partialApply,
  partial: partial,
  transformProp: transformProp,
  isTrident: isTrident,
  requestAnimationFrame: (window.requestAnimationFrame || window.setTimeout).bind(window),
  isRightButton: isRightButton,
  memo: memo
};

},{}],19:[function(require,module,exports){
var drag = require('./drag');
var draw = require('./draw');
var util = require('./util');
var svg = require('./svg');
var m = require('mithril');

function pieceClass(p) {
  return p.role + ' ' + p.color;
}

function renderPiece(ctrl, key, p) {
  var attrs = {
    style: {},
    class: pieceClass(p)
  };
  var draggable = ctrl.data.draggable.current;
  if (draggable.orig === key && draggable.started) {
    attrs.style[util.transformProp()] = util.translate([
      draggable.pos[0] + draggable.dec[0],
      draggable.pos[1] + draggable.dec[1]
    ]);
    attrs.class += ' dragging';
  } else if (ctrl.data.animation.current.anims) {
    var animation = ctrl.data.animation.current.anims[key];
    if (animation) attrs.style[util.transformProp()] = util.translate(animation[1]);
  }
  return {
    tag: 'piece',
    attrs: attrs
  };
}

function renderGhost(p) {
  return {
    tag: 'piece',
    attrs: {
      class: pieceClass(p) + ' ghost'
    }
  };
}

function renderSquare(ctrl, pos, asWhite) {
  var d = ctrl.data;
  var file = util.files[pos[0] - 1];
  var rank = pos[1];
  var key = file + rank;
  var piece = d.pieces[key];
  var isDragOver = d.highlight.dragOver && d.draggable.current.over === key;
  var classes = util.classSet({
    'selected': d.selected === key,
    'check': d.highlight.check && d.check === key,
    'last-move': d.highlight.lastMove && util.contains2(d.lastMove, key),
    'move-dest': (isDragOver || d.movable.showDests) && util.containsX(d.movable.dests[d.selected], key),
    'premove-dest': (isDragOver || d.premovable.showDests) && util.containsX(d.premovable.dests, key),
    'current-premove': key === d.predroppable.current.key || util.contains2(d.premovable.current, key),
    'drag-over': isDragOver,
    'oc': !!piece,
  });
  if (ctrl.vm.exploding && ctrl.vm.exploding.keys.indexOf(key) !== -1) {
    classes += ' exploding' + ctrl.vm.exploding.stage;
  }
  var attrs = {
    style: {
      left: (asWhite ? pos[0] - 1 : 8 - pos[0]) * 12.5 + '%',
      bottom: (asWhite ? pos[1] - 1 : 8 - pos[1]) * 12.5 + '%'
    }
  };
  if (classes) attrs.class = classes;
  if (d.coordinates) {
    if (pos[1] === (asWhite ? 1 : 8)) attrs['data-coord-x'] = file;
    if (pos[0] === (asWhite ? 8 : 1)) attrs['data-coord-y'] = rank;
  }
  var children = [];
  if (piece) {
    children.push(renderPiece(ctrl, key, piece));
    if (d.draggable.current.orig === key && d.draggable.showGhost && !d.draggable.current.newPiece) {
      children.push(renderGhost(piece));
    }
  }
  return {
    tag: 'square',
    attrs: attrs,
    children: children
  };
}

function renderFading(cfg) {
  return {
    tag: 'square',
    attrs: {
      class: 'fading',
      style: {
        left: cfg.left,
        bottom: cfg.bottom,
        opacity: cfg.opacity
      }
    },
    children: [{
      tag: 'piece',
      attrs: {
        class: pieceClass(cfg.piece)
      }
    }]
  };
}

function renderMinimalDom(ctrl, asWhite) {
  var children = [];
  if (ctrl.data.lastMove) ctrl.data.lastMove.forEach(function(key) {
    var pos = util.key2pos(key);
    children.push({
      tag: 'square',
      attrs: {
        class: 'last-move',
        style: {
          left: (asWhite ? pos[0] - 1 : 8 - pos[0]) * 12.5 + '%',
          bottom: (asWhite ? pos[1] - 1 : 8 - pos[1]) * 12.5 + '%'
        }
      }
    });
  });
  var piecesKeys = Object.keys(ctrl.data.pieces);
  for (var i = 0, len = piecesKeys.length; i < len; i++) {
    var key = piecesKeys[i];
    var pos = util.key2pos(key);
    var attrs = {
      style: {
        left: (asWhite ? pos[0] - 1 : 8 - pos[0]) * 12.5 + '%',
        bottom: (asWhite ? pos[1] - 1 : 8 - pos[1]) * 12.5 + '%'
      },
      class: pieceClass(ctrl.data.pieces[key])
    };
    if (ctrl.data.animation.current.anims) {
      var animation = ctrl.data.animation.current.anims[key];
      if (animation) attrs.style[util.transformProp()] = util.translate(animation[1]);
    }
    children.push({
      tag: 'piece',
      attrs: attrs
    });
  }

  return children;
}

function renderContent(ctrl) {
  var asWhite = ctrl.data.orientation === 'white';
  if (ctrl.data.minimalDom) return renderMinimalDom(ctrl, asWhite);
  var positions = asWhite ? util.allPos : util.invPos;
  var children = [];
  for (var i = 0, len = positions.length; i < len; i++) {
    children.push(renderSquare(ctrl, positions[i], asWhite));
  }
  if (ctrl.data.animation.current.fadings)
    ctrl.data.animation.current.fadings.forEach(function(p) {
      children.push(renderFading(p));
    });
  if (ctrl.data.drawable.enabled) children.push(svg(ctrl));
  return children;
}

function dragOrDraw(d, withDrag, withDraw) {
  return function(e) {
    if (util.isRightButton(e) && d.draggable.current.orig) {
      if (d.draggable.current.newPiece) delete d.pieces[d.draggable.current.orig];
      d.draggable.current = {}
      d.selected = null;
    } else if (d.drawable.enabled && (e.shiftKey || util.isRightButton(e))) withDraw(d, e);
    else if (!d.viewOnly) withDrag(d, e);
  };
}

function bindEvents(ctrl, el, context) {
  var d = ctrl.data;
  var onstart = dragOrDraw(d, drag.start, draw.start);
  var onmove = dragOrDraw(d, drag.move, draw.move);
  var onend = dragOrDraw(d, drag.end, draw.end);
  var startEvents = ['touchstart', 'mousedown'];
  var moveEvents = ['touchmove', 'mousemove'];
  var endEvents = ['touchend', 'mouseup'];
  startEvents.forEach(function(ev) {
    el.addEventListener(ev, onstart);
  });
  moveEvents.forEach(function(ev) {
    document.addEventListener(ev, onmove);
  });
  endEvents.forEach(function(ev) {
    document.addEventListener(ev, onend);
  });
  context.onunload = function() {
    startEvents.forEach(function(ev) {
      el.removeEventListener(ev, onstart);
    });
    moveEvents.forEach(function(ev) {
      document.removeEventListener(ev, onmove);
    });
    endEvents.forEach(function(ev) {
      document.removeEventListener(ev, onend);
    });
  };
}

function renderBoard(ctrl) {
  return {
    tag: 'div',
    attrs: {
      class: 'cg-board orientation-' + ctrl.data.orientation,
      config: function(el, isUpdate, context) {
        if (isUpdate) return;
        if (!ctrl.data.viewOnly || ctrl.data.drawable.enabled)
          bindEvents(ctrl, el, context);
        // this function only repaints the board itself.
        // it's called when dragging or animating pieces,
        // to prevent the full application embedding chessground
        // rendering on every animation frame
        ctrl.data.render = function() {
          m.render(el, renderContent(ctrl));
        };
        ctrl.data.renderRAF = function() {
          util.requestAnimationFrame(ctrl.data.render);
        };
        ctrl.data.bounds = util.memo(el.getBoundingClientRect.bind(el));
        ctrl.data.element = el;
        ctrl.data.render();
      }
    },
    children: []
  };
}

module.exports = function(ctrl) {
  return {
    tag: 'div',
    attrs: {
      config: function(el, isUpdate) {
        if (isUpdate) return;
        el.addEventListener('contextmenu', function(e) {
          if (ctrl.data.disableContextMenu || ctrl.data.drawable.enabled) {
            e.preventDefault();
            return false;
          }
        });
        if (ctrl.data.resizable)
          document.body.addEventListener('chessground.resize', function(e) {
            ctrl.data.bounds.clear();
            ctrl.data.render();
          }, false);
        ['onscroll', 'onresize'].forEach(function(n) {
          var prev = window[n];
          window[n] = function() {
            prev && prev();
            ctrl.data.bounds.clear();
          };
        });
      },
      class: [
        'cg-board-wrap',
        ctrl.data.viewOnly ? 'view-only' : 'manipulable',
        ctrl.data.minimalDom ? 'minimal-dom' : 'full-dom'
      ].join(' ')
    },
    children: [renderBoard(ctrl)]
  };
};

},{"./drag":11,"./draw":12,"./svg":17,"./util":18,"mithril":21}],20:[function(require,module,exports){
/*!
 * @name JavaScript/NodeJS Merge v1.2.0
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
},{}],21:[function(require,module,exports){
var m = (function app(window, undefined) {
	"use strict";
  	var VERSION = "v0.2.1";
	function isFunction(object) {
		return typeof object === "function";
	}
	function isObject(object) {
		return type.call(object) === "[object Object]";
	}
	function isString(object) {
		return type.call(object) === "[object String]";
	}
	var isArray = Array.isArray || function (object) {
		return type.call(object) === "[object Array]";
	};
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
	var noop = function () {};

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window) {
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);

	m.version = function() {
		return VERSION;
	};

	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m(tag, pairs) {
		for (var args = [], i = 1; i < arguments.length; i++) {
			args[i - 1] = arguments[i];
		}
		if (isObject(tag)) return parameterize(tag, args);
		var hasAttrs = pairs != null && isObject(pairs) && !("tag" in pairs || "view" in pairs || "subtree" in pairs);
		var attrs = hasAttrs ? pairs : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (!isString(tag)) throw new Error("selector in m(selector, attrs, children) should be a string");
		while ((match = parser.exec(tag)) != null) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true);
			}
		}

		var children = hasAttrs ? args.slice(1) : args;
		if (children.length === 1 && isArray(children[0])) {
			cell.children = children[0];
		}
		else {
			cell.children = children;
		}

		for (var attrName in attrs) {
			if (attrs.hasOwnProperty(attrName)) {
				if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
					classes.push(attrs[attrName]);
					cell.attrs[attrName] = ""; //create key in correct iteration order
				}
				else cell.attrs[attrName] = attrs[attrName];
			}
		}
		if (classes.length) cell.attrs[classAttrName] = classes.join(" ");

		return cell;
	}
	function forEach(list, f) {
		for (var i = 0; i < list.length && !f(list[i], i++);) {}
	}
	function forKeys(list, f) {
		forEach(list, function (attrs, i) {
			return (attrs = attrs && attrs.attrs) && attrs.key != null && f(attrs, i);
		});
	}
	// This function was causing deopts in Chrome.
	// Well no longer
	function dataToString(data) {
		if (data == null || data.toString() == null) return "";
		return data;
	}
	// This function was causing deopts in Chrome.
	function injectTextNode(parentElement, first, index, data) {
		try {
			insertNode(parentElement, first, index);
			first.nodeValue = data;
		} catch (e) {} //IE erroneously throws error when appending an empty text node after a null
	}

	function flatten(list) {
		//recursively flatten array
		for (var i = 0; i < list.length; i++) {
			if (isArray(list[i])) {
				list = list.concat.apply([], list);
				//check current index again and flatten until there are no more nested arrays at that index
				i--;
			}
		}
		return list;
	}

	function insertNode(parentElement, node, index) {
		parentElement.insertBefore(node, parentElement.childNodes[index] || null);
	}

	var DELETION = 1, INSERTION = 2, MOVE = 3;

	function handleKeysDiffer(data, existing, cached, parentElement) {
		forKeys(data, function (key, i) {
			existing[key = key.key] = existing[key] ? {
				action: MOVE,
				index: i,
				from: existing[key].index,
				element: cached.nodes[existing[key].index] || $document.createElement("div")
			} : {action: INSERTION, index: i};
		});
		var actions = [];
		for (var prop in existing) actions.push(existing[prop]);
		var changes = actions.sort(sortChanges), newCached = new Array(cached.length);
		newCached.nodes = cached.nodes.slice();

		forEach(changes, function (change) {
			var index = change.index;
			if (change.action === DELETION) {
				clear(cached[index].nodes, cached[index]);
				newCached.splice(index, 1);
			}
			if (change.action === INSERTION) {
				var dummy = $document.createElement("div");
				dummy.key = data[index].attrs.key;
				insertNode(parentElement, dummy, index);
				newCached.splice(index, 0, {
					attrs: {key: data[index].attrs.key},
					nodes: [dummy]
				});
				newCached.nodes[index] = dummy;
			}

			if (change.action === MOVE) {
				var changeElement = change.element;
				var maybeChanged = parentElement.childNodes[index];
				if (maybeChanged !== changeElement && changeElement !== null) {
					parentElement.insertBefore(changeElement, maybeChanged || null);
				}
				newCached[index] = cached[change.from];
				newCached.nodes[index] = changeElement;
			}
		});

		return newCached;
	}

	function diffKeys(data, cached, existing, parentElement) {
		var keysDiffer = data.length !== cached.length;
		if (!keysDiffer) {
			forKeys(data, function (attrs, i) {
				var cachedCell = cached[i];
				return keysDiffer = cachedCell && cachedCell.attrs && cachedCell.attrs.key !== attrs.key;
			});
		}

		return keysDiffer ? handleKeysDiffer(data, existing, cached, parentElement) : cached;
	}

	function diffArray(data, cached, nodes) {
		//diff the array itself

		//update the list of DOM nodes by collecting the nodes from each item
		forEach(data, function (_, i) {
			if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes);
		})
		//remove items from the end of the array if the new array is shorter than the old one. if errors ever happen here, the issue is most likely
		//a bug in the construction of the `cached` data structure somewhere earlier in the program
		forEach(cached.nodes, function (node, i) {
			if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]]);
		})
		if (data.length < cached.length) cached.length = data.length;
		cached.nodes = nodes;
	}

	function buildArrayKeys(data) {
		var guid = 0;
		forKeys(data, function () {
			forEach(data, function (attrs) {
				if ((attrs = attrs && attrs.attrs) && attrs.key == null) attrs.key = "__mithril__" + guid++;
			})
			return 1;
		});
	}

	function maybeRecreateObject(data, cached, dataAttrKeys) {
		//if an element is different enough from the one in cache, recreate it
		if (data.tag !== cached.tag ||
				dataAttrKeys.sort().join() !== Object.keys(cached.attrs).sort().join() ||
				data.attrs.id !== cached.attrs.id ||
				data.attrs.key !== cached.attrs.key ||
				(m.redraw.strategy() === "all" && (!cached.configContext || cached.configContext.retain !== true)) ||
				(m.redraw.strategy() === "diff" && cached.configContext && cached.configContext.retain === false)) {
			if (cached.nodes.length) clear(cached.nodes);
			if (cached.configContext && isFunction(cached.configContext.onunload)) cached.configContext.onunload();
			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (controller.unload) controller.onunload({preventDefault: noop});
				});
			}
		}
	}

	function getObjectNamespace(data, namespace) {
		return data.attrs.xmlns ? data.attrs.xmlns :
			data.tag === "svg" ? "http://www.w3.org/2000/svg" :
			data.tag === "math" ? "http://www.w3.org/1998/Math/MathML" :
			namespace;
	}

	function unloadCachedControllers(cached, views, controllers) {
		if (controllers.length) {
			cached.views = views;
			cached.controllers = controllers;
			forEach(controllers, function (controller) {
				if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old;
				if (pendingRequests && controller.onunload) {
					var onunload = controller.onunload;
					controller.onunload = noop;
					controller.onunload.$old = onunload;
				}
			});
		}
	}

	function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
		//schedule configs to be called. They are called after `build`
		//finishes running
		if (isFunction(data.attrs.config)) {
			var context = cached.configContext = cached.configContext || {};

			//bind
			configs.push(function() {
				return data.attrs.config.call(data, node, !isNew, context, cached);
			});
		}
	}

	function buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers) {
		var node = cached.nodes[0];
		if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
		cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
		cached.nodes.intact = true;

		if (controllers.length) {
			cached.views = views;
			cached.controllers = controllers;
		}

		return node;
	}

	function handleNonexistentNodes(data, parentElement, index) {
		var nodes;
		if (data.$trusted) {
			nodes = injectHTML(parentElement, index, data);
		}
		else {
			nodes = [$document.createTextNode(data)];
			if (!parentElement.nodeName.match(voidElements)) insertNode(parentElement, nodes[0], index);
		}

		var cached = typeof data === "string" || typeof data === "number" || typeof data === "boolean" ? new data.constructor(data) : data;
		cached.nodes = nodes;
		return cached;
	}

	function reattachNodes(data, cached, parentElement, editable, index, parentTag) {
		var nodes = cached.nodes;
		if (!editable || editable !== $document.activeElement) {
			if (data.$trusted) {
				clear(nodes, cached);
				nodes = injectHTML(parentElement, index, data);
			}
			//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
			//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
			else if (parentTag === "textarea") {
				parentElement.value = data;
			}
			else if (editable) {
				editable.innerHTML = data;
			}
			else {
				//was a trusted string
				if (nodes[0].nodeType === 1 || nodes.length > 1) {
					clear(cached.nodes, cached);
					nodes = [$document.createTextNode(data)];
				}
				injectTextNode(parentElement, nodes[0], index, data);
			}
		}
		cached = new data.constructor(data);
		cached.nodes = nodes;
		return cached;
	}

	function handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) {
		//handle text nodes
		return cached.nodes.length === 0 ? handleNonexistentNodes(data, parentElement, index) :
			cached.valueOf() !== data.valueOf() || shouldReattach === true ?
				reattachNodes(data, cached, parentElement, editable, index, parentTag) :
			(cached.nodes.intact = true, cached);
	}

	function getSubArrayCount(item) {
		if (item.$trusted) {
			//fix offset of next element if item was a trusted string w/ more than one html element
			//the first clause in the regexp matches elements
			//the second clause (after the pipe) matches text nodes
			var match = item.match(/<[^\/]|\>\s*[^<]/g);
			if (match != null) return match.length;
		}
		else if (isArray(item)) {
			return item.length;
		}
		return 1;
	}

	function buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) {
		data = flatten(data);
		var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

		//keys algorithm: sort elements without recreating them if keys are present
		//1) create a map of all existing keys, and mark all for deletion
		//2) add new keys to map and mark them for addition
		//3) if key exists in new list, change action from deletion to a move
		//4) for each key, handle its corresponding action as marked in previous steps
		var existing = {}, shouldMaintainIdentities = false;
		forKeys(cached, function (attrs, i) {
			shouldMaintainIdentities = true;
			existing[cached[i].attrs.key] = {action: DELETION, index: i};
		});

		buildArrayKeys(data);
		if (shouldMaintainIdentities) cached = diffKeys(data, cached, existing, parentElement);
		//end key algorithm

		var cacheCount = 0;
		//faster explicitly written
		for (var i = 0, len = data.length; i < len; i++) {
			//diff each item in the array
			var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);

			if (item !== undefined) {
				intact = intact && item.nodes.intact;
				subArrayCount += getSubArrayCount(item);
				cached[cacheCount++] = item;
			}
		}

		if (!intact) diffArray(data, cached, nodes);
		return cached
	}

	function makeCache(data, cached, index, parentIndex, parentCache) {
		if (cached != null) {
			if (type.call(cached) === type.call(data)) return cached;

			if (parentCache && parentCache.nodes) {
				var offset = index - parentIndex, end = offset + (isArray(data) ? data : cached.nodes).length;
				clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
			} else if (cached.nodes) {
				clear(cached.nodes, cached);
			}
		}

		cached = new data.constructor();
		//if constructor creates a virtual dom element, use a blank object
		//as the base cached node instead of copying the virtual el (#277)
		if (cached.tag) cached = {};
		cached.nodes = [];
		return cached;
	}

	function constructNode(data, namespace) {
		return namespace === undefined ?
			data.attrs.is ? $document.createElement(data.tag, data.attrs.is) : $document.createElement(data.tag) :
			data.attrs.is ? $document.createElementNS(namespace, data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag);
	}

	function constructAttrs(data, node, namespace, hasKeys) {
		return hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs;
	}

	function constructChildren(data, node, cached, editable, namespace, configs) {
		return data.children != null && data.children.length > 0 ?
			build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
			data.children;
	}

	function reconstructCached(data, attrs, children, node, namespace, views, controllers) {
		var cached = {tag: data.tag, attrs: attrs, children: children, nodes: [node]};
		unloadCachedControllers(cached, views, controllers);
		if (cached.children && !cached.children.nodes) cached.children.nodes = [];
		//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
		if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
		return cached
	}

	function getController(views, view, cachedControllers, controller) {
		var controllerIndex = m.redraw.strategy() === "diff" && views ? views.indexOf(view) : -1;
		return controllerIndex > -1 ? cachedControllers[controllerIndex] :
			typeof controller === "function" ? new controller() : {};
	}

	function updateLists(views, controllers, view, controller) {
		if (controller.onunload != null) unloaders.push({controller: controller, handler: controller.onunload});
		views.push(view);
		controllers.push(controller);
	}

	function checkView(data, view, cached, cachedControllers, controllers, views) {
		var controller = getController(cached.views, view, cachedControllers, data.controller);
		//Faster to coerce to number and check for NaN
		var key = +(data && data.attrs && data.attrs.key);
		data = pendingRequests === 0 || forcing || cachedControllers && cachedControllers.indexOf(controller) > -1 ? data.view(controller) : {tag: "placeholder"};
		if (data.subtree === "retain") return cached;
		if (key === key) (data.attrs = data.attrs || {}).key = key;
		updateLists(views, controllers, view, controller);
		return data;
	}

	function markViews(data, cached, views, controllers) {
		var cachedControllers = cached && cached.controllers;
		while (data.view != null) data = checkView(data, data.view.$original || data.view, cached, cachedControllers, controllers, views);
		return data;
	}

	function buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) {
		var views = [], controllers = [];
		data = markViews(data, cached, views, controllers);
		if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.");
		data.attrs = data.attrs || {};
		cached.attrs = cached.attrs || {};
		var dataAttrKeys = Object.keys(data.attrs);
		var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0);
		maybeRecreateObject(data, cached, dataAttrKeys);
		if (!isString(data.tag)) return;
		var isNew = cached.nodes.length === 0;
		namespace = getObjectNamespace(data, namespace);
		var node;
		if (isNew) {
			node = constructNode(data, namespace);
			//set attributes first, then create children
			var attrs = constructAttrs(data, node, namespace, hasKeys)
			var children = constructChildren(data, node, cached, editable, namespace, configs);
			cached = reconstructCached(data, attrs, children, node, namespace, views, controllers);
		}
		else {
			node = buildUpdatedNode(cached, data, editable, hasKeys, namespace, views, configs, controllers);
		}
		if (isNew || shouldReattach === true && node != null) insertNode(parentElement, node, index);
		//schedule configs to be called. They are called after `build`
		//finishes running
		scheduleConfigsToBeCalled(configs, data, node, isNew, cached);
		return cached
	}

	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal
		//of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM
		//    based on what the difference is
		//3 - recursively apply this algorithm for every array and for the
		//    children of every virtual element

		//the `cached` data structure is essentially the same as the previous
		//redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of
		//   DOM elements that correspond to the data represented by the
		//   respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`,
		//   `cached` is *always* a non-primitive object, i.e. if the data was
		//   a string, then cached is a String instance. If data was `null` or
		//   `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state
		//   storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when
		//   it's an Array, it represents a list of elements; when it's a
		//   String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea
		//values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes.
		//They're artifacts from before arrays started being flattened and are
		//likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being
		//diffed
		//`shouldReattach` is a flag indicating whether a parent node was
		//recreated (if so, and if this node is reused, then this node must
		//reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is
		//contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down
		//from an ancestor
		//`configs` is a list of config functions to run after the topmost
		//`build` call finishes running

		//there's logic that relies on the assumption that null and undefined
		//data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix
		//  implicit and explicit return statements (e.g.
		//  function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		data = dataToString(data);
		if (data.subtree === "retain") return cached;
		cached = makeCache(data, cached, index, parentIndex, parentCache);
		return isArray(data) ? buildArray(data, cached, parentElement, index, parentTag, shouldReattach, editable, namespace, configs) :
			data != null && isObject(data) ? buildObject(data, cached, editable, parentElement, index, shouldReattach, namespace, configs) :
			!isFunction(data) ? handleText(cached, data, index, parentElement, shouldReattach, editable, parentTag) :
			cached;
	}
	function sortChanges(a, b) { return a.action - b.action || a.index - b.index; }
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				//`config` isn't a real attributes, so ignore it
				if (attrName === "config" || attrName === "key") continue;
				//hook event handlers to the auto-redrawing system
				else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
				node[attrName] = autoredraw(dataAttr, node);
				}
				//handle `style: {...}`
				else if (attrName === "style" && dataAttr != null && isObject(dataAttr)) {
				for (var rule in dataAttr) {
						if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule];
				}
				for (var rule in cachedAttr) {
						if (!(rule in dataAttr)) node.style[rule] = "";
				}
				}
				//handle SVG
				else if (namespace != null) {
				if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
				else node.setAttribute(attrName === "className" ? "class" : attrName, dataAttr);
				}
				//handle cases that are properties (but ignore cases where we should use setAttribute instead)
				//- list and form are typically used as strings, but are DOM element references in js
				//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
				else if (attrName in node && attrName !== "list" && attrName !== "style" && attrName !== "form" && attrName !== "type" && attrName !== "width" && attrName !== "height") {
				//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
				if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr;
				}
				else node.setAttribute(attrName, dataAttr);
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr;
			}
		}
		return cachedAttrs;
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try { nodes[i].parentNode.removeChild(nodes[i]); }
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i]);
			}
		}
		//release memory if nodes is an array. This check should fail if nodes is a NodeList (see loop above)
		if (nodes.length) nodes.length = 0;
	}
	function unload(cached) {
		if (cached.configContext && isFunction(cached.configContext.onunload)) {
			cached.configContext.onunload();
			cached.configContext.onunload = null;
		}
		if (cached.controllers) {
			forEach(cached.controllers, function (controller) {
				if (isFunction(controller.onunload)) controller.onunload({preventDefault: noop});
			});
		}
		if (cached.children) {
			if (isArray(cached.children)) forEach(cached.children, unload);
			else if (cached.children.tag) unload(cached.children);
		}
	}

	var insertAdjacentBeforeEnd = (function () {
		var rangeStrategy = function (parentElement, data) {
			parentElement.appendChild($document.createRange().createContextualFragment(data));
		};
		var insertAdjacentStrategy = function (parentElement, data) {
			parentElement.insertAdjacentHTML("beforeend", data);
		};

		try {
			$document.createRange().createContextualFragment('x');
			return rangeStrategy;
		} catch (e) {
			return insertAdjacentStrategy;
		}
	})();

	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType !== 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder);
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data);
		}
		else insertAdjacentBeforeEnd(parentElement, data);

		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++;
		}
		return nodes;
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try { return callback.call(object, e); }
			finally {
				endFirstComputation();
			}
		};
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement);
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes;
		},
		insertBefore: function(node) {
			this.appendChild(node);
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag !== "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		forEach(configs, function (config) { config(); });
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index;
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value;
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store;
		};

		prop.toJSON = function() {
			return store;
		};

		return prop;
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if ((store != null && isObject(store) || isFunction(store)) && isFunction(store.then)) {
			return propify(store);
		}

		return gettersetter(store);
	};

	var roots = [], components = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePreRedrawHook = null, computePostRedrawHook = null, topComponent, unloaders = [];
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	function parameterize(component, args) {
		var controller = function() {
			return (component.controller || noop).apply(this, args) || this;
		};
		if (component.controller) controller.prototype = component.controller.prototype;
		var view = function(ctrl) {
			var currentArgs = arguments.length > 1 ? args.concat([].slice.call(arguments, 1)) : args;
			return component.view.apply(component, currentArgs ? [ctrl].concat(currentArgs) : [ctrl]);
		};
		view.$original = component.view;
		var output = {controller: controller, view: view};
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key};
		return output;
	}
	m.component = function(component) {
		for (var args = [], i = 1; i < arguments.length; i++) args.push(arguments[i]);
		return parameterize(component, args);
	};
	m.mount = m.module = function(root, component) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;

		var isPrevented = false;
		var event = {preventDefault: function() {
			isPrevented = true;
			computePreRedrawHook = computePostRedrawHook = null;
		}};

		forEach(unloaders, function (unloader) {
			unloader.handler.call(unloader.controller, event);
			unloader.controller.onunload = null;
		});

		if (isPrevented) {
			forEach(unloaders, function (unloader) {
				unloader.controller.onunload = unloader.handler;
			});
		}
		else unloaders = [];

		if (controllers[index] && isFunction(controllers[index].onunload)) {
			controllers[index].onunload(event);
		}

		var isNullComponent = component === null;

		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			var currentComponent = component ? (topComponent = component) : (topComponent = component = {controller: noop});
			var controller = new (component.controller || noop)();
			//controllers may call m.mount recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.mount call is applied
			if (currentComponent === topComponent) {
				controllers[index] = controller;
				components[index] = component;
			}
			endFirstComputation();
			if (isNullComponent) {
				removeRootElement(root, index);
			}
			return controllers[index];
		}
		if (isNullComponent) {
			removeRootElement(root, index);
		}
	};

	function removeRootElement(root, index) {
		roots.splice(index, 1);
		controllers.splice(index, 1);
		components.splice(index, 1);
		reset(root);
		nodeCache.splice(getCellCacheKey(root), 1);
	}

	var redrawing = false, forcing = false;
	m.redraw = function(force) {
		if (redrawing) return;
		redrawing = true;
		if (force) forcing = true;
		try {
			//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
			//lastRedrawID is null if it's the first redraw and not an event handler
			if (lastRedrawId && !force) {
				//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
				//when rAF: always reschedule redraw
				if ($requestAnimationFrame === window.requestAnimationFrame || new Date - lastRedrawCallTime > FRAME_BUDGET) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET);
				}
			}
			else {
				redraw();
				lastRedrawId = $requestAnimationFrame(function() { lastRedrawId = null; }, FRAME_BUDGET);
			}
		}
		finally {
			redrawing = forcing = false;
		}
	};
	m.redraw.strategy = m.prop();
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook();
			computePreRedrawHook = null;
		}
		forEach(roots, function (root, i) {
			var component = components[i];
			if (controllers[i]) {
				var args = [controllers[i]];
				m.render(root, component.view ? component.view(controllers[i], args) : "");
			}
		});
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null;
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff");
	}

	var pendingRequests = 0;
	m.startComputation = function() { pendingRequests++; };
	m.endComputation = function() {
		if (pendingRequests > 1) pendingRequests--;
		else {
			pendingRequests = 0;
			m.redraw();
		}
	}

	function endFirstComputation() {
		if (m.redraw.strategy() === "none") {
			pendingRequests--;
			m.redraw.strategy("diff");
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback, callbackThis) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			var _this = callbackThis || this;
			withAttrCallback.call(_this, prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop));
		};
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = noop, routeParams, currentRoute, isDefaultRoute = false;
	m.route = function(root, arg1, arg2, vdom) {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && isString(arg1)) {
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, arg2, path)) {
					if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route");
					isDefaultRoute = true;
					m.route(arg1, true);
					isDefaultRoute = false;
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode];
				if (m.route.mode === "pathname") path += $location.search;
				if (currentRoute !== normalizeRoute(path)) redirect(path);
			};

			computePreRedrawHook = setScroll;
			window[listener]();
		}
		//config: m.route
		else if (root.addEventListener || root.attachEvent) {
			root.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + vdom.attrs.href;
			if (root.addEventListener) {
				root.removeEventListener("click", routeUnobtrusive);
				root.addEventListener("click", routeUnobtrusive);
			}
			else {
				root.detachEvent("onclick", routeUnobtrusive);
				root.attachEvent("onclick", routeUnobtrusive);
			}
		}
		//m.route(route, params, shouldReplaceHistoryEntry)
		else if (isString(root)) {
			var oldRoute = currentRoute;
			currentRoute = root;
			var args = arg1 || {};
			var queryIndex = currentRoute.indexOf("?");
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {};
			for (var i in args) params[i] = args[i];
			var querystring = buildQueryString(params);
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute;
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arg2 : arg1) === true || oldRoute === root;

			if (window.history.pushState) {
				computePreRedrawHook = setScroll;
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
				};
				redirect(modes[m.route.mode] + currentRoute);
			}
			else {
				$location[m.route.mode] = currentRoute;
				redirect(modes[m.route.mode] + currentRoute);
			}
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()");
		if( !key ){
			return routeParams;
		}
		return routeParams[key];
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length);
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart);
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router);
		var index = keys.indexOf(path);
		if(index !== -1){
			m.mount(root, router[keys [index]]);
			return true;
		}

		for (var route in router) {
			if (route === path) {
				m.mount(root, router[route]);
				return true;
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					forEach(keys, function (key, i) {
						routeParams[key.replace(/:|\./g, "")] = decodeURIComponent(values[i]);
					})
					m.mount(root, router[route]);
				});
				return true;
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;

		if (e.ctrlKey || e.metaKey || e.which === 2) return;

		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;

		var currentTarget = e.currentTarget || e.srcElement;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		while (currentTarget && currentTarget.nodeName.toUpperCase() !== "A") currentTarget = currentTarget.parentNode;
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args);
	}
	function setScroll() {
		if (m.route.mode !== "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0);
	}
	function buildQueryString(object, prefix) {
		var duplicates = {};
		var str = [];
		for (var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop;
			var value = object[prop];

			if (value === null) {
				str.push(encodeURIComponent(key));
			} else if (isObject(value)) {
				str.push(buildQueryString(value, key));
			} else if (isArray(value)) {
				var keys = [];
				duplicates[key] = duplicates[key] || {};
				forEach(value, function (item) {
					if (!duplicates[key][item]) {
						duplicates[key][item] = true;
						keys.push(encodeURIComponent(key) + "=" + encodeURIComponent(item));
					}
				});
				str.push(keys.join("&"));
			} else if (value !== undefined) {
				str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
			}
		}
		return str.join("&");
	}
	function parseQueryString(str) {
		if (str === "" || str == null) return {};
		if (str.charAt(0) === "?") str = str.slice(1);

		var pairs = str.split("&"), params = {};
		forEach(pairs, function (string) {
			var pair = string.split("=");
			var key = decodeURIComponent(pair[0]);
			var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null;
			if (params[key] != null) {
				if (!isArray(params[key])) params[key] = [params[key]];
				params[key].push(value);
			}
			else params[key] = value;
		});

		return params;
	}
	m.route.buildQueryString = buildQueryString;
	m.route.parseQueryString = parseQueryString;

	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined;
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred;
	};
	function propify(promise, initialValue) {
		var prop = m.prop(initialValue);
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue);
		};
		prop["catch"] = prop.then.bind(null, null);
		prop["finally"] = function(callback) {
			var _callback = function() {return m.deferred().resolve(callback()).promise;};
			return prop.then(function(value) {
				return propify(_callback().then(function() {return value;}), initialValue);
			}, function(reason) {
				return propify(_callback().then(function() {throw new Error(reason);}), initialValue);
			});
		};
		return prop;
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self.promise = {};

		self.resolve = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire();
			}
			return this;
		};

		self.reject = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire();
			}
			return this;
		};

		self.promise.then = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback)
			if (state === RESOLVED) {
				deferred.resolve(promiseValue);
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue);
			}
			else {
				next.push(deferred);
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED ? deferred.resolve(promiseValue) : deferred.reject(promiseValue);
			});
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && isObject(promiseValue)) || isFunction(promiseValue)) && isFunction(then)) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback();
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback();
					});
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback();
				}
			} else {
				notThennableCallback();
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then;
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire();
			}

			thennable(then, function() {
				state = RESOLVING;
				fire();
			}, function() {
				state = REJECTING;
				fire();
			}, function() {
				try {
					if (state === RESOLVING && isFunction(successCallback)) {
						promiseValue = successCallback(promiseValue);
					}
					else if (state === REJECTING && isFunction(failureCallback)) {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING;
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish();
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish();
				} else {
					thennable(then, function () {
						finish(RESOLVED);
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED);
					});
				}
			});
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) {
			pendingRequests = 0;
			throw e;
		}
	};

	m.sync = function(args) {
		var method = "resolve";

		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results);
				}
				return value;
			};
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			forEach(args, function (arg, i) {
				arg.then(synchronizer(i, true), synchronizer(i, false));
			});
		}
		else deferred.resolve([]);

		return deferred.promise;
	};
	function identity(value) { return value; }

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36)
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined;
			};

			script.onerror = function() {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({
							error: "Error making jsonp request"
						})
					}
				});
				window[callbackKey] = undefined;

				return false;
			}

			script.onload = function() {
				return false;
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script);
		}
		else {
			var xhr = new window.XMLHttpRequest();
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr});
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (isFunction(options.config)) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr;
			}

			var data = options.method === "GET" || !options.data ? "" : options.data;
			if (data && (!isString(data) && data.constructor !== window.FormData)) {
				throw new Error("Request data should be either be a string or FormData. Check the `serialize` option in `m.request`");
			}
			xhr.send(data);
			return xhr;
		}
	}

	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType !== "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "");
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions;
	}

	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			forEach(tokens, function (token) {
				var key = token.slice(1);
				url = url.replace(token, data[key]);
				delete data[key];
			});
		}
		return url;
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = new Deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp"
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = isJSONP ? function(jsonp) { return jsonp.responseText } : xhrOptions.extract || function(xhr) {
			if (xhr.responseText.length === 0 && deserialize === JSON.parse) {
				return null
			} else {
				return xhr.responseText
			}
		};
		xhrOptions.method = (xhrOptions.method || "GET").toUpperCase();
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
				if (e.type === "load") {
					if (isArray(response) && xhrOptions.type) {
						forEach(response, function (res, i) {
							response[i] = new xhrOptions.type(res);
						});
					} else if (xhrOptions.type) {
						response = new xhrOptions.type(response);
					}
				}

				deferred[e.type === "load" ? "resolve" : "reject"](response);
			} catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e);
			}

			if (xhrOptions.background !== true) m.endComputation()
		}

		ajax(xhrOptions);
		deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
		return deferred.promise;
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m;
})(typeof window !== "undefined" ? window : {});

if (typeof module === "object" && module != null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() { return m });

},{}]},{},[2])