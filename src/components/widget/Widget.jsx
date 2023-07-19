import React from "react";
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Widget = ({ type }) => {
  let data;

  // CarbonCard array
  const CarbonCard = [0.33, 290, 42, 400];
  const amount =
    type === "CarbonEmission"
      ? CarbonCard[0]
      : type === "Electricity"
      ? CarbonCard[1]
      : type === "points"
      ? CarbonCard[2]
      : CarbonCard[3];
  const diff = 20;

  switch (type) {
    case "CarbonEmission":
      data = {
        title: "Monthly Carbon Emission",
        isMoney: false,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "Electricity":
      data = {
        title: "Electricity Consumption",
        isMoney: false,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "points":
      data = {
        title: "Carbon Credits",
        isMoney: true,
        icon: (
          <KeyboardArrowDownIcon
            className="icon"
            style={{
              color: "green",
              backgroundColor: "rgba(0, 128, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        isMoney: true,

        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
          {data.title === "Monthly Carbon Emission" && (
            <span className="unit"> tCO2e</span>
          )}
          {data.title === "Electricity Consumption" && (
            <span className="unit"> kWh</span>
          )}
          {data.title === "Carbon Credits" && (
            <span className="unit"> CS Points</span>
          )}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
