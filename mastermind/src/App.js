import React from "react";
import Move from "./move";
import Badge from "./component/badge";
import GameStatistics from "./component/game-statistics";

// Stateful Component
class App extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            game: {
                secret: this.createSecret(3),
                level: 3,
                tries: 0,
                guess: 123,
                moves: [],
                counter: 60,
                lives: 3
            },
            statistics: {
                wins: 0,
                loses: 0,
                total: 0,
                totalWinsMoves: 0,
                avgWinsMoves: 0
            }
        };
    }

    //region game logic methods
    createSecret = (level) => {
        let numbers = [this.createDigit(1, 9)];
        while (numbers.length < level) {
            let digit = this.createDigit(0, 9);
            if (!numbers.includes(digit))
                numbers.push(digit);
        }
        let secret = numbers.reduce((number, digit) => 10 * number + digit, 0);
        console.log(secret)
        return secret;
    }

    createDigit = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createMessage = (guess, secret) => {
        let guessAsString = guess.toString();
        let secretAsString = secret.toString();
        let perfectMatch = 0;
        let partialMatch = 0;
        for (let i = 0; i < guessAsString.length; ++i) {
            let g = guessAsString.charAt(i);
            for (let j = 0; j < secretAsString.length; ++j) {
                let s = secretAsString.charAt(j);
                if (s === g) {
                    if (i === j)
                        perfectMatch++;
                    else
                        partialMatch++;
                }
            }
        }
        if (perfectMatch === 0 && partialMatch === 0)
            return "No match";
        let message = "";
        if (partialMatch > 0)
            message = `-${partialMatch}`;
        if (perfectMatch > 0)
            message += `+${perfectMatch}`;
        return message;
    }
    //endregion

    // region action methods
    play = () => {
        let game = {...this.state.game}
        let statistics = {...this.state.statistics}
        if (game.secret === game.guess) {
            if (game.level === 10) {
                statistics.wins++;
                statistics.total++;
                statistics.totalWinsMoves += game.tries;
                statistics.avgWinsMoves = statistics.totalWinsMoves / statistics.wins;
                this.props.history.push("/wins");
                return;
            }
            game.level++;
            game.counter = 60;
            game.tries = 0;
            game.moves = []
            game.lives = 3;
            game.secret = this.createSecret(game.level);
        } else {
            game.tries++;
            let message = this.createMessage(game.guess, game.secret);
            game.moves.push(new Move(game.guess, message));
        }
        localStorage.setItem("mastermind-game-state", JSON.stringify({game, statistics}));
        this.setState({game, statistics});
    }

    countDown = () => {
        let game = {...this.state.game}
        let statistics = {...this.state.statistics}
        if (game.counter <= 0) {
            if (game.lives === 0) {
                this.props.history.push("/loses");
                statistics.loses++;
            } else {
                game.lives--;
                game.counter = 60;
                game.tries = 0;
                game.moves = []
                game.secret = this.createSecret(game.level);
            }
        } else {
            game.counter = game.counter - 1;
        }
        localStorage.setItem("mastermind-game-state", JSON.stringify({game, statistics}));
        this.setState({game, statistics});
    }

    handleChange = (event) => {
        let game = {...this.state.game}
        game.guess = Number(event.target.value);
        this.setState({game});
    }
    //endregion

    //region lifecycle callback methods
    componentDidMount() {
        let gameState = localStorage.getItem("mastermind-game-state");
        if (gameState === null || gameState === undefined) {
            let state = {...this.state};
            localStorage.setItem("mastermind-game-state", JSON.stringify(state));
        } else {
            let state = JSON.parse(gameState);
            this.setState(state);
        }
        setInterval(this.countDown, 1000);
    }

    render = () => {
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
                               value={this.state.game.level}></Badge>
                        <Badge className="alert-primary"
                               label="Tries"
                               id="tries"
                               value={this.state.game.tries}></Badge>
                        <Badge className="alert-danger"
                               label="Counter"
                               id="counter"
                               value={this.state.game.counter}></Badge>
                        <div className="form-group">
                            <label className="form-label" htmlFor="guess">Guess:</label>
                            <div className="input-group mb-3">
                                <input type="text"
                                       id="counter"
                                       value={this.state.game.guess}
                                       onChange={this.handleChange}
                                       className="form-control"></input>
                                <div className="input-group-append">
                                    <button onClick={this.play}
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
                                this.state.game.moves.map((move, index) =>
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
                <GameStatistics stats={this.state.statistics}></GameStatistics>
            </div>
        );
    }
    //endregion

}

export default App;
