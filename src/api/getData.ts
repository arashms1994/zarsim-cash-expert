import { useQuery } from "@tanstack/react-query";
import type { ICashListItem } from "@/utils/type";
import { BASE_URL } from "./base";

export async function getAllCashListItems(): Promise<ICashListItem[]> {
  const listTitle = "Cash_List";
  let items: ICashListItem[] = [];

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$top=100&$orderby=ID desc`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error("خطا در گرفتن آیتم‌های Cash_List: " + err);
    }

    const json: { d: { results: ICashListItem[]; __next?: string } } =
      await res.json();

    const results = json.d?.results;
    if (!Array.isArray(results)) {
      throw new Error("ساختار داده‌ی برگشتی نامعتبر است");
    }

    items = [...items, ...results];
    nextUrl = json.d.__next ?? null;
  }

  return items;
}

export function useCashListItems() {
  return useQuery<ICashListItem[], Error>({
    queryKey: ["cashListItems"],
    queryFn: () => getAllCashListItems(),
    staleTime: 2000,
  });
}
