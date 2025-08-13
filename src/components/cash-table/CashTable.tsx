import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ICashListItem } from "@/utils/type";
import { useCashListItems } from "@/api/getData";
import { Skeleton } from "../ui/skeleton";
import {
  ArrowUpDown,
  Check,
  CircleChevronLeft,
  CircleChevronRight,
  X,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FileDownloadLink from "../ui/FileDownloadLink";
import { handleApprove, handleReject } from "@/api/addData";

const columns: ColumnDef<ICashListItem>[] = [
  {
    accessorKey: "reference_number",
    header: "شماره مرجع",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("reference_number")}</div>
    ),
  },

  {
    accessorKey: "customer_title",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        نام مشتری
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("customer_title")}</div>,
  },

  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        تاریخ واریز
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("due_date")}</div>,
  },

  {
    accessorKey: "count",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        مبلغ (ريال)
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("count")}</div>,
  },

  {
    accessorKey: "bank_account",
    header: "شماره حساب",
    cell: ({ row }) => <div>{row.getValue("bank_account")}</div>,
  },

  {
    accessorKey: "description",
    header: "توضیحات",
    cell: ({ row }) => (
      <div>{row.getValue("description") || "توضیحاتی وجود ندارد."}</div>
    ),
  },

  {
    id: "download",
    header: "دانلود رسید",
    cell: ({ row }) => {
      const cashItem = row.original;
      return (
        <FileDownloadLink
          customerGuid={cashItem.customer_GUID}
          itemGuid={cashItem.Title}
        />
      );
    },
    enableSorting: false,
    enableHiding: true,
  },

  {
    id: "actions",
    header: "عملیات",
    enableHiding: false,
    cell: ({ row }) => {
      const cashItem = row.original;
      return (
        <div className="space-x-2 flex items-center justify-center">
          <div
            className="flex items-center justify-center bg-green-400 p-2 rounded-full transition-all duration-300 hover:bg-green-600"
            onClick={() => handleApprove(cashItem)}
          >
            <Check color="black" />
          </div>

          <div
            className="flex items-center justify-center bg-red-400 p-2 rounded-full transition-all duration-300 hover:bg-red-600"
            onClick={() => handleReject(cashItem)}
          >
            <X color="black" />
          </div>
        </div>
      );
    },
  },
];

export function CashTable() {
  const { data: cashListItems = [], isLoading } = useCashListItems();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: cashListItems,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Input
        placeholder="جست و جوی شماره مرجع ..."
        value={
          (table.getColumn("reference_number")?.getFilterValue() as string) ??
          ""
        }
        onChange={(event) =>
          table
            .getColumn("reference_number")
            ?.setFilterValue(event.target.value)
        }
        className="max-w-sm px-2"
      />

      <div className="overflow-hidden rounded-md border my-3">
        <Table>
          <TableHeader className="bg-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  هیچ داده‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2 flex items-center justify-center">
          <div
            className="flex items-center justify-center p-2 rounded-full hover:bg-slate-300 transition-all duration-300"
            onClick={() => table.nextPage()}
          >
            <CircleChevronRight color="black" />
          </div>

          <div
            className="flex items-center justify-center p-2 rounded-full hover:bg-slate-300 transition-all duration-300"
            onClick={() => table.previousPage()}
          >
            <CircleChevronLeft color="black" />
          </div>
        </div>
      </div>
    </div>
  );
}
