var Chess = require('./chessground-assets/libs/chess.js').Chess;
var Parser = require('@mliebelt/pgn-parser');
const util = require('util');

function generateRow(fen, moveSequence, comment) {
    let originalFen = fen;
    fen = fen.split(/\s+/)[0]; fen = fen.replace(/\//g, ""); fen = fen.replace(/2/g, "xx"); fen = fen.replace(/3/g, "xxx"); fen = fen.replace(/4/g, "xxxx"); fen = fen.replace(/5/g, "xxxxx"); fen = fen.replace(/6/g, "xxxxxx"); fen = fen.replace(/7/g, "xxxxxxx"); fen = fen.replace(/8/g, "xxxxxxxx")
    let mapToUnicode = function(letter) {
        let data = { "r": "♜","R": "♖","b": "♝","B": "♗","n": "♞","N": "♘","q": "♛","Q": "♕","k": "♚","K": "♔","p": "♟","P": "♙" };
        return data[letter]
    }
    let lsqcolor = "#fcfcfc"; let dsqcolor = "hsl(226, 100%, 94%)"
    let textx = 0.5; let texty = 0.70
    let innerCode = ``; let x = 0; let y = 0; let i = 0
    while (y < 8) { 
        while (x < 8) { 
            let unicode = mapToUnicode(fen[i++])
            innerCode += `<rect x="${0+x}" y="${0+y}" width="1" height="1" stroke-width=".005" fill="${(x+y)%2==1? dsqcolor:lsqcolor}"></rect>${unicode ? `<text x="${textx+x}" y="${texty+y}" stroke="none" fill="black">${unicode}</text>` : ``}`
            x+=1
        }
        y+=1; x=0
    }
    let row =
`<tr>
    <td><svg style="width: 8cm" viewBox="-0.5 -0.5 9 9" stroke="black" text-anchor="middle" font-family="Pecita" font-size="1.1">${innerCode}</svg> <!-- ${originalFen} --></td>
    <td><p>${moveSequence ? moveSequence : ''}</p>${comment ? comment : ''}</td>
</tr>`;
    return row;
}

function specifyHeaderRow(headerRow, i) {
    return headerRow.replace(RegExp(`^(?:.*?\<li\>){` + i + "}"), function(x){return x.replace(RegExp("\<li\>" + "$"), "<li class='active'>")});
}

function mergeHeaderRows(parent, child) {
    if (parent) return parent.replace(/\<li class=['"]active['"]\>(.+?)\<\/li\>/g, `<li>$1${child.replace(/\<\/?(tr|th)\>/g, "")}</li>`);
}

function generateRows(pgnDataObject, fen, pgnStart, parentHeaderRow) {
    var rows = "";
    var game;
    if (fen) game = new Chess(fen);
    else game = new Chess();
    if (pgnStart) {
        /* only generate the line that begins with pgnStart
        example: if pgnDataObject represents "1. Nh3 (1. Nf3 f6 2. e3 d5) 1... h3" and pgnStart is "1. Nf3 f6 2. e3"
        only generate 1. Nf3 f6 2. e3 - in other words, start the game at 1. Nf3 f6 (so the first move played is 2. e3)" */
        pgnStart = pgnStart.replace(/\d+?\.(\.\.)?/g, "").trim().split(/\s+/); // "1. Nf3 f6" --> [ "Nf3", "f6" ]
        for (let i=0; i<pgnStart.length-1; i++) { // don't delete the last move
            if (pgnDataObject[0]["notation"]["notation"] == pgnStart[i]) {
                pgnDataObject.shift(); // remove first move from [ {move} {move} {move} ] (the mainline) so that we start on the second move
            }
            else {
                for (let j=0; j<pgnDataObject[0]["variations"].length; j++) {
                    if (pgnDataObject[0]["variations"][j][0]["notation"]["notation"] == pgnStart[i]) {
                        pgnDataObject = pgnDataObject[0]["variations"][j]; // replace the mainline with the variation
                        pgnDataObject.shift(); // remove first move
                    }
                    break;
                }
            }

            if (i < pgnStart.length-1) game.move(pgnStart[i]); // don't play the last move
        }
        // make sure the correct first move (i.e., the last move of pgnStart) is played, and ignore other variations
        if (pgnDataObject[0]["notation"]["notation"] == pgnStart[pgnStart.length-1]) {
            pgnDataObject[0]["variations"] = []; // first move is the main move; just delete all variations
        }
        else {
            for (let j=0; j<pgnDataObject[0]["variations"].length; j++) {
                if (pgnDataObject[0]["variations"][j][0]["notation"]["notation"] == pgnStart[pgnStart.length-1]) {
                    pgnDataObject = pgnDataObject[0]["variations"][j]; // replace the mainline with variation
                }
                break;
            }
        }
    }
    var index = 0;
    while (pgnDataObject[index] && pgnDataObject[index]["notation"]) {
        var moveObj = pgnDataObject[index++];
        let moveNum;
        if (moveObj["turn"] == "w") {
            moveNum = moveObj["moveNumber"] + ". ";
        }
        else {
            let fensplit = game.fen().split(" ");
            moveNum = `${fensplit[fensplit.length-1]} ... `
        }
        let moveText = moveObj["notation"]["notation"];
        let moveAnnotation = "";
        if (moveObj["nag"]) {
            if (moveObj["nag"][0] == "$10") {
                moveAnnotation = " ="
            }
            else if (moveObj["nag"][0] == "$4") {
                moveAnnotation = " ??"
            }
            else if (moveObj["nag"][0] == "$3") {
                moveAnnotation = " !!"
            }
            else if (moveObj["nag"][0] == "$2") {
                moveAnnotation = " ?"
            }
            else if (moveObj["nag"][0] == "$1") {
                moveAnnotation = " !"
            }
            else if (moveObj["nag"][0] == "$18") {
                moveAnnotation = " +-"
            }
            else if (moveObj["nag"][0] == "$19") {
                moveAnnotation = " -+"
            }
        }
        let comment = moveObj["commentAfter"] ? moveObj["commentAfter"].trim() : null;
        var moveSequence = `${moveNum}${moveText}${moveAnnotation}`
        var n = moveObj["variations"].length;
        if (n > 0) {
            let headerData = "";
            for (let i=0; i<n; i++) {
                headerData += `<li>${moveNum}${moveObj["variations"][i][0]["notation"]["notation"]}</li>`
            }
            headerData += `<li>${moveNum}${moveObj["notation"]["notation"]}</li>`;
            let headerRow = `<tr><th><ul>${headerData}</ul></th></tr>`;
            for (let i=0; i<n; i++) {
                let headerRowSpecified = specifyHeaderRow(headerRow, i+1);
                if (parentHeaderRow) {
                    headerRowSpecified = mergeHeaderRows(parentHeaderRow, headerRowSpecified);
                }
                rows += headerRowSpecified + "\n" + generateRows(moveObj["variations"][i], game.fen(), null, headerRowSpecified);
            }
            game.move(moveText);
            let headerRowSpecified = specifyHeaderRow(headerRow, n+1);
            if (parentHeaderRow) {
                headerRowSpecified = mergeHeaderRows(parentHeaderRow, headerRowSpecified);
            }
            parentHeaderRow = headerRowSpecified;
            rows += headerRowSpecified + "\n" + generateRow(game.fen(), moveSequence.trim(), comment) + "\n";
        }
        else {
            game.move(moveText);
            rows += generateRow(game.fen(), moveSequence.trim(), comment) + "\n";
        }
    }
    return rows;
}

let pgn = `
1. Nf3 f6 2. Nc3 Nh6 3. g4 c6 4. d4 e6 5. Ng5 f5 { [%csl Ge4][%cal Ge2e4,Gh1g1,Rf5g4] } 6. e4 Bd6 { [%csl Ge5][%cal Gd4d5,Gc3a4,Gc3b5,Ge4e5] } 7. e5 (7. Na4 Bf4 8. Be3 Na6 { [%csl Gb6][%cal Ga4c5,Gf1a6,Ga4b6,Gc2c3] } 9. Nb6 (9. Nc5 Nxc5 { 10. h4 is pointless because after 10 ... Bh2, black threatens to win the rook with 11 ... Bg1 with tempo (forcing 12. Rxg1, since white cannot play Kd2). } { [%csl Gd5][%cal Gd4d5,Gc2c3] } 10. d5 (10. c3 d6 11. h4 Bg3 12. fxg3 fxg4 13. Qf3 Qf6 14. Bc4 Rf8 15. Bxe6 Rxf3 16. O-O Bf5 17. exf5 O-O-O 18. Rae1 Kb8 $10) 10... d6 11. h4 Bh2 12. Nxh7 Bg1 13. Rxg1 Qa5+ { [%csl Gc3][%cal Gb2b4,Gc2c3] } 14. c3 (14. b4 Qa3 $10) 14... Qa4 { [%csl Gb3][%cal Gb2b3,Gd1a4] } 15. b3 (15. Qxa4 fxe4 $10) 15... Qa3 16. Bc1 Qxc1 17. h5 e5 18. O-O-O fxg4 $10)  (9. Bxa6 Bxh2 10. Nxh7 Qh4 11. Kd2 Qh3 12. f3 fxe4 13. Qh1 d6 14. Qxh3 Bd7 $10)  (9. c3 Nb4 10. Nc5 d6 11. Qa4 Nc2+ 12. Kd1 Nxd4) 9... axb6 { [%cal Gd4d5,Gh2h4] } 10. d5 (10. h4 Bh2 11. Nxh7 Bg1 12. Rxg1 Qa5+ { [%csl Gc3][%cal Gb2b4,Gc2c3] } 13. c3 (13. b4 Qa3 { [%csl Gd2][%cal Gc2c3,Gd1d2] } 14. Qd2 fxe4 { [%csl Gc3][%cal Gd2d3,Gd2c3] } 15. Qc3 (15. Qd3 Qc3+ 16. Qxc3 Rxa2) 15... d5 $10)) 10... Ra4 { [%csl Gb6][%cal Gf1c4,Gb2b4,Gc2c4,Ge3b6] } 11. Bb6 Qxb6 12. Bb5 Rd4 13. Bd3 Bd2+ 14. Kf1 fxg4 15. Qh5+ g6 16. Qg5 Ng4 17. f3 Nf6 { [%cal Rh7h6] } 18. dxe6 Bxg5 $10)  (7. Nb5)  (7. d5) 7... Na6 { [%cal Ga2a3,Gc3a4,Gf1a6] } 8. a3 (8. Bxa6)  (8. Na4) 8... Nb4 9. axb4 g6 { 10. Nxe6 Qh4 is clearly not advantageous for white, since white wins a pawn back that was lost but has no clear attack (and, besides, black could have played 9... Bb4+ 10. c3 g6); thus white needs to play 10. f3 or h4 in anticipation of 10 ... fxg4 (or 10 ... Bb4 11. c3 fxg4) or play 10. d5. } { [%cal Gf2f3,Gh2h4,Gd4d5] } 10. f3 (10. h4 fxg4 11. Bg5 Qf6)  (10. d5) *`
pgn = pgn.replace(/\+|(\[.+?\])/g, "").trim();
let pgnDataObject = Parser.parse(pgn, { startRule: "game" }).moves;
let rows = generateRows(pgnDataObject, undefined, "1. Nf3 f6 2. Nc3 Nh6 3. g4 c6 4. d4 e6 5. Ng5 f5 6. e4 Bd6 7. Na4 Bf4 8. Be3 Na6 9. Nc5 Nxc5 10. d5 d6 11. h4 Bh2 12. Nxh7 Bg1 13. Rxg1 Qa5+")

const clipboardy = require('clipboardy');
clipboardy.writeSync(rows)
console.log('Copied!')