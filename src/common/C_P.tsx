import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Onboarding.scss";

import SeconderyBtn from "./SeconderyBtn";
import ChipsButton from "./ChipsButton";
const C_P = ({
  close,
  showToast,
  setShowToast,
  solution_id,
}: {
  close: any;
  showToast: any;
  setShowToast: any;
  solution_id: any;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6; // Total number of pages
  const navigate = useNavigate();

  const nextPage = () => {
    if (currentPage === totalPages) {
      close();
      navigate(`/Home/Category/${solution_id}`);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const skipToFinish = () => {
    close();
    navigate(`/Home/Category/${solution_id}`);
  };
  return (
    <div className="onboarding-container">
      <button className="close-btn " onClick={() => close()}>
        X
      </button>
      <div className="onboarding-content content">
        {currentPage === 1 && (
          <section>
            <header>
              <h2>Cloud Planning</h2>
            </header>
            <p>
              Planning a successful transition from one environment to another
              requires considerable planning and rigorous preparation. This
              could involve moving infrastructure, data, applications, or even a
              complete system. Effective migration planning helps decrease
              risks, ensure a smooth transition, and minimize downtime when
              switching to a new cloud provider, software version, or shifting
              data centres. For all Oracle on-premises applications, including
              back-office programs like Oracle E- Business Suite, PeopleSoft, JD
              Edwards, Siebel, and Hyperion as well as sector-specific solutions
              like Oracle Retail Merchandising and FLEXCUBE1, OCI offers
              enhanced performance and availability, up to 39% lower TCO, and
              simpler migration. Applications shouldn’t be considered in
              isolation in order to get the most out of your cloud environment.
              You want a thorough cloud roadmap that directs all of your choices
              and aids in setting up cloud infrastructure prior to moving
              workloads. When you work with us, you receive a thorough design
              manual and clear roadmap. Depending on your company’s demands,
              select a hybrid, private, or public cloud. To determine the cost
              of your cloud implementation options, evaluate what-if scenarios.
              Planning for capacity and elasticity ensures that your new
              environment has the storage space and scalability your workloads
              require.
            </p>
          </section>
        )}
        {currentPage === 2 && (
          <section>
            <p>
              {" "}
              You can meet important criteria by using compliance profiling.
              Your cloud infrastructure will offer the essential dependencies
              that your workloads require thanks to dependency mapping.
            </p>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "40%" }}>
                    ASSESSMENT DELIVERABLES
                  </th>
                  <th className="text-center" style={{ width: "60%" }}>
                    DESCRIPTION
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Target Analysis (Hybrid, Private, Public)</td>
                  <td>
                    Cost comparison and suggestions for the best locations to
                    run your workloads are provided.
                  </td>
                </tr>
                <tr>
                  <td>Capacity and Elasticity planning</td>
                  <td>
                    Buildings are flexible enough to scale up or down to
                    accommodate possible changes in capacity arguments.
                  </td>
                </tr>
                <tr>
                  <td>Application profiling</td>
                  <td>
                    To better understand dependencies, score, and plan the
                    migration of the application, create a profile map for each
                    application.
                  </td>
                </tr>
                <tr>
                  <td>Compliance profiling</td>
                  <td>
                    Ensuring that the architecture complies with any concerns
                    that already exist.
                  </td>
                </tr>
                <tr>
                  <td>Financial modelling</td>
                  <td>
                    TCO comparisons that are enhanced utilizing specific cost
                    centers and ROI calculations.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
        {currentPage === 3 && (
          <section>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "40%" }}>
                    ASSESSMENT DELIVERABLES
                  </th>
                  <th className="text-center" style={{ width: "60%" }}>
                    DESCRIPTION
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adoption road map modelling</td>
                  <td>
                    Using roadmaps, the migration process might begin with
                    workloads that have a high readiness score or workloads that
                    require immediate attention.
                  </td>
                </tr>
                <tr>
                  <td>Hybrid modelling</td>
                  <td>
                    If any existing data center will remain, map and plan out
                    the best targets for workloads, including hybrid strategies.
                  </td>
                </tr>
                <tr>
                  <td>Resource and competency mapping</td>
                  <td>
                    Knowing what skills are now in use and how to adapt them to
                    cloud technologies.
                  </td>
                </tr>
                <tr>
                  <td>Software Reports</td>
                  <td>
                    All installed software will be reported on, helping to
                    determine the environment’s cloud readiness and PaaS score.
                  </td>
                </tr>
              </tbody>
            </table>
            <h4>
              Here are some important factors for a thorough migration plan :{" "}
            </h4>

            <h3 style={{ display: "inline" }}>
              Define Objectives and Scope :{" "}
            </h3>
            <p style={{ display: "inline" }}>
              {" "}
              Clearly outline the objectives of the migration and what you
              intend to achieve. Identify the scope of the migration, including
              which components or data will be moved and any constraints or
              limitations.
            </p>
          </section>
        )}
        {currentPage === 4 && (
          <section>
            <div className="mt-3">
              <h3 style={{ display: "inline" }}>Risk Assessment : </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Conduct a risk assessment to identify potential challenges and
                vulnerabilities during the migration process. Analyze potential
                impacts on data integrity, security, and downtime.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>Resource Assessment : </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Evaluate the resources needed for the migration, including
                technical expertise, tools, and infrastructure requirements.
                Ensure you have the necessary skills and capacity to handle the
                migration effectively.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>Timeline and Milestones : </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Develop a detailed timeline for the migration, including
                specific milestones and deadlines. This will help keep the
                project on track and provide a clear roadmap for the migration
                team.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>
                Data and Application Inventory :{" "}
              </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Create an inventory of all data, applications, and
                infrastructure components that will be part of the migration.
                Understand their dependencies and relationships.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>Data Preparations : </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Ensure that data is appropriately prepared and cleaned before
                the migration. This might include data deduplication, data
                validation, and format conversions.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>Testing and Validation : </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Set up a testing environment to verify the migration process and
                identify potential issues before the actual migration. This can
                include testing in a sandbox or staging environment.
              </p>
            </div>
          </section>
        )}
        {currentPage === 5 && (
          <section>
            <div className="mt-3">
              <h3 style={{ display: "inline" }}>
                Communication and Stakeholder Management :{" "}
              </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Keep all stakeholders informed about the migration plan,
                progress, and potential impact on their operations. Address
                concerns and ensure proper communication channels are in place.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>
                Contingency and Rollback Plan :{" "}
              </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Have a contingency plan in case unexpected issues arise during
                migration. Also, develop a rollback plan that outlines steps to
                revert to the original state if needed.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>
                User Training and Support :{" "}
              </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Train end-users on any changes resulting from the migration and
                provide adequate support during and after the migration.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>
                Monitoring and Performance Optimization :{" "}
              </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Implement monitoring tools to track the migration process and
                identify performance bottlenecks. Optimize the system and
                configurations as needed.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>
                Post-Migration Evaluation :{" "}
              </h3>
              <p style={{ display: "inline" }}>
                {" "}
                After the migration is complete, evaluate the success of the
                process and the achievement of objectives. Identify any lessons
                learned and areas for improvement.
              </p>
            </div>
            <div>
              <h3 style={{ display: "inline" }}>Compliance and Security : </h3>
              <p style={{ display: "inline" }}>
                {" "}
                Ensure that the migration plan adheres to relevant compliance
                regulations and data security standards.
              </p>
             
            </div>
          </section>
        )}
        {currentPage === 6 && <section>
          <p className="mt-3">
                Every migration is unique, and the specific details of the
                planning process will vary depending on the scope and complexity
                of the migration. Thorough planning and collaboration with all
                stakeholders are essential to achieve a successful migration
                with minimal disruption to the business.
              </p>
          </section>}
      </div>
      <footer>
        <div className="d-flex justify-content-center">
          <div className="page-indicators mt-3">
            {[...Array(totalPages)].map((_, index) => (
              <div
                key={index}
                className={`page-indicator ${
                  index + 1 === currentPage ? "active" : "inactive"
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-end align-items-center">
          <SeconderyBtn
            title="Previous"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            {" "}
            Previous
          </SeconderyBtn>
          <SeconderyBtn title="Next" onClick={nextPage}>
            Next
          </SeconderyBtn>
          <ChipsButton onClick={skipToFinish}>Skip</ChipsButton>
        </div>
      </footer>
      {/* <div className="solutions-container">
        <div>
          <button></button>
          <header></header>
          <footer></footer>
        </div>
        </div> */}
    </div>
  );
};

export default C_P;
