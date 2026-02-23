// TeamRankingTable.tsx
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Team } from "@/types/contest";

type Props = {
  teams: Team[];
};

export const TeamRankingTable = ({ teams }: Props) => {
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontWeight={600}>Hạng</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={600}>Đội</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight={600}>Điểm</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((team, index) => (
            <TableRow key={team.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{team.name}</TableCell>
              <TableCell align="right">{team.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
