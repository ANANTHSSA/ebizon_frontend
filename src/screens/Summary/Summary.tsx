import React, { useContext, useState } from "react";
import { stateContext } from "../../utills/statecontact";
import SummaryMandtoryCard from "./SummaryMandtoryCard";
import SummaryFollow from "./SummaryFollow";

type SubCategoryInfo = {
  subCategoryId: number;
  sub_cat_name: string;
  qalist: any[];
};
const Summary = () => {
  const {
    state: {
      mandatory,
      user_Data: { user_id, role_id },
      token,
    },
  } = useContext(stateContext);

  const [currentSummary, setCurrentSummary] = useState<any[]>([]);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<number[]>([]);
  const [expandedSubCategoryIds, setExpandedSubCategoryIds] = useState<
    number[]
  >([]);
  const [currentQuestions, setCurrentQuestions] = useState<SubCategoryInfo[]>(
    []
  );
  console.log("currentQuestions", currentQuestions);
  
  const [edit, setEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [selectAnswer, setSelectAnswer] = useState<Record<string, any>>({});
  const [checkselectAnswer, setCheckselectAnswer] = useState<
    Record<string, any>
  >({});

  
  return (
    <>
      {mandatory?.mandatorystate === true ? (
        <SummaryMandtoryCard
        selectAnswer={selectAnswer}
        setSelectAnswer={setSelectAnswer}
        checkselectAnswer={checkselectAnswer}
        setCheckselectAnswer={setCheckselectAnswer}
        setFileName={setFileName}
        token={token}
        currentSummary={currentSummary}
        setCurrentSummary={setCurrentSummary}
        expandedCategoryIds={expandedCategoryIds}
        setExpandedCategoryIds={setExpandedCategoryIds}
        expandedSubCategoryIds={expandedSubCategoryIds}
        setExpandedSubCategoryIds={setExpandedSubCategoryIds}
        currentQuestions={currentQuestions}
        setCurrentQuestions={setCurrentQuestions}
        edit={edit}
        setEdit={setEdit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fileName={fileName}
        />
      ) : (
        <SummaryFollow
          selectAnswer={selectAnswer}
          setSelectAnswer={setSelectAnswer}
          checkselectAnswer={checkselectAnswer}
          setCheckselectAnswer={setCheckselectAnswer}
          setFileName={setFileName}
          token={token}
          currentSummary={currentSummary}
          setCurrentSummary={setCurrentSummary}
          expandedCategoryIds={expandedCategoryIds}
          setExpandedCategoryIds={setExpandedCategoryIds}
          expandedSubCategoryIds={expandedSubCategoryIds}
          setExpandedSubCategoryIds={setExpandedSubCategoryIds}
          currentQuestions={currentQuestions}
          setCurrentQuestions={setCurrentQuestions}
          edit={edit}
          setEdit={setEdit}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          fileName={fileName}
        />
      )}
    </>
  );
};

export default Summary;
