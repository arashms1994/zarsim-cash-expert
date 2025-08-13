import { handleApprove, handleReject } from "@/api/addData";
import type { ICashListItem } from "@/utils/type";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useState } from "react";

export const ActionsCell: React.FC<{ cashItem: ICashListItem }> = ({
  cashItem,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const queryClient = useQueryClient();

  const onApprove = async () => {
    setIsApproving(true);
    try {
      await handleApprove(cashItem);
      queryClient.invalidateQueries({ queryKey: ["cashListItems"] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsApproving(false);
    }
  };

  const onReject = async () => {
    setIsRejecting(true);
    try {
      await handleReject(cashItem);
      queryClient.invalidateQueries({ queryKey: ["cashListItems"] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRejecting(false);
    }
  };

  if (cashItem.status === "1") {
    return <div className="text-green-600 font-semibold">تأیید شده</div>;
  }

  if (cashItem.status === "2") {
    return <div className="text-red-600 font-semibold">رد شده</div>;
  }

  if (cashItem.status === "" || cashItem.status === "0") {
    return (
      <div className="space-x-2 flex items-center justify-center">
        <div
          onClick={onApprove}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
            isApproving ? "bg-gray-400" : "bg-green-400 hover:bg-green-600"
          }`}
          title="تأیید"
        >
          {isApproving ? (
            <span className="text-xs">در حال پردازش...</span>
          ) : (
            <Check color="black" />
          )}
        </div>

        <div
          onClick={onReject}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
            isRejecting ? "bg-gray-400" : "bg-red-400 hover:bg-red-600"
          }`}
          title="رد"
        >
          {isRejecting ? (
            <span className="text-xs">در حال پردازش...</span>
          ) : (
            <X color="black" />
          )}
        </div>
      </div>
    );
  }

  return <div className="text-gray-500">وضعیت نامعتبر</div>;
};
