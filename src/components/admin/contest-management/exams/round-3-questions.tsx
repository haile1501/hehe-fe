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

export const Round3Questions = () => {
  const { edittingExam } = useSelector((state) => state.exam);
  const dispatch = useDispatch();

  const [draftQuestions, setDraftQuestions] = useState<QuestionType[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  if (!edittingExam) {
    return <Typography>Không tìm thấy đề thi</Typography>;
  }

  const currentQuestions = edittingExam.round3?.questions || [];

  // ================= ADD =================
  const handleAddQuestion = () => {
    setEditingIndex(null);
    setDraftQuestions([
      {
        question: "",
        choices: [],
        correctAnswer: "",
      },
    ]);
  };

  // ================= EDIT =================
  const handleEditQuestion = (index: number) => {
    const question = currentQuestions[index];
    setEditingIndex(index);
    setDraftQuestions([question]);
  };

  // ================= CHANGE =================
  const handleQuestionChange = (value: string) => {
    setDraftQuestions((prev) => [{ ...prev[0], question: value }]);
  };

  const handleAnswerChange = (value: string) => {
    setDraftQuestions((prev) => [
      {
        ...prev[0],
        choices: [{ label: "", text: value }],
        correctAnswer: "",
      },
    ]);
  };

  // ================= SAVE =================
  const handleSave = () => {
    const question = draftQuestions[0];

    if (!question.question.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi");
      return;
    }

    let updatedQuestions: QuestionType[];

    if (editingIndex !== null) {
      // UPDATE
      updatedQuestions = currentQuestions.map((q, i) =>
        i === editingIndex ? question : q,
      );
    } else {
      // ADD
      updatedQuestions = [...currentQuestions, question];
    }

    const updatedExam: Exam = {
      ...edittingExam,
      round3: {
        ...(edittingExam.round3 || {}),
        questions: updatedQuestions,
      },
    };

    dispatch(updateEdittingExam(updatedExam));

    setDraftQuestions([]);
    setEditingIndex(null);
  };

  // ================= DELETE =================
  const handleDeleteQuestion = (index: number) => {
    const updatedExam: Exam = {
      ...edittingExam,
      round3: {
        ...(edittingExam.round3 || {}),
        questions: currentQuestions.filter((_, i) => i !== index),
      },
    };

    dispatch(updateEdittingExam(updatedExam));
    setDeleteIndex(null);
  };

  return (
    <Stack spacing={3}>
      {/* ===== LIST ===== */}
      <Box>
        <Typography variant="h6">Danh sách câu hỏi</Typography>

        {currentQuestions.length === 0 && (
          <Typography color="text.secondary">Chưa có câu hỏi nào</Typography>
        )}

        {currentQuestions.map((q, idx) => (
          <Box
            key={idx}
            sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}
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

            <Typography mt={1}>
              Đáp án: {q.choices?.[0]?.text || "(chưa có đáp án)"}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ===== ADD BUTTON ===== */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddQuestion}
        sx={{ alignSelf: "flex-start" }}
      >
        Thêm câu hỏi
      </Button>

      {/* ===== EDIT/ADD FORM ===== */}
      {draftQuestions.length > 0 && (
        <Box sx={{ p: 2, border: "1px dashed #aaa", borderRadius: 2 }}>
          <TextField
            fullWidth
            label="Nội dung câu hỏi"
            value={draftQuestions[0].question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Đáp án đúng"
            value={draftQuestions[0].choices?.[0]?.text || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Lưu
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => {
                setDraftQuestions([]);
                setEditingIndex(null);
              }}
            >
              Huỷ
            </Button>
          </Stack>
        </Box>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá câu hỏi này khỏi Round 3?
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
