import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseFetch } from "../../utills/UseFetch";
import { stateContext } from "../../utills/statecontact";
import "../../styles/Version.scss";
import Loading from "../../common/Loading";
import SeconderyBtn from "../../common/SeconderyBtn";
interface Item {
  version_no: string;
  version_comments: string;
  version_description: string;
  user_name: string;
  created_on: string;
  created_by: number;
  solution_id: number;
  solution_name: string;
  order_id: number;
}

interface Solution {
  solutionName: string;
  versions: Version[];
}

interface Version {
  versionNo: string | number;
  comments: string;
  description: string;
  userName: string;
  date: string;
}

const Versions: React.FC = () => {
  const { state: { user_Data: { user_id } }, dispatch } = useContext(stateContext);

  const { data: version, message: message,error } = UseFetch(`/answers/versionList?user_id=${user_id}`, "GET", dispatch); // Assuming dispatch is defined somewhere


  const [statusMessage, setStatusMessage] = useState<any>("");



  useEffect(() => {
    setStatusMessage(message);
  }, [message])

  const navigate = useNavigate();

  const solutions: { [key: number]: Solution } = {};
  function isVersionWithData(version: any): version is { data: Item[] } {
    return version && version.data && Array.isArray(version.data);
  }

  // Access the 'data' array from the version object if it exists and contains data
  const versionArray: Item[] = isVersionWithData(version) ? version.data : [];




  if (versionArray) {
    versionArray.forEach((item: Item) => {
      const solutionId: number = item.solution_id; // Assuming created_by is used as solution_id

      if (!solutions[solutionId]) {
        solutions[solutionId] = {
          solutionName: item.solution_name, // This needs to be fetched from somewhere
          versions: [],
        };
      }

      solutions[solutionId].versions.push({
        versionNo: item.version_no,
        comments: item.version_comments,
        description: item.version_description,
        date: item.created_on,
        userName: item.user_name,
      });
    });
  }


  const latestVersions: { [key: number]: Item } = {};

  versionArray.forEach(version => {
    const { solution_id, version_no } = version;

    // Check if the solution_id already exists in latestVersions
    if (solution_id in latestVersions) {
      // If the current version_no is greater than the stored version_no, update the latest version
      if (parseInt(version_no) > parseInt(latestVersions[solution_id].version_no)) {
        latestVersions[solution_id] = version;
      }
    } else {
      // If solution_id doesn't exist in latestVersions, add it
      latestVersions[solution_id] = version;
    }
  });

  // Convert the latestVersions object back to an array of versions
  const latestVersionsArray: Item[] = Object.values(latestVersions);




// function to format date
  function formatDate(created_on: string): string {
    const dateObject = new Date(created_on);
    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  if (error === "Network Error") {
    dispatch({
      type: "NETWORK_ERROR",
      payload: true,
    });
  }

  return (
    <>
     {Object.keys(version).length > 0 ? (
      <section id="Version">
        {versionArray?.length === 0 ? (
          <h2 className="ps-3 warn fs-3 fw-bold mt-3" ><svg xmlns="http://www.w3.org/2000/svg" className="me-2" width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#171717"/>
          </svg>{statusMessage?.message}</h2>

        ) : (<> <p className="version-solution-head">Latest Version</p>
          <table className="table mb-4  table-hover " style={{
            width: "100%", // Set a desired width for the table
            margin: "auto", // Center the table
            borderTop: "1px solid #dee2e6",
            boxShadow: "var(--box-shadow-color)",
          }}>
            <thead className="fs-5">
              <tr>
                <th className="col-3" style={{ paddingLeft: "1rem" }}>Solution</th>
                <th className="col-1">Version</th>
                <th className="col-2">Date</th>
                <th className="col-2">Submitted by</th>
                <th className="col-3" >Description</th>
                <th className="col-1">Link</th>
              </tr>
            </thead>
            {latestVersionsArray?.map((solution: any, index: number) => (
              console.log("version", versionArray),


              <tbody style={{ wordBreak: "break-word" }}>
                <tr>
                  <td className="col-3" style={{ paddingLeft: "1rem" }}>{solution.solution_name}</td>
                  <td className="col-1" style={{ paddingLeft: "1rem" }}>{solution.version_no}</td>
                  <td className="col-2">{formatDate(solution.created_on)}</td>
                  <td className="col-2" style={{ paddingRight: "1rem" }}>{solution.user_name}</td>
                  <td className="col-3" style={{ paddingRight: "1rem" }}>{solution.version_description}</td>
                  <td className="col-1"><SeconderyBtn
                    onClick={() =>
                      navigate(
                        `VersionDetails/${solution.solution_id}/${solution.version_no}`
                      )
                    }
                  >
                    {" "}
                    View{" "}<img
                      src={require("../../assets/Icons/arrow_outward.png")}
                    />
                  </SeconderyBtn></td>
                </tr>
              </tbody>
            ))}
          </table>
        </>)}


       
          <div>
            {Object.keys(solutions).map((solutionId) => {
              const solution = solutions[parseInt(solutionId)];

              return (
                <div key={solutionId}>
                  <p className="version-solution-head">
                    {solution.solutionName}
                  </p>
                  <table
                    className="table table-hover mb-4"
                    style={{
                      width: "100%", // Set a desired width for the table
                      margin: "auto", // Center the table
                      borderTop: "1px solid #dee2e6",
                      boxShadow: "var(--box-shadow-color)",
                    }}
                  >
                    <thead>
                      <tr>
                        <th className="col-2" style={{ paddingLeft: "1rem" }}>Version</th>
                        <th className="col-2">Date</th>
                        <th className="col-3">Submitted by</th>
                        <th className="col-4">Description</th>
                        <th className="col-2">Link</th>
                      </tr>
                    </thead>
                    <tbody style={{ wordBreak: "break-word" }}>
                      {solution.versions.map((version, index) => (
                        <tr key={index}>
                          <td className="col-2" style={{ paddingLeft: "1rem" }}>
                            {version.versionNo}
                          </td>

                          <td className="col-2">{formatDate(version.date)}</td>
                          <td className="col-3" style={{ paddingRight: "1rem" }}>{version.userName}</td>
                          <td className="col-4" style={{ paddingRight: "4rem" }}>{version.description}</td>
                          <td className="col-2">
                            <SeconderyBtn
                              onClick={() =>
                                navigate(
                                  `VersionDetails/${solutionId}/${version.versionNo}`
                                )
                              }
                            >
                              {" "}
                              View{" "}
                              <img
                                src={require("../../assets/Icons/arrow_outward.png")}
                              />
                            </SeconderyBtn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
      
      </section>
        ) : (
          <Loading />
        )}
    </>
  );
};

export default Versions;
