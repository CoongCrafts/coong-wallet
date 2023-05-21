import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Props } from 'types';
import { isTouchDevice } from 'utils/device';

interface GettingJsonFileProps extends Props {
  onResult: (data: string) => void;
}

const touchDevice = isTouchDevice();

function JsonFileReader({ onResult }: GettingJsonFileProps): JSX.Element {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onerror = () => toast.error('File reading was aborted!');
      reader.onabort = () => toast.error('File reading was failed!');
      reader.onload = () => {
        const data = reader.result;
        data && onResult(data as string);
      };

      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps({
        className: 'mt-6 w-full py-6 bg-black/10 dark:bg-white/15 cursor-pointer flex items-center justify-center',
      })}>
      <input {...getInputProps({ accept: 'application/json' })} />
      {!touchDevice ? (
        isDragActive ? (
          <em>Drop the file here...</em>
        ) : (
          <em>Click to select or drag and drop the file here</em>
        )
      ) : (
        <em>Click to select file</em>
      )}
    </div>
  );
}
export default JsonFileReader;
