import { FC } from "react";
import { observer } from "mobx-react-lite";

const Dashboard: FC = () => {
    return (

        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>Dashboard</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <canvas
                        className="my-4 w-100"
                        id="myChart"
                        width="916"
                        height="386"
                        style={{ display: "block", boxSizing: "border-box", height: "257px", width: "610px" }}
                    ></canvas>
                </div>
            </div>
        </div>
    );
};

export default observer(Dashboard);
