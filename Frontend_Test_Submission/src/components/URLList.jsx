import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

const URLList = ({ urls, fetchStats }) => {
  if (urls.length === 0) return null;

  return (
    <List>
      {urls.map((item, index) => (
        <React.Fragment key={item.id}>
          <ListItem
            secondaryAction={
              <Tooltip title="View Stats">
                <IconButton edge="end" onClick={() => fetchStats(item.shortcode)}>
                  <BarChartIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemText
              primary={
                <a href={item.shortLink} target="_blank" rel="noopener noreferrer">
                  {item.shortLink}
                </a>
              }
              secondary={`Original: ${item.originalUrl}`}
            />
          </ListItem>
          {index < urls.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default URLList;
