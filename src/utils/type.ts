export interface IFileUploaderProps {
  orderNumber: string | null;
  subFolder: string;
  docType?: string;
}

export interface ICashListItem {
  ID: number;
  Title: string;
  count: string;
  due_date: string;
  reference_number: string;
  status: string;
  customer_GUID: string;
  bank_account: string;
  description: string;
}

export interface ITableUIProps {
  data: ICashListItem[] | undefined;
  backgroundColor?: string;
}