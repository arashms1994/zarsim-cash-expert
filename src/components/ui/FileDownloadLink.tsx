import { BASE_URL } from "@/api/base";
import type { IFileDownloadLinkProps } from "@/utils/type";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

const FileDownloadLink: React.FC<IFileDownloadLinkProps> = ({
  customerGuid,
  itemGuid,
}) => {
  const [fileUrl, setFileUrl] = useState<string | null | undefined>(undefined);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    async function fetchFile() {
      try {
        const folderPath = `/Cash_AttachFiles/${customerGuid}/${itemGuid}`;
        const encodedFolderPath = folderPath.replace(/_/g, "%5F"); // فقط برای underscore اینکارو می‌کنیم، بقیه رو نگه دار

        const url = `${BASE_URL}/_api/web/GetFolderByServerRelativeUrl('${encodedFolderPath}')/Files`;
        console.log("Fetch URL:", url);

        const response = await fetch(url, {
          headers: { Accept: "application/json;odata=verbose" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.d && data.d.results.length > 0) {
          const file = data.d.results[0];
          const encodedUrl = encodeURI(`${BASE_URL}${file.ServerRelativeUrl}`);
          setFileUrl(encodedUrl);
          setFileName(file.Name);
        } else {
          setFileUrl(null);
        }
      } catch (error) {
        console.error("Error fetching file:", error);
        setFileUrl(null);
      }
    }

    fetchFile();
  }, [customerGuid, itemGuid]);

  if (fileUrl === undefined)
    return (
      <div>
        <Skeleton className="w-5 h-5" />
      </div>
    );

  if (fileUrl === null) return <div>فایل یافت نشد</div>;

  return (
    <div className="flex flex-col items-start gap-2 p-2 border-2 border-[#0d8957] rounded">
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0d8957] font-semibold underline text-base"
      >
        دانلود فایل
      </a>
      <p className="hidden">{fileName}</p>
    </div>
  );
};

export default FileDownloadLink;
