

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Onboarding.scss";

import SeconderyBtn from "./SeconderyBtn";
import ChipsButton from "./ChipsButton";
const D_A = ({
  close,
  showToast,
  setShowToast,
  solution_id
}: {
  close: any;
  showToast: any;
  setShowToast: any;
  solution_id: any
}) => {
  console.log(solution_id);
  
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 9; // Total number of pages
  const navigate = useNavigate();

  const nextPage = () => {
    if (currentPage === totalPages) {
      close();
      navigate(`/Home/Category/${solution_id}`)
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const skipToFinish = () => {
    close();
      navigate(`/Home/Category/${solution_id}`)
  };

  return (
    <div className="onboarding-container content">
      <button
        className="close-btn "
        onClick={() => close()}
      >
        X
      </button>
      <div className="onboarding-content">
        {currentPage === 1 && (
          <section>
            <header>
              <h2>Discovery And Assessment</h2>
            </header>

            <h4>Organizing for discovery and evaluation success : </h4>
            <p>
              Discovery and assessment are important processes in many fields.
              In cloud migration, the process of discovery and assessment is a
              crucial factor that determines the success or failure of the
              migration. It involves a complete, thorough analysis of the
              existing IT landscape to gain a full understanding of what is
              being worked with and how it all ties together. This allows for
              smart choices to be made about what to migrate, how to migrate it,
              and where to migrate it to.
            </p>
            <p>
              The systems that will be moving to the cloud must be thoroughly
              understood in order to make the transfer successfully. To assess
              how well your apps and infrastructure map to the cloud and what
              sorts of cloud resources they’ll need, it is essential to have a
              thorough grasp of both.
            </p>
            <p>
              The analysis and planning provided by the Discovery and Assessment
              Service lay the groundwork for the adoption or growth of the
              enterprise cloud. Customers who intend to incorporate public or
              hybrid cloud solutions into their computer infrastructure must
              first use this service.
            </p>
          </section>
        )}
        {currentPage === 2 && (
          <section>
            <div className="text-center">
              <img
              // style={{width:"100%", height:"100%"}}
                src={require("../assets/solutionImage/ebizon Solutions-1a.png")}
                alt="success"
                width={500}
                height={500}
              ></img>
            </div>
           
          </section>
        )}
        {currentPage === 3 && (
          <section>
           <p>
           The what, where, when, and how of a cloud migration must be
           decided upon in order to reduce risk and maximize cost. By
           combining quantitative and qualitative analysis with actionable
           results, the discovery and evaluation service provides answers to
           these issues.
         </p>
         <p>
           The breadth of services includes anything from simple cloud
           readiness assessments of the current computer inventory to roadmap
           generation, application mapping, vendor analysis,
           cloud-architecture, and migration planning. The assessment
           establishes the framework for assisting clients in maximizing the
           effectiveness of their existing infrastructure, planning for
           private, public, or hybrid cloud, developing a business case,
           obtaining true-cost pricing, and lowering migration risk.
         </p>
         <p>
           It can take a while to conduct discovery, and it might not be able
           to gather all the necessary facts. Depending on the context and
           requirements of the customer, you can occasionally need more
           discovery data. So, use your best judgment to decide when you have
           enough data to continue on to the cloud project’s subsequent
           phases.
         </p>
         </section>
        )}
        {currentPage === 4 && (
          <section>
             
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: "40%" }}>ASSESSMENT DELIVERABLES</th>
                  <th className="text-center" style={{ width: "60%" }}>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Infrastructure and Application Discovery</td>
                  <td>
                    To gain a thorough picture of your infrastructure, use
                    inventory profiles for Windows and Linux to find the
                    workloads in your environment.
                  </td>
                </tr>
                <tr>
                  <td>Inventory Analysis</td>
                  <td>
                    Performance of the hardware and applications, network
                    dependence, and a cloud-fit inventory profiling.
                  </td>
                </tr>
                <tr>
                  <td>Performance and Metrics</td>
                  <td>
                    Data is gathered on average daily memory and CPU
                    consumption, highest recorded IOPS, and storage utilization.
                  </td>
                </tr>
                <tr>
                  <td>Application Inventory</td>
                  <td>
                    Applications already present in the environment will be
                    inventoried, and they may be rated for PaaS and SaaS
                    potential.
                  </td>
                </tr>
                <tr>
                  <td>Network Dependencies</td>
                  <td>
                    IP addresses and network adapters connected to the examined
                    machines.
                  </td>
                </tr>
                <tr>
                  <td>Cloud Readiness</td>
                  <td>
                    Determine which assets are more or less appropriate for
                    cloud transfer.
                  </td>
                </tr>
                <tr>
                  <td>Delivery Modelling (PaaS, IaaS, SaaS)</td>
                  <td>
                    Identify an asset’s level of readiness and its suitability
                    for the public cloud.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
        {currentPage === 5 && (
          <section>
            <table className="table table-bordered mt-3">
              <tbody>
             
                <tr>
                  <td>Remediation Scoring (IaaS)</td>
                  <td>
                    Choose the workloads that can be quickly transferred to the
                    cloud. Prior to any migrations, identify the workloads that
                    probably require some form of remediation.
                  </td>
                </tr>
                <tr>
                  <td>Software Reports</td>
                  <td>
                    All installed software will be reported on, helping to
                    determine the environment’s cloud readiness and PaaS score.
                  </td>
                </tr>
                <tr>
                  <td>Financial Analysis</td>
                  <td>
                    Comparisons between cloud TCO and private infrastructure as
                    well as cloud compute prices and benchmark datacentre costs.
                  </td>
                </tr>
              </tbody>
            </table>
            <h4>Choose Us to Plan and Perform your Migration:</h4>
            <p>
              The first stage in your cloud migration process is the Discovery
              and Assessment Service. It aids in addressing the issues of “what
              to move, where to move it, and why move it at all.” Planning for
              migration might start with an emphasis on “what to do first and
              how to make it happen” once these insights have been obtained. You
              can get the answers you need and carry out your migration plans
              with the aid of our planning and migration services.
            </p>
            <p>
              Our cloud management services may assist you with cost control,
              policy setting, governance, and cloud environment optimization
              
            </p>
          </section>
        )}
        {currentPage === 6 && (
          <section>
            <p>using best practices that will increase ROI and reduce risk once
              your workloads are in the cloud.</p>
            <p>
              We work with you to determine which approach works best for your
              organization – public, private or hybrid. As a part of our cloud
              migration consulting services, we take a customer-centric
              approach, pre-set templates and data analytics applications to
              ensure migrations take place in a smooth, effective and systematic
              way without any negative business impact.
            </p>
            <h4>OCI Discovery and Assessment:</h4>
            <p>
              In OCI Discovery and Assessment refers to the Discovery,
              Assessment, and Planning phase of an Oracle Cloud Infrastructure
              project. This phase is part of the life cycle of any cloud project
              which includes Evaluation, Discovery, Assessment, and Planning,
              Implementation, Operations, and Evolution and Optimizations.
            </p>
            <p>
              During this phase, stakeholders’ details, challenges,
              requirements, and responsibilities are collected. An inventory of
              physical and virtual infrastructure such as servers, storage,
              switches, and their uses is created. An inventory of applications,
              software, and current licensing is also created. Current
              implementation details and architectures are collected.
             
            </p>
           
          </section>
        )}
        {currentPage === 7 && (
          <section>
            <p> Modernization and migration pattern and operating model are
              determined.{" "}
              <span className="text-highlight">
                Security and compliance requirements are also collected.
              </span></p>
              <p>
              We work with you to determine which approach works best for your
              organization – public, private or hybrid. As a part of our cloud
              migration consulting services, we take a customer-centric
              approach, pre-set templates and data analytics applications to
              ensure migrations take place in a smooth, effective and systematic
              way without any negative business impact.
            </p>
            <h4>Timeline:</h4>
            <p>
              The duration of the Discovery, Assessment, and Planning phase of
              an Oracle Cloud Infrastructure project can vary depending on the
              size and complexity of the project. It might be time-consuming,
              and it might not be possible to collect all the required data. In
              some cases, additional discovery data might be needed depending on
              the customer environment and requirements. So, it’s important to
              use your judgement to determine when you have enough information
              to move on to the next phases of the cloud project.
            </p>
            
          </section>
        )}
        {currentPage === 8 && (
          <>
          <h4>Key Steps:</h4>
            <p>
              The steps involved in the Discovery and Assessment phase for cloud
              migration can vary depending on the cloud provider and the
              specific project. However, some common steps that are typically
              involved in this phase include:
            </p>
            <div className="row align-items-center">
              <div className="col-1">
                <div>
                  <svg
                    className="ticket-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
                      fill="var(--Colours-Primary-colour-Blue-500)"
                    />
                  </svg>
                </div>
              </div>
              <div className="col-11">
                <h3>Stakeholder identification</h3>
                <p>
                  Identifying the key stakeholders involved in the project,
                  their roles and responsibilities, and their requirements and
                  challenges.
                </p>
              </div>
            </div>
          <div className="row align-items-center">
            <div className="col-1">
              <div>
                <svg
                  className="ticket-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
                    fill="var(--Colours-Primary-colour-Blue-500)" />
                </svg>
              </div>
            </div>
            <div className="col-11">
              <h3>Infrastructure Inventory</h3>
              <p>
                Creating an inventory of the physical and virtual
                infrastructure, including servers, storage, switches, and their
                uses.
              </p>
            </div>
            <div className="col-1">
              <svg
                className="ticket-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
                  fill="var(--Colours-Primary-colour-Blue-500)" />
              </svg>
            </div>
            <div className="col-11">
              <h3>Application inventory</h3>
              <p>
                Creating an inventory of the applications, software, and current
                licensing.
              </p>
            </div>
            <div className="col-1">
              <svg
                className="ticket-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
                  fill="var(--Colours-Primary-colour-Blue-500)" />
              </svg>
            </div>
            <div className="col-11">
              <h3>Current implementation analysis</h3>
              <p>
                Analysing the current implementation details and architectures.
              </p>
            </div>
           
           
          </div></>
        )}
        {currentPage === 9 && (
          <>
          <div className="row align-items-center">
          <div className="col-1">
              <svg
                className="ticket-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
                  fill="var(--Colours-Primary-colour-Blue-500)" />
              </svg>
            </div>
            <div className="col-11 ">
              <h3>Modernization and migration planning</h3>
              <p>
                Determining the modernization and migration pattern and
                operating model.
              </p>
            </div>
          <div className="col-1">
              <svg
                className="ticket-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
                  fill="var(--Colours-Primary-colour-Blue-500)" />
              </svg>
            </div>
            <div className="col-11 ">
              <h3>Security and compliance assessment</h3>
              <p>Assessing the security and compliance requirements.</p>
            </div>
          </div>
          <p>These steps can help you to collect the necessary information to plan for a successful cloud migration.</p>
          </>
        )}
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
      </div>
    </div>
  );
};

export default D_A;
