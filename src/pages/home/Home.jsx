import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const Home = () => {
  // CarbonCard array values
  const CarbonCard = [0.33, 290, 42, 400];

  // Get the severity of carbon emission
  let carbonSeverity;
  let carbonDescription;
  if (CarbonCard[0] < 0.5) {
    carbonSeverity = "Low";
    carbonDescription = "Great job! Your carbon emissions are low. Keep up the good work!";
  } else if (CarbonCard[0] >= 0.5 && CarbonCard[0] <= 1.5) {
    carbonSeverity = "Moderate";
    carbonDescription = "Your carbon emissions are at a moderate level. Aim for further reductions.";
  } else {
    carbonSeverity = "High";
    carbonDescription = "Alert! Your carbon emissions are high. Take immediate actions to reduce them.";
  }

  // Get the severity of electricity consumption
  let electricitySeverity;
  let electricityDescription;
  if (CarbonCard[1] < 200) {
    electricitySeverity = "Low";
    electricityDescription = "Great job! Your electricity consumption is low. Keep practicing energy efficiency.";
  } else if (CarbonCard[1] >= 200 && CarbonCard[1] <= 500) {
    electricitySeverity = "Moderate";
    electricityDescription = "Your electricity consumption is at a moderate level. Find opportunities for energy conservation.";
  } else {
    electricitySeverity = "High";
    electricityDescription = "Alert! Your electricity consumption is high. Explore ways to reduce your energy usage.";
  }

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="CarbonEmission" amount={CarbonCard[0]} />
          <Widget type="Electricity" amount={CarbonCard[1]} />
          <Widget type="points" amount={CarbonCard[2]} />
          <Widget type="balance" amount={CarbonCard[3]} />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months Carbon Emission in tCO2e " aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="summary">
            <div className="carbonEmissionSummary">
              Carbon Emissions: {CarbonCard[0]} tCO2e ({carbonSeverity})
              <p>{carbonDescription}</p>
            </div>
            <div className="electricitySummary">
              Electricity Consumption: {CarbonCard[1]} kWh ({electricitySeverity})
              <p>{electricityDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
