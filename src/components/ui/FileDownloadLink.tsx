import { BASE_URL } from "@/api/base";
import { Skeleton } from "./skeleton";
import { useFiles } from "@/api/getData";
import type { IFileDownloadLinkProps } from "@/utils/type";

const FileDownloadLink: React.FC<IFileDownloadLinkProps> = ({
  customerGuid,
  itemGuid,
}) => {
  const {
    data: files = [],
    isLoading,
    error,
  } = useFiles({ customerGuid, itemGuid });

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-32 h-5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">{error.message || "خطایی رخ داد"}</div>
    );
  }

  if (files.length === 0) {
    return <div>هیچ فایلی یافت نشد</div>;
  }

  return (
    <div className="flex flex-col items-start justify-center gap-2 p-2 border-2 border-[#0d8957] rounded text-center">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex justify-center items-center gap-2 text-center w-full h-full"
        >
          <a
            href={encodeURI(`${BASE_URL}${file.ServerRelativeUrl}`)}
            download={file.Name}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0d8957] font-semibold underline text-base"
          >
            دانلود رسید
          </a>
        </div>
      ))}
    </div>
  );
};

export default FileDownloadLink;
