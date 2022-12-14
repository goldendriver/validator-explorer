import { makeStyles } from '@material-ui/core/styles';

export const useStyles = () => {
  const styles = makeStyles(
    (theme) => {
      return ({
        root: {
          width: '100%',
          background: theme.palette.background.default,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: theme.spacing(3),
        },
        oneRow: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        },
        a: {
          lineHeight: 0,
          zIndex: 200,
        },
        logo: {
          width: '120px',
          '&:hover': {
            cursor: 'pointer',
          },
        },
        actions: {
          width: '70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 5000,
        },
        searchBar: {
          flex: 1,
          marginRight: theme.spacing(2),
          '&.open': {
            '& .MuiInputBase-root': {
              background: theme.palette.background.default,
            },
          },
        },
        connectWallet: {
          marginRight: theme.spacing(2),
        },
        network: {
          marginRight: theme.spacing(2),
          '&.open': {
            background: theme.palette.background.default,
          },
        },
        networkList: {
          width: '100%',
          zIndex: 1201,
          opacity: 0,
          visibility: 'hidden',
          transition: '0.2s ease-in-out',
          position: 'fixed',
          top: 0,
          left: 0,
          '&.open': {
            opacity: 1,
            visibility: 'visible',
          },
        },
      });
    },
  )();

  return styles;
};
