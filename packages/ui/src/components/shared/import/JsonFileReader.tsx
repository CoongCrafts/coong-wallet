import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Props } from 'types';
import { isTouchDevice } from 'utils/device';

const touchDevice = isTouchDevice();

interface JsonFileReaderProps extends Props {
  onResult: (data: string) => void;
}

function JsonFileReader({ onResult }: JsonFileReaderProps): JSX.Element {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onerror = () => toast.error(t<string>('File reading was failed!'));
      reader.onabort = () => toast.error(t<string>('File reading was aborted!'));
      reader.onload = () => {
        const data = reader.result;
        data && onResult(data as string);
      };

      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div
      {...getRootProps({
        className: 'mt-6 w-full py-6 bg-black/10 dark:bg-white/15 cursor-pointer flex items-center justify-center',
      })}>
      <input {...getInputProps({ accept: 'application/json' })} />
      {!touchDevice ? (
        isDragActive ? (
          <em>{t<string>('Drop the file here...')}</em>
        ) : (
          <em>{t<string>('Click to select or drag and drop the file here')}</em>
        )
      ) : (
        <em>{t<string>('Click to select file')}</em>
      )}
    </div>
  );
}
export default JsonFileReader;
