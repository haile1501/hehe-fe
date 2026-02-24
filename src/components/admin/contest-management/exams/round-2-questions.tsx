import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "@/redux/store";
import { useState } from "react";
import { Exam } from "@/types/exam";
import { QuestionType } from "@/types/question";
import { updateEdittingExam } from "@/redux/slices/exam";

export const Round2Questions = () => {
  const { edittingExam } = useSelector((state) => state.exam);
  const dispatch = useDispatch();

  const [draftQuestions, setDraftQuestions] = useState<QuestionType[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!edittingExam) {
    return <Typography>Không tìm thấy đề thi</Typography>;
  }

  // ================= ADD =================
  const handleAddQuestion = () => {
    if (editingIndex !== null) return;

    const newQuestion: QuestionType = {
      question: "",
      choices: [{ label: "", text: "" }],
      correctAnswer: "",
      teamAnswers: [],
    };

    setDraftQuestions([newQuestion]);
  };

  // ================= EDIT =================
  const handleEditQuestion = (index: number) => {
    const questionToEdit = edittingExam.round2?.questions[index];

    if (!questionToEdit) return;

    const cloned = JSON.parse(JSON.stringify(questionToEdit));

    setDraftQuestions([cloned]);
    setEditingIndex(index);
  };

  // ================= INPUT =================
  const handleQuestionChange = (qIndex: number, value: string) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].question = value;
      return updated;
    });
  };

  const handleAnswerChange = (qIndex: number, value: string) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].choices = [{ label: "", text: value }];
      return updated;
    });
  };

  // ================= SAVE =================
  const handleSaveQuestion = (qIndex: number) => {
    const question = draftQuestions[qIndex];

    if (!question.question.trim()) return;

    let updatedQuestions = [...(edittingExam.round2?.questions || [])];

    if (editingIndex !== null) {
      updatedQuestions[editingIndex] = question;
    } else {
      updatedQuestions.push(question);
    }

    const updatedExam: Exam = {
      ...edittingExam,
      round2: {
        ...edittingExam.round2,
        questions: updatedQuestions,
      },
    };

    dispatch(updateEdittingExam(updatedExam));

    setDraftQuestions([]);
    setEditingIndex(null);
  };

  // ================= CANCEL =================
  const handleCancelQuestion = () => {
    setDraftQuestions([]);
    setEditingIndex(null);
  };

  // ================= DELETE =================
  const handleDeleteQuestion = (qIndex: number) => {
    const updatedExam: Exam = {
      ...edittingExam,
      round2: {
        ...edittingExam.round2,
        questions: edittingExam.round2.questions.filter((_, i) => i !== qIndex),
      },
    };

    dispatch(updateEdittingExam(updatedExam));
    setDeleteIndex(null);
  };

  return (
    <Stack spacing={3}>
      {/* ===== SAVED QUESTIONS ===== */}
      <Box>
        <Typography variant="h6">Danh sách câu hỏi</Typography>

        {edittingExam.round2?.questions.map((q, idx) => (
          <Box
            key={idx}
            sx={{
              p: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
              mb: 2,
              background: editingIndex === idx ? "#fff8e1" : "transparent",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>
                Câu {idx + 1}: {q.question}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditQuestion(idx)}
                >
                  Sửa
                </Button>

                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteIndex(idx)}
                >
                  Xoá
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* ===== ADD BUTTON ===== */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddQuestion}
        disabled={editingIndex !== null}
        sx={{ alignSelf: "flex-start" }}
      >
        Thêm câu hỏi
      </Button>

      {/* ===== DRAFT EDITOR ===== */}
      {draftQuestions.map((q, qIndex) => (
        <Box
          key={qIndex}
          sx={{
            p: 2,
            border: "1px dashed #aaa",
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            label="Nội dung câu hỏi"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Đáp án"
            value={q.choices?.[0]?.text || ""}
            onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => handleSaveQuestion(qIndex)}
            >
              {editingIndex !== null ? "Cập nhật" : "Lưu"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={handleCancelQuestion}
            >
              Huỷ
            </Button>
          </Stack>
        </Box>
      ))}

      {/* ===== DELETE CONFIRM ===== */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá câu hỏi này khỏi Round 2?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Huỷ</Button>
          <Button
            color="error"
            onClick={() =>
              deleteIndex !== null && handleDeleteQuestion(deleteIndex)
            }
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
