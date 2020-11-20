import React from "react";
import withContext from "../withContext";


const Home = props => {
  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title"> Home </h4>
        </div>
      </div>
    </>
  );
};

export default withContext(Home);
