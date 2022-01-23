import React from "react";
import {Line} from 'react-chartjs-2';

class Market extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isMonitoring: false,
            symbol: "BTCUSDT",
            trades: [],
            movingAverage: [],
            windowSize: 25,
            totalVolume: 0,
            data: { // charjs model
                labels: [],
                datasets: [
                    {
                        label: 'BTC-USDT',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: []
                    },
                    {
                        label: 'BTC-USDT (Moving Average)',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(0,0,200,0.6)',
                        borderColor: 'rgba(0,0,200,0.5)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(0,0,200,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(0,0,200,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: []
                    }
                ]
            }
        }
    }

    startMonitoring = () => {
        this.setState({isMonitoring: true});
    }

    stopMonitoring = () => {
        this.setState({isMonitoring: false});
    }

    handleWindowSizeChange = (event) => {
        this.setState({windowSize: Number(event.target.value)});
    }

    listenTradeMessage = (message) => {
        if (!this.state.isMonitoring) return;
        let trades = [...this.state.trades];
        let movingAverage = [...this.state.movingAverage];

        let trade = JSON.parse(message.data);
        trades.push(trade)
        if (trades.length > this.state.windowSize) {
            let index = trades.length - this.state.windowSize;
            trades = trades.slice(index);
        }
        let averagePrice = trades.reduce((sum, trade) => sum + Number(trade.p), 0) / trades.length;
        movingAverage.push(averagePrice);
        if (movingAverage.length > this.state.windowSize) {
            let index = movingAverage.length - this.state.windowSize;
            movingAverage = movingAverage.slice(index);
        }
        let newData = {...this.state.data}
        newData.datasets[0].data = trades.map(trade => trade.p);
        newData.datasets[1].data = movingAverage;
        newData.labels.push(new Date(trade.t).toLocaleTimeString());
        if (newData.labels.length > this.state.windowSize) {
            let index = newData.labels.length - this.state.windowSize;
            newData.labels = newData.labels.slice(index);
        }
        if (newData.datasets[0].data.length > this.state.windowSize) {
            let index = newData.datasets[0].data.length - this.state.windowSize;
            newData.datasets[0].data = newData.datasets[0].data.slice(index);
            newData.datasets[1].data = newData.datasets[1].data.slice(index);
            newData.labels = newData.labels.slice(index);
        }
        this.setState({trades, movingAverage, data: newData});
    }

    componentDidMount = () => {
        this.websocket = new WebSocket("ws://localhost:4400/trades");
        this.websocket.onopen = (event) => {
            alert("WebSocket connection to Service is ready!");
        };
        this.websocket.onmessage = this.listenTradeMessage;
    }

    render() {
        let startStopButton;
        if (this.state.isMonitoring) {
            startStopButton = <button onClick={this.stopMonitoring} className="btn btn-danger">Stop</button>
        } else {
            startStopButton = <button onClick={this.startMonitoring} className="btn btn-success">Start</button>
        }
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Market Dashboard</h4>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="symbol" className="form-label">Symbol:</label>
                            <select id="symbol" className="form-select">
                                <option>BTCUSDT</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="windowSize" className="form-label">Window Size</label>
                            <select id="windowSize"
                                    onChange={this.handleWindowSizeChange}
                                    name="windowSize"
                                    value={this.state.windowSize}
                                    className="form-select">
                                <option label="10" value="10">10</option>
                                <option label="25" value="25">25</option>
                                <option label="50" value="50">50</option>
                                <option label="100" value="100">100</option>
                            </select>
                        </div>
                        <div className="form-group">
                            {startStopButton}
                        </div>
                    </div>
                </div>
                <p></p>
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Chart</h4>
                    </div>
                    <div className="card-body">
                        <Line redraw
                              data={this.state.data}
                              width={320}
                              height={240}
                              options={{maintainAspectRatio: true, animation: false}}></Line>
                    </div>
                </div>
                <p></p>
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Trades</h4>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-striped table-hover">
                            <thead>
                            <tr>
                                <th>No</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.trades.map((trade, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{trade.p}</td>
                                            <td>{trade.q}</td>
                                        </tr>
                                    )
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Market;
