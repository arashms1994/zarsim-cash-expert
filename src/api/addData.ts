import { BASE_URL } from "./base";
import { getDigest } from "../utils/getDigest";
import type { ICashListItem } from "@/utils/type";

export async function addCashReceipt(data: {
  Title: string;
  count: string;
  reference_number: string;
  due_date: string;
  status: string;
}) {
  const listName = "Cash_List";
  const itemType = "SP.Data.Cash_x005f_ListListItem";

  try {
    const digest = await getDigest();

    await fetch(`${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      body: JSON.stringify({
        __metadata: { type: itemType },
        ...data,
      }),
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("خطا:", err.message);
    } else {
      console.error("خطای ناشناس:", err);
    }
  }
}

export async function updateCashReceipt(
  data: {
    Title: string;
    count: string;
    reference_number: string;
    due_date: string;
    status: string;
  },
  ID: number
) {
  const listName = "Cash_List";
  const itemType = "SP.Data.Cash_x005f_ListListItem";

  try {
    const digest = await getDigest();

    await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items(${ID})`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": digest,
          "X-HTTP-Method": "MERGE",
          "IF-MATCH": "*",
        },
        body: JSON.stringify({
          __metadata: { type: itemType },
          ...data,
        }),
      }
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error("خطا:", err.message);
    } else {
      console.error("خطای ناشناس:", err);
    }
  }
}

export const handleApprove = async (cashItem: ICashListItem) => {
  try {
    await updateCashReceipt(
      {
        Title: cashItem.Title,
        count: cashItem.count,
        reference_number: cashItem.reference_number,
        due_date: cashItem.due_date,
        status: "1",
      },
      cashItem.ID
    );
    console.log(`درخواست ${cashItem.ID} تأیید شد`);
  } catch (err) {
    console.error("خطا در تأیید درخواست:", err);
  }
};

export const handleReject = async (cashItem: ICashListItem) => {
  try {
    await updateCashReceipt(
      {
        Title: cashItem.Title,
        count: cashItem.count,
        reference_number: cashItem.reference_number,
        due_date: cashItem.due_date,
        status: "2", // رد
      },
      cashItem.ID
    );
    console.log(`درخواست ${cashItem.ID} رد شد`);
  } catch (err) {
    console.error("خطا در رد درخواست:", err);
  }
};
