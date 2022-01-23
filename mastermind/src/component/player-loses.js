import {Link} from "react-router-dom";

export default function PlayerLoses(props) {
    return (
        <div className="card">
            <div className="card-header">
                <h4 className="card-title">You have lost the game!</h4>
            </div>
            <div className="card-body">
              <Link to="/">Would you like to play again?</Link>
            </div>
        </div>
    );
}