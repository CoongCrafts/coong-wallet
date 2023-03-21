import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from 'types';

const InvalidRequest: FC<Props> = ({ className = '', reason }) => {
  const { t } = useTranslation();

  return (
    <div className={`${className} text-center`}>
      <h2>{t<string>('Invalid Request')}</h2>
      {reason && <p>Reason: {reason}</p>}
      <p>{t<string>("If you open this page by accident, it's safe to close it now.")}</p>
    </div>
  );
};

export default InvalidRequest;
