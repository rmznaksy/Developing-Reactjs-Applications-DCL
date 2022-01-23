// Stateless
// Stateful
// class Game extends React.PureComponent {}
// Hooks -> Stateful Component -> function

import {useEffect, useState} from "react";
import Badge from "./badge";
import Move from "../model/move";
import GameStatistics from "./game-statistics";

export default function Game() {
    let initialGameState = {
        level: 2,
        secret: createSecret(2),
        tries: 0,
        guess: 50,
        moves: [],
        maxTries: createMaxTries(2),
        counter: getTimeOut(2)
    }
    let initialStatistics = {
        wins: 0, loses: 0, total: 0
    }

    let [game, setGame] = useState(initialGameState);
    let [statistics, setStatistics] = useState(initialStatistics);

    useEffect( () => {
        let timerId = setInterval(countDown, 1000);
        return () => {
            clearInterval(timerId);
        }
    });

    function handleChange(event) {
        let newGame = {...game}
        newGame.guess = Number(event.target.value);
        setGame(newGame);
    }

    function countDown() {
        let newGame = {...game}
        let newStatistics = {...statistics}
        newGame.counter--;
        if (newGame.counter <= 0) {
            initGame(newGame);
            newStatistics.loses++;
            newStatistics.total++;
            setStatistics(newStatistics);
        }
        setGame(newGame);
    }

    function initGame(game) {
        game.counter = getTimeOut(game.level);
        game.secret = createSecret(game.level);
        game.maxTries = createMaxTries(game.level);
        game.tries = 0;
        game.moves = [];
    }

    function play() {
        let newGame = {...game};
        let newStatistics = {...statistics};
        if (newGame.secret===newGame.guess){
            newGame.level++;
            newStatistics.wins++;
            newStatistics.total++;
            initGame(newGame);
            setGame(newGame);
            setStatistics(newStatistics);
        } else {
            newGame.tries++;
            if (newGame.tries > newGame.maxTries){
                newStatistics.loses++;
                newStatistics.total++;
                setStatistics(newStatistics);
                initGame(newGame);
            } else {
                let message = "Pick a smaller number";
                if (newGame.guess < newGame.secret){
                    message = "Pick a larger number";
                }
                newGame.moves.push(new Move(newGame.guess, message));
            }
            setGame(newGame);
        }
    }

    //region game-related utility functions
    function createMaxTries(level) {
        return Math.ceil(Math.log2(Math.pow(10, level)));
    }

    function createSecret(level) {
        let max = Math.pow(10, level);
        return Math.floor(Math.random() * max) + 1;
    }

    function getTimeOut(level) {
        return 30 * level;
    }

    //endregion

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Game Console</h3>
                </div>
                <div className="card-body">
                    <Badge className="alert-info"
                           label="Game Level"
                           id="gamelevel"
                           value={game.level}></Badge>
                    <Badge className="alert-primary"
                           label="Tries"
                           id="tries"
                           value={game.tries}></Badge>
                    <Badge className="alert-primary"
                           label="Remaining Tries"
                           id="remainingTries"
                           value={game.maxTries - game.tries}></Badge>
                    <Badge className="alert-danger"
                           label="Counter"
                           id="counter"
                           value={game.counter}></Badge>
                    <div className="form-group">
                        <label className="form-label" htmlFor="guess">Guess:</label>
                        <div className="input-group mb-3">
                            <input type="text"
                                   id="counter"
                                   value={game.guess}
                                   onChange={handleChange}
                                   className="form-control"></input>
                            <div className="input-group-append">
                                <button onClick={play}
                                        className="btn btn-success">Play
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p></p>
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Moves</h3>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover table-striped table-responsive">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Guess</th>
                            <th>Message</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            game.moves.map((move, index) =>
                                <tr key={move.guess + index.toString()}>
                                    <td>{index + 1}</td>
                                    <td>{move.guess}</td>
                                    <td>{move.message}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            <p></p>
            <GameStatistics stats={statistics}></GameStatistics>
        </div>
    );
}

