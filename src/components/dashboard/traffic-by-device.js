import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';

export const TrafficByDevice = (props) => {
  const theme = useTheme();
  console.log(props)
  const data = {
    datasets: [
      {
        data: [props.numbers?.kG,props.numbers?.from1Ton4,props.numbers?.from5To6,props.numbers?.from7To8,props.numbers?.from9To10,props.numbers?.from11T012],
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00','#065535','#800080','#7fffd4'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: ['KG', '1-4', '5-6','7-8','9-10','11-12']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [];

  return (
    <Card {...props}>
      <CardHeader title="Number by Grade" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {devices.map(({
            color,
           
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
            
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h4"
              >
                {value}
                
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
