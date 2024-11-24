import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
} from "use-file-picker/validators";

export function useOpenAudioFilePicker() {
  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: "ArrayBuffer",
    accept: "audio/*",
    multiple: true,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator([
        "wav",
        "mp3",
        "aiff",
        "flac",
        "ogg",
        "m4a",
        "aac",
      ]),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
    ],
  });

  return [openFilePicker, filesContent, loading, errors] as const;
}
