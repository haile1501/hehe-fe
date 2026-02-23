import { Team } from "@/types/contest";
import { useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

type ScoreBoardProps = {
  teams: Team[];
};

export const ScoreBoard = ({ teams }: ScoreBoardProps) => {
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => b.totalScore - a.totalScore);
  }, [teams]);

  const getRowStyle = (index: number) => {
    switch (index) {
      case 0:
        return { backgroundColor: "#FFD700" };
      case 1:
        return { backgroundColor: "#C0C0C0" };
      case 2:
        return { backgroundColor: "#CD7F32" };
      case 3:
        return { backgroundColor: "#A5D6A7" };
      default:
        return {};
    }
  };

  return (
    <Box maxWidth={1000} mx="auto">
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        gutterBottom
        color="rgba(255,255,255,0.9)"
        pt={8}
      >
        BẢNG XẾP HẠNG
      </Typography>

      <TableContainer component={Paper} elevation={6}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontSize: 20, fontWeight: 700 }}>
                Hạng
              </TableCell>
              <TableCell sx={{ fontSize: 20, fontWeight: 700 }}>Đội</TableCell>
              <TableCell align="center" sx={{ fontSize: 20, fontWeight: 700 }}>
                Điểm
              </TableCell>
              {/* <TableCell align="center" sx={{ fontSize: 20, fontWeight: 700 }}>
                Trạng thái
              </TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedTeams.map((team, index) => (
              <TableRow
                key={team.name}
                sx={{
                  ...getRowStyle(index),
                  height: 70,
                }}
              >
                <TableCell
                  align="center"
                  sx={{ fontSize: 22, fontWeight: 600 }}
                >
                  {index === 0 && (
                    <EmojiEventsIcon sx={{ mr: 1, fontSize: 28 }} />
                  )}
                  #{index + 1}
                </TableCell>

                <TableCell sx={{ fontSize: 22, fontWeight: 600 }}>
                  {team.name}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontSize: 22, fontWeight: 700 }}
                >
                  {team.totalScore}
                </TableCell>

                {/* <TableCell align="center">
                  {index < 4 && (
                    <Chip
                      label="Vào vòng trong"
                      color="success"
                      size="medium"
                      sx={{ fontSize: 14, fontWeight: 600 }}
                    />
                  )}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
