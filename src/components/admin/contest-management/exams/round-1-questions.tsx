import {
  Box,
  Button,
  Radio,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "@/redux/store";
import { useState } from "react";
import { QuestionType } from "@/types/question";
import { Exam } from "@/types/exam";
import { updateEdittingExam } from "@/redux/slices/exam";

export const Round1Questions = () => {
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
      choices: [],
      correctAnswer: "A",
      time: 30,
      teamAnswers: [],
    };

    setDraftQuestions([newQuestion]);
  };

  // ================= EDIT =================
  const handleEditQuestion = (index: number) => {
    const questionToEdit = edittingExam.round1?.questions[index];

    if (!questionToEdit) return;

    // Deep clone tránh mutate
    const cloned = JSON.parse(JSON.stringify(questionToEdit));

    setDraftQuestions([cloned]);
    setEditingIndex(index);
  };

  // ================= INPUT HANDLERS =================
  const handleQuestionChange = (qIndex: number, value: string) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].question = value;
      return updated;
    });
  };

  const handleTimeChange = (qIndex: number, value: number) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].time = value > 0 ? value : 1;
      return updated;
    });
  };

  const handleAddChoice = (qIndex: number) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      const label = String.fromCharCode(65 + updated[qIndex].choices.length);
      updated[qIndex].choices.push({ label, text: "" });
      return updated;
    });
  };

  const handleChoiceChange = (
    qIndex: number,
    cIndex: number,
    value: string,
  ) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].choices[cIndex].text = value;
      return updated;
    });
  };

  const handleCorrectChange = (qIndex: number, label: string) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].correctAnswer = label;
      return updated;
    });
  };

  // ================= SAVE =================
  const handleSaveQuestion = (qIndex: number) => {
    const question = draftQuestions[qIndex];

    if (!question.question.trim()) return;
    if (question.choices.length < 2) return;

    let updatedQuestions = [...(edittingExam.round1?.questions || [])];

    if (editingIndex !== null) {
      updatedQuestions[editingIndex] = question;
    } else {
      updatedQuestions.push(question);
    }

    const updatedExam: Exam = {
      ...edittingExam,
      round1: {
        ...edittingExam.round1,
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
  const handleDeleteSavedQuestion = (qIndex: number) => {
    const updatedExam: Exam = {
      ...edittingExam,
      round1: {
        ...edittingExam.round1,
        questions: edittingExam.round1.questions.filter((_, i) => i !== qIndex),
      },
    };

    dispatch(updateEdittingExam(updatedExam));
    setDeleteIndex(null);
  };

  // ================= UI =================
  return (
    <Stack spacing={3}>
      {/* ===== SAVED QUESTIONS ===== */}
      <Box>
        <Typography variant="h6">Danh sách câu hỏi</Typography>

        {edittingExam.round1?.questions.map((q, idx) => (
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
                Câu {idx + 1}: {q.question} ({q.time}s)
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

            <Stack sx={{ mt: 1 }}>
              {q.choices.map((c) => (
                <Typography key={c.label}>
                  {c.label}. {c.text}{" "}
                  {q.correctAnswer === c.label && (
                    <strong>(Đáp án đúng)</strong>
                  )}
                </Typography>
              ))}
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
            type="number"
            label="Thời gian (giây)"
            value={q.time}
            onChange={(e) => handleTimeChange(qIndex, Number(e.target.value))}
            sx={{ mb: 2 }}
            inputProps={{ min: 1 }}
          />

          <Stack spacing={1}>
            {q.choices.map((choice, cIndex) => (
              <Stack
                key={cIndex}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Radio
                  checked={q.correctAnswer === choice.label}
                  onChange={() => handleCorrectChange(qIndex, choice.label)}
                />
                <Typography>{choice.label}.</Typography>
                <TextField
                  size="small"
                  placeholder={`Choice ${choice.label}`}
                  value={choice.text}
                  onChange={(e) =>
                    handleChoiceChange(qIndex, cIndex, e.target.value)
                  }
                />
              </Stack>
            ))}

            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleAddChoice(qIndex)}
              sx={{ mt: 1 }}
            >
              Thêm lựa chọn
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => handleSaveQuestion(qIndex)}
            >
              {editingIndex !== null ? "Cập nhật" : "Lưu"}
            </Button>

            <Button
              color="error"
              variant="outlined"
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
            Bạn có chắc chắn muốn xoá câu hỏi này khỏi Round 1?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Huỷ</Button>
          <Button
            color="error"
            onClick={() =>
              deleteIndex !== null && handleDeleteSavedQuestion(deleteIndex)
            }
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
