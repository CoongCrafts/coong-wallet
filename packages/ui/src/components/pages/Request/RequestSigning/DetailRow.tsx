import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Props } from 'types';

export enum ValueStyle {
  TEXT_BOLD,
  BOX,
}

export interface DetailRowProps extends Props {
  name: string;
  value: any;
  breakWord?: boolean;
  style?: ValueStyle;
}

const DetailRow: FC<DetailRowProps> = ({ name, value, breakWord = false, style = ValueStyle.TEXT_BOLD }) => {
  const { t } = useTranslation();
  const renderValue = () => {
    switch (style) {
      case ValueStyle.BOX:
        return (
          <div className='py-2 px-4 bg-black/10 dark:bg-white/15 border border-black/10 dark:border-white/15 w-full'>
            {value}
          </div>
        );
      case ValueStyle.TEXT_BOLD:
      default:
        return <strong className={clsx({ 'break-all': breakWord })}>{value}</strong>;
    }
  };

  return (
    <div className='flex items-start mb-2 gap-2' data-testid={`row-${name.replace(' ', '-')}`}>
      <div className='text-gray-500 dark:text-gray-200 min-w-[80px] text-right'>{t<string>(name)}: </div>
      {renderValue()}
    </div>
  );
};
export default DetailRow;
