import React from "react";
import PageInfoTime from "./PageInfoTime";

const PageInfo = () => {
  return (
    <section className="page-info">
      <h1>
        <b>
          SWISS–ESTONIAN <span>STUDIO</span>
        </b>
        <b>
          DIGITAL SYSTEMS <span>AT SCALE</span>
        </b>
        <b>
          STRATEGY <span>DESIGN</span> <span>TECH</span>
        </b>
      </h1>
      <p>
        <span>See you in April 2026</span>
        <PageInfoTime country="Switzerland" timezone="UTC+1" />
        <PageInfoTime country="Estonia" timezone="UTC+2" />
      </p>
    </section>
  );
};

export default PageInfo;
