import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const Featured = () => {
  const value = 70;
  const valueColor = "#27ae60"; // Green color (#27ae60)

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">CarbonSense Usage</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={value}
            text={`${value}%`}
            strokeWidth={5}
            styles={buildStyles({
              pathColor: valueColor, // Change the path color to green
              textColor: valueColor, // Change the text color to green
            })}
          />
        </div>
        <p className="title">Total green products bought</p>
        <p className="amount">$420</p>
        <p className="desc">
          The Transactions details are included only for the past 6 Months. For more details, contact CarbonSense.
        </p>
      </div>
    </div>
  );
};

export default Featured;
