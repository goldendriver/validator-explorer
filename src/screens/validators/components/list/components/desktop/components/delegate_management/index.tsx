import React, { useState } from 'react';
import classnames from 'classnames';
import Select from 'react-select';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  DialogActions,
  InputBase,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useTranslation from 'next-translate/useTranslation';
import { useRecoilValue } from 'recoil';
import {
  readAddress, readBalance,
} from '@recoil/wallet';
import { useDelegateManagement } from './hooks';
import { useStyles } from './styles';

const DelegateManagement: React.FC<{
  className?: string;
  validator: string;
  allValidators: Array<string>;
}> = (props) => {
  const { t } = useTranslation('validators');
  const address = useRecoilValue(readAddress);
  const balance = useRecoilValue(readBalance);
  const [isDelegated, setIsDelegated] = useState<boolean>(false);
  const [delegationAmount, setDelegationAmount] = useState<string>('0');
  const [rewardAmount, setRewardAmount] = useState<string>('0');
  const [newValidator, setNewValidator] = useState<string>('');
  const {
    open,
    status,
    amount,
    handleOpen,
    handleClose,
    handleChangeStatus,
    handleChangeAmount,
    handleDelegate,
    handleUndelegate,
    handleRedelegate,
    handleClaimReward,
    getDelegationInfo,
    getRewardInfo,
  } = useDelegateManagement(props.validator);
  const handleDelegationAmount = (metamaskAddress: string, validatorAddr: string) => {
    getDelegationInfo(metamaskAddress, validatorAddr).then((res) => {
      if (res === 0) {
        setIsDelegated(false);
      } else {
        setIsDelegated(true);
        setDelegationAmount(res.balance.amount);
      }
    });
  };

  const handleRewardAmount = (metamaskAddress: string, validatorAddr: string) => {
    if (isDelegated === true) {
      getRewardInfo(metamaskAddress, validatorAddr).then((res) => {
        setRewardAmount(res);
      });
    } else {
      setRewardAmount('0');
    }
  };

  const classes = useStyles();

  let button: JSX.Element;
  if (status === 'delegate') {
    button = (
      <>
        <Button
          onClick={() => handleChangeStatus(null)}
        >
          Back
        </Button>
        <Button
          color="primary"
          disabled={!amount}
          onClick={() => handleDelegate(address)}
        >
          Delegate
        </Button>
      </>
    );
  } else if (status === 'undelegate') {
    button = (
      <>
        <Button
          onClick={() => handleChangeStatus(null)}
        >
          Back
        </Button>
        <Button
          color="secondary"
          onClick={() => handleUndelegate(address)}
        >
          Undelegate
        </Button>
      </>
    );
  } else if (status === 'redelegate') {
    button = (
      <>
        <Button
          onClick={() => handleChangeStatus(null)}
        >
          Back
        </Button>
        <Button
          onClick={() => handleRedelegate(address, props.validator, newValidator)}
          className={classnames(classes.redelegateButton)}
        >
          Redelegate
        </Button>
      </>
    );
  } else if (status === 'claimReward') {
    button = (
      <>
        <Button
          onClick={() => handleChangeStatus(null)}
        >
          Back
        </Button>
        <Button
          onClick={() => handleClaimReward(address, props.validator)}
          className={classnames(classes.claimButton)}
        >
          Claim Reward
        </Button>
      </>
    );
  } else {
    button = (
      <>
        <div className={classnames(classes.buttonGroup)}>
          <div>
            <div>
              <Button
                color="primary"
                disabled={!(balance && parseInt(balance, 10) > 0)}
                onClick={() => handleChangeStatus('delegate')}
              >
                Delegate
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handleChangeStatus('redelegate')}
                className={classnames(classes.redelegateButton)}
                disabled={!(parseInt(delegationAmount, 10) > 0)}
              >
                Redelegate
              </Button>
            </div>
          </div>
          <div>
            <div>
              <Button
                color="secondary"
                onClick={() => handleChangeStatus('undelegate')}
                disabled={!(parseInt(delegationAmount, 10) > 0)}
              >
                Undelegate
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handleChangeStatus('claimReward')}
                className={classnames(classes.claimButton)}
                disabled={!(parseInt(rewardAmount, 10) > 0)}
              >
                Claim Reward
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div>
      <Button
        disabled={!address}
        variant="contained"
        color="primary"
        onClick={() => {
          handleOpen();
          handleDelegationAmount(address, props.validator);

          handleRewardAmount(address, props.validator);
        }}
      >
        {t('manage')}
      </Button>
      <Dialog
        className={classnames(classes.root)}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <Typography variant="h2">
            {status === null && t('delegate')}
            {status === 'delegate' && t('delegate')}
            {status === 'undelegate' && t('undelegate')}
            {status === 'redelegate' && t('redelegate')}
            {status === 'claimReward' && t('claimReward')}
          </Typography>
          <IconButton aria-label="close" className={classes.closeIcon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className={classnames(classes.listItem)}>
            <Typography className="label">
              {`${t('availableBalance')}:`}
            </Typography>
            <Typography className="value">
              {`${balance && parseInt(balance, 10) > 0
                ? (parseInt(balance, 10) / (10 ** 18)).toPrecision(4)
                : 0} CC`}
            </Typography>
          </div>
          {status !== null && (
            <>
              <div className={classnames(classes.listItem)}>
                <Typography className="label">
                  {`${t('myDelegation')}:`}
                </Typography>
                <Typography className="value">
                  {`${delegationAmount && parseInt(delegationAmount, 10) > 0
                    ? (parseInt(delegationAmount, 10) / (10 ** 18)).toPrecision(4)
                    : 0} CC`}
                </Typography>
              </div>
              {status === 'redelegate' && (
                <div className={classnames(classes.formItem)}>
                  <Typography className="form-label">
                    Destination validator
                  </Typography>
                  <div>
                    <Select
                      // className="react-select-container"
                      // classNamePrefix="react-select"
                      placeholder="choose a validator..."
                      maxMenuHeight={80}
                      options={props.allValidators.map((val) => {
                        // take out the current validator from the list
                        if (
                          val !== props.validator
                        ) {
                          return {
                            value: val,
                            label: val,
                          };
                        }
                        return {};
                      })}
                      onChange={(val) => {
                        setNewValidator(val?.value);
                      }}
                    />
                  </div>
                </div>
              )}
              {status !== 'claimReward' ? (
                <>
                  <div className={classnames(classes.formItem)}>
                    <Typography className="form-label">
                      {`${t('amount')} to ${status}:`}
                    </Typography>
                    <InputBase
                      className="form-control"
                      value={amount}
                      onChange={handleChangeAmount}
                      endAdornment={(
                        <Typography>CC</Typography>
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={classnames(classes.listItem)}>
                    <Typography className="label">
                      My Rewards:
                    </Typography>
                    {/* <InputBase
                      className="form-control"
                      value={amount}
                      onChange={handleChangeAmount}
                      endAdornment={(
                        <Typography>23</Typography>
                      )}
                    /> */}
                    <Typography className="value">
                      {`${rewardAmount && parseInt(rewardAmount, 10) > 0
                        ? (parseInt(rewardAmount, 10) / (10 ** 18)).toPrecision(4)
                        : 0} CC`}
                    </Typography>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {button}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DelegateManagement;
