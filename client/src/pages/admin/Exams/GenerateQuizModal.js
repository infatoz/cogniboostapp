import { Modal, Button, Table, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { generateQuizQuestions, addQuestionToExam } from "../../../apicalls/exams";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";

function GenerateQuizModal({ examId, setShowGenerateQuizModal, refreshData }) {
  const dispatch = useDispatch();
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    try {
      dispatch(ShowLoading());
      setLoading(true);
      
      const response = await generateQuizQuestions({
        topic: "JavaScript",  // Change dynamically if needed
        difficulty: "Medium",
        examId: examId,  // ✅ Ensure examId is included
      });
  
      if (response.success) {
        setGeneratedQuestions([response.question]); // ✅ Expecting only 1 question
        message.success("AI-generated question loaded successfully!");
      } else {
        message.error(response.message);
      }
  
      dispatch(HideLoading());
      setLoading(false);
    } catch (error) {
      dispatch(HideLoading());
      setLoading(false);
      message.error("Error generating question!");
    }
  };

  // Function to Approve & Add Questions to Exam
  const approveQuestions = async () => {
    try {
      dispatch(ShowLoading());
      for (const question of generatedQuestions) {
        await addQuestionToExam({
          name: question.name,
          correctOption: question.correctOption,
          options: question.options,
          exam: examId,
        });
      }
      message.success("Questions approved and added to the exam!");
      setGeneratedQuestions([]);
      refreshData();
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error("Error adding questions!");
    }
  };

  return (
    <Modal
      title="Generate AI Quiz Questions"
      open={true}
      onCancel={() => setShowGenerateQuizModal(false)}
      footer={null}
    >
      <Button type="primary" onClick={generateQuestions} loading={loading}>
        Generate AI Questions
      </Button>

      {generatedQuestions.length > 0 && (
        <>
          <Table
            className="mt-5"
            dataSource={generatedQuestions}
            columns={[
              { title: "Question", dataIndex: "name" },
              { title: "Correct Option", dataIndex: "correctOption" },
            ]}
            rowKey={(record, index) => index}
          />
          <Button type="primary" onClick={approveQuestions} className="mt-3">
            Approve & Add to Exam
          </Button>
        </>
      )}
    </Modal>
  );
}

export default GenerateQuizModal;
