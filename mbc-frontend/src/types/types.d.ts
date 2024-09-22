type ChatMessage = {
  id: string;
  files?: FilePreview[];
  query?: string;
  response?: string;
  isLoading?: boolean;
};

type FilePreview = {
  file: File;
  previewUrl: string;
};
