import { useRef, useState } from 'react';

interface UploadProgress {
  percentage: number;
  uploadedChunks: number;
  totalChunks: number;
  status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error';
  message: string;
}

interface UploadFile {
  raw: File;
  hash: string | null;
  url: string | null;
  progress: UploadProgress;
}

export const useFileUploader = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const hashCache = useRef<Map<string, string>>(new Map());

  // Constants
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks for uploading
  const HASH_CHUNK_SIZE = 256 * 1024; // 256KB chunks for hashing (smaller to avoid UI blocking)

  const addFiles = (selectedFiles: FileList) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      raw: file,
      hash: null,
      url: null,
      progress: {
        percentage: 0,
        uploadedChunks: 0,
        totalChunks: 0,
        status: 'idle' as const,
        message: '文件已选择，点击上传开始',
      },
    }));

    const existingFilesNames = files.map((file) => file.raw.name);

    const _files: UploadFile[] = [];

    newFiles.map((item) => {
      if (existingFilesNames.includes(item.raw.name)) {
        console.log('file already exists', item.raw.name);
        return;
      }
      _files.push(item);
    });

    setFiles((prev) => [...prev, ..._files]);
  };

  const updateFileProgress = (fileId: string, progress: Partial<UploadProgress>) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.raw.name === fileId ? { ...file, progress: { ...file.progress, ...progress } } : file
      )
    );
  };

  // Calculate file hash (MD5) using smaller chunks and yield control more frequently
  const calculateHash = async (file: File, chunkSize: number): Promise<string> => {
    return new Promise((resolve) => {
      resolve('123');
      /* yarn add spark-md5 */
      // const chunks = Math.ceil(file.size / chunkSize);
      // const spark = new SparkMD5.ArrayBuffer();
      // let currentChunk = 0;

      // const reader = new FileReader();

      // // Process chunks using requestIdleCallback to keep UI responsive
      // const processChunk = (deadline?: IdleDeadline) => {
      //   // Check if we have enough time or need to yield
      //   if (deadline && deadline.timeRemaining() < 1) {
      //     requestIdleCallback(processChunk);
      //     return;
      //   }

      //   if (currentChunk < chunks) {
      //     const start = currentChunk * chunkSize;
      //     const end = Math.min(start + chunkSize, file.size);
      //     const chunk = file.slice(start, end);

      //     reader.readAsArrayBuffer(chunk);
      //   } else {
      //     // All chunks processed, finalize hash
      //     const hash = spark.end();
      //     hashCache.current.set(file.name, hash);
      //     resolve(hash);
      //   }
      // };

      // reader.onload = (e) => {
      //   if (e.target?.result) {
      //     spark.append(e.target.result as ArrayBuffer);
      //     currentChunk++;

      //     // Schedule next chunk processing during idle time
      //     requestIdleCallback(processChunk);
      //   }
      // };

      // reader.onerror = () => {
      //   updateFileProgress(file.name, {
      //     status: 'error',
      //     message: '计算文件哈希值失败',
      //   });
      // };

      // // Start processing the first chunk
      // requestIdleCallback(processChunk);
    });
  };

  // Check if file already exists or get uploaded chunks
  const checkFileStatus = async (hash: string, filename: string) => {
    try {
      const response = await fetch(`/api/upload?hash=${hash}&filename=${filename}`);
      const data = await response.json();

      if (data.exists) {
        // File already exists (fast upload)
        updateFileProgress(filename, {
          percentage: 100,
          uploadedChunks: 1,
          totalChunks: 1,
          status: 'completed',
          message: '文件秒传成功！',
        });

        setFiles((prev) =>
          prev.map((file) => (file.raw.name === filename ? { ...file, url: data.url } : file))
        );

        return { exists: true };
      } else {
        // File doesn't exist, but some chunks might be uploaded
        return {
          exists: false,
          uploadedChunks: data.uploadedChunks || [],
        };
      }
    } catch (error) {
      console.error('Error checking file status:', error);
      return { exists: false, uploadedChunks: [] };
    }
  };

  // Upload a single chunk
  const uploadChunk = async (
    chunk: Blob,
    index: number,
    hash: string,
    filename: string,
    totalChunks: number
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('hash', hash);
      formData.append('filename', filename);
      formData.append('chunkIndex', index.toString());
      formData.append('chunks', totalChunks.toString());

      const controller = abortControllers.current.get(filename);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller?.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Upload aborted');
        return { aborted: true };
      }
      throw error;
    }
  };

  // Upload file in chunks
  const uploadFile = async (file: UploadFile) => {
    try {
      const { raw, progress: currentProgress } = file;
      let hash = file.hash;

      // Reset state
      if (currentProgress.status !== 'paused') {
        updateFileProgress(raw.name, {
          percentage: 0,
          uploadedChunks: 0,
          totalChunks: 0,
          status: 'uploading',
          message: '准备上传...',
        });
      } else {
        /* resume */
        updateFileProgress(raw.name, {
          status: 'uploading',
          message: '继续上传文件...',
        });
      }

      // Create new abort controller
      const controller = new AbortController();
      abortControllers.current.set(raw.name, controller);

      // Calculate file hash
      if (!hash) {
        updateFileProgress(raw.name, { message: '计算文件哈希...' });
        hash = await calculateHash(raw, HASH_CHUNK_SIZE);

        setFiles((prev) => prev.map((f) => (f.raw.name === raw.name ? { ...f, hash } : f)));
      }

      // Check if file already exists or get uploaded chunks
      updateFileProgress(raw.name, { message: '检查文件状态...' });
      const { exists, uploadedChunks = [] } = await checkFileStatus(hash, raw.name);

      if (exists) return; // File already exists, no need to upload

      // Calculate total chunks
      const totalChunks = Math.ceil(raw.size / CHUNK_SIZE);
      updateFileProgress(raw.name, {
        totalChunks,
        message: '开始上传文件...',
      });

      // Upload chunks
      let completedChunks = 0;

      for (let i = 0; i < totalChunks; i++) {
        // Skip already uploaded chunks
        if (uploadedChunks.includes(i)) {
          completedChunks++;
          continue;
        }

        const start = i * CHUNK_SIZE;
        const end = Math.min(raw.size, start + CHUNK_SIZE);
        const chunk = raw.slice(start, end);

        // Update progress before chunk upload
        updateFileProgress(raw.name, {
          uploadedChunks: completedChunks,
          percentage: Math.floor((completedChunks / totalChunks) * 100),
          message: `上传分片 ${i + 1}/${totalChunks}...`,
        });

        // Upload chunk
        const result = await uploadChunk(chunk, i, hash, raw.name, totalChunks);

        if (result.aborted) {
          updateFileProgress(raw.name, {
            status: 'paused',
            message: '上传已暂停',
          });
          return;
        }

        completedChunks++;

        // Update progress after chunk upload
        updateFileProgress(raw.name, {
          uploadedChunks: completedChunks,
          percentage: Math.floor((completedChunks / totalChunks) * 100),
          message:
            completedChunks === totalChunks
              ? '所有分片上传完成，正在合并...'
              : `分片 ${i + 1}/${totalChunks} 上传完成`,
        });

        // If this was the last chunk, file is complete
        if (result.url) {
          updateFileProgress(raw.name, {
            percentage: 100,
            status: 'completed',
            message: '文件上传成功！',
          });

          setFiles((prev) =>
            prev.map((f) => (f.raw.name === raw.name ? { ...f, url: result.url } : f))
          );

          hashCache.current.delete(raw.name);
          abortControllers.current.delete(raw.name);
          break;
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      updateFileProgress(file.raw.name, {
        status: 'error',
        message: '上传失败，请重试',
      });
    }
  };

  const pauseUpload = (filename: string) => {
    const controller = abortControllers.current.get(filename);
    if (controller) {
      controller.abort();
      updateFileProgress(filename, {
        status: 'paused',
        message: '上传已暂停',
      });
    }
  };

  const resumeUpload = (filename: string) => {
    const file = files.find((f) => f.raw.name === filename);
    if (file) {
      uploadFile(file);
    }
  };

  const removeFile = (filename: string) => {
    const controller = abortControllers.current.get(filename);
    if (controller) {
      controller.abort();
    }
    abortControllers.current.delete(filename);
    hashCache.current.delete(filename);
    setFiles((prev) => prev.filter((file) => file.raw.name !== filename));
  };

  const resetAll = () => {
    // Abort all ongoing uploads
    abortControllers.current.forEach((controller) => {
      controller.abort();
    });

    // Clear all references
    abortControllers.current.clear();
    hashCache.current.clear();
    setFiles([]);
  };

  return {
    files,
    addFiles,
    removeFile,
    uploadFile,
    pauseUpload,
    resumeUpload,
    resetAll,
  };
};
