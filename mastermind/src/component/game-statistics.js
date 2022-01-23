import Badge from "./badge";

export default function GameStatistics(props){
    return(
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">Statistics</h3>
            </div>
            <div className="card-body">
                <Badge className="alert-info"
                       label="Wins"
                       id="wins"
                       value={props.stats.wins}></Badge>
                <Badge className="alert-info"
                       label="Loses"
                       id="loses"
                       value={props.stats.loses}></Badge>
                <Badge className="alert-info"
                       label="Total"
                       id="total"
                       value={props.stats.total}></Badge>
                <Badge className="alert-info"
                       label="Average Move"
                       id="total"
                       value={props.stats.avgWinsMoves}></Badge>
            </div>
        </div>
    );
}