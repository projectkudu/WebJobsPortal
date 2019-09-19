import { style } from 'typestyle';

export const panelHeaderStyle = style({
  width: '100%',

  $nest: {
    h3: {
      display: 'inline-block',
      marginLeft: '15px',
      marginTop: '12px',
      fontSize: '20px',
    },

    svg: {
      height: '12px',
      width: '12px',
      float: 'right',
      marginTop: '18px',
      marginRight: '3px',
      cursor: 'pointer',
    },
  },
});

export const panelStyle = {
  content: [
    {
      padding: '0px',
      selectors: {
        '@media screen and (min-width: 1366px)': {
          padding: '0px',
        },
        '@media screen and (min-width: 640px)': {
          padding: '0px',
        },
      },
    },
  ],
};
