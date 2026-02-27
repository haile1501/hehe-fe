import { Team } from "@/types/contest";
import { useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

type ScoreBoardProps = {
  teams: Team[];
};

export const ScoreBoard = ({ teams }: ScoreBoardProps) => {
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => b.totalScore - a.totalScore);
  }, [teams]);

  // Hàm tính toán màu chữ (đen hoặc trắng) dựa trên độ sáng của background
  // Giúp chữ luôn đọc được bất kể team chọn màu gì
  const getContrastYIQ = (hexcolor: string) => {
    if (!hexcolor) return "black";
    const hex = hexcolor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  return (
    <Box maxWidth={1000} mx="auto">
      <Typography
        variant="h2"
        align="center"
        fontWeight="bold"
        gutterBottom
        color="rgba(255,255,255,0.9)"
        pt={7}
      >
        BẢNG XẾP HẠNG
      </Typography>

      <TableContainer component={Paper} elevation={6}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontSize: 24, fontWeight: 700 }}>
                Hạng
              </TableCell>
              <TableCell sx={{ fontSize: 24, fontWeight: 700 }}>Đội</TableCell>
              <TableCell align="center" sx={{ fontSize: 24, fontWeight: 700 }}>
                Điểm
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedTeams.map((team, index) => {
              const rowColor = team.color || "#ffffff";
              const textColor = getContrastYIQ(rowColor);

              return (
                <TableRow
                  key={team.name}
                  sx={{
                    backgroundColor: rowColor, // Sử dụng màu của team
                    height: 80,
                    transition: "transform 0.2s",
                    "&:hover": {
                      filter: "brightness(0.9)", // Hiệu ứng hover nhẹ
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: 25,
                      fontWeight: 700,
                      color: textColor, // Màu chữ tương phản
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {index === 0 && (
                        <EmojiEventsIcon
                          sx={{ mr: 1, fontSize: 31, color: textColor }}
                        />
                      )}
                      #{index + 1}
                    </Stack>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: 25,
                      fontWeight: 700,
                      color: textColor,
                    }}
                  >
                    {team.name}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: 30,
                      fontWeight: 800,
                      color: textColor,
                    }}
                  >
                    {team.totalScore}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
