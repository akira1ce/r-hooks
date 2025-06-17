# useFileUploader

文件上传管理 hook，支持分片上传、断点续传、进度追踪等高级功能。

> **注意：** 此 hook 依赖特定的后端 API 接口和文件哈希算法，需要根据实际项目需求进行适配。建议参考源码实现逻辑，结合自己的后端服务进行定制开发。

## 功能

提供完整的文件上传解决方案，包括：
- 分片上传（2MB 块大小）
- 文件哈希计算和秒传
- 断点续传
- 上传进度实时追踪
- 上传暂停和恢复
- 批量文件管理

## 用法

```tsx
import { useFileUploader } from 'r-hooks';

function FileUploadComponent() {
  const {
    files,
    addFiles,
    removeFile,
    uploadFile,
    pauseUpload,
    resumeUpload,
    resetAll
  } = useFileUploader();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileSelect} />
      
      {files.map(file => (
        <div key={file.raw.name}>
          <span>{file.raw.name}</span>
          <span>{file.progress.percentage}%</span>
          <span>{file.progress.message}</span>
          
          {file.progress.status === 'idle' && (
            <button onClick={() => uploadFile(file)}>上传</button>
          )}
          
          {file.progress.status === 'uploading' && (
            <button onClick={() => pauseUpload(file.raw.name)}>暂停</button>
          )}
          
          {file.progress.status === 'paused' && (
            <button onClick={() => resumeUpload(file.raw.name)}>继续</button>
          )}
          
          <button onClick={() => removeFile(file.raw.name)}>删除</button>
        </div>
      ))}
      
      <button onClick={resetAll}>清空所有</button>
    </div>
  );
}
```

## 入参类型

```typescript
function useFileUploader(): {
  files: UploadFile[];
  addFiles: (selectedFiles: FileList) => void;
  removeFile: (filename: string) => void;
  uploadFile: (file: UploadFile) => Promise<void>;
  pauseUpload: (filename: string) => void;
  resumeUpload: (filename: string) => void;
  resetAll: () => void;
}
```

## 返回类型

```typescript
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

{
  files: UploadFile[];
  addFiles: (selectedFiles: FileList) => void;
  removeFile: (filename: string) => void;
  uploadFile: (file: UploadFile) => Promise<void>;
  pauseUpload: (filename: string) => void;
  resumeUpload: (filename: string) => void;
  resetAll: () => void;
}
```

### 返回值

| 属性         | 类型                                  | 描述               |
| ------------ | ------------------------------------- | ------------------ |
| files        | `UploadFile[]`                        | 文件列表           |
| addFiles     | `(selectedFiles: FileList) => void`   | 添加文件到上传队列 |
| removeFile   | `(filename: string) => void`          | 从队列中移除文件   |
| uploadFile   | `(file: UploadFile) => Promise<void>` | 开始上传指定文件   |
| pauseUpload  | `(filename: string) => void`          | 暂停上传           |
| resumeUpload | `(filename: string) => void`          | 恢复上传           |
| resetAll     | `() => void`                          | 重置所有文件和状态 |

### UploadFile 结构

| 属性     | 类型             | 描述                   |
| -------- | ---------------- | ---------------------- |
| raw      | `File`           | 原始文件对象           |
| hash     | `string \| null` | 文件哈希值（用于秒传） |
| url      | `string \| null` | 上传完成后的文件 URL   |
| progress | `UploadProgress` | 上传进度信息           |

### UploadProgress 结构

| 属性           | 类型                                                          | 描述               |
| -------------- | ------------------------------------------------------------- | ------------------ |
| percentage     | `number`                                                      | 上传百分比 (0-100) |
| uploadedChunks | `number`                                                      | 已上传的分片数量   |
| totalChunks    | `number`                                                      | 总分片数量         |
| status         | `'idle' \| 'uploading' \| 'paused' \| 'completed' \| 'error'` | 上传状态           |
| message        | `string`                                                      | 状态描述信息       |

## 特性说明

### 分片上传
- 将大文件分割为 2MB 的小块
- 支持并发上传多个分片
- 自动处理分片合并

### 秒传功能
- 计算文件哈希值（当前为模拟实现）
- 服务器检查文件是否已存在
- 已存在文件直接返回 URL

### 断点续传
- 暂停上传时保存已上传的分片信息
- 恢复时从未上传的分片继续
- 网络中断自动重试

### 进度追踪
- 实时更新上传百分比
- 显示已上传/总分片数
- 提供详细的状态消息

## API 要求

需要服务端提供以下 API：

```typescript
// 检查文件状态
GET /api/upload?hash=${hash}&filename=${filename}
// 返回: { exists: boolean, url?: string, uploadedChunks?: number[] }

// 上传分片
POST /api/upload
// FormData: { file: Blob, hash: string, filename: string, chunkIndex: string, chunks: string }
// 返回: { url?: string } (最后一个分片返回完整文件 URL)
```