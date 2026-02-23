import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  searchValue: string;
  onChange: (value: string) => void;
  searchPlaceholder?: string;
};

export const SearchBar = (props: SearchBarProps) => {
  const { searchValue, onChange, searchPlaceholder } = props;

  return (
    <TextField
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiInputBase-input": {
          padding: 1,
        },
      }}
      onChange={(event): void => onChange(event.target.value)}
      placeholder={searchPlaceholder ? searchPlaceholder : "Search"}
      value={searchValue}
    />
  );
};
