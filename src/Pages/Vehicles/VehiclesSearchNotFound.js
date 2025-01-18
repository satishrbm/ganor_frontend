import PropTypes from "prop-types";
// material
import { Paper, Typography } from "@mui/material";

// ----------------------------------------------------------------------

DeliveryBoySearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function DeliveryBoySearchNotFound({
  searchQuery = "",
  ...other
}) {
  return (
    <Paper
      sx={{ boxShadow: "8px 16px 20px rgb(145 158 171/24%)", paddingBlock: 1 }}
      {...other}
    >
      <Typography gutterBottom align="center" variant="subtitle1">
        No data found
      </Typography>
      {searchQuery && (
        <Typography variant="body2" align="center">
          No results found for &nbsp;
          <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or
          using complete words.
        </Typography>
      )}
    </Paper>
  );
}
