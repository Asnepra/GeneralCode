"use client";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@components/ui/input";
import { ArrowLeft, ArrowRight, PlusSquare, Wand2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AddTemplate from "./AddTemplate";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import { Separator } from "@components/ui/separator";

import { Button } from "@components/ui/button";
import toast from "react-hot-toast";

import qs from "query-string";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  countryData: { country_id: number; country_name: string }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  countryData,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [countryCategories, setCountryCategories] = useState([]);
  const [countrySelected, setCountrySelected] = useState(-1); // Use useState hook to manage countrySelected state
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const handleCreateProfile = () => {
    const selectedTemplates = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => (row.original as any).id);

    if (countrySelected === -1) {
      toast.error("Select country First");
    } else if (selectedTemplates.length === 0) {
      toast.error("Select at least 1 Template");
    } else {
      let currentQuery = {};
      if (params) {
        currentQuery = qs.parse(params.toString());
      }

      const updatedQuery = {
        ...currentQuery,
        countrySelected,
        selectedTemplates: selectedTemplates.join(","), // Join templates into a comma-separated string
      };

      const updatedQueryString = qs.stringify(updatedQuery);
      const url = `/createProfile?${updatedQueryString}`;
      console.log("url \n", url);
      router.push(url);
    }
  };

  const handleResetList = () => {};

  const handleCountrySelect = (selectedCountry: number) => {
    // This function will be called when a country is selected or changed
    console.log("Selected Country ID:", selectedCountry);
    setCountrySelected(selectedCountry);
    // Enter edit mode when a country is selected
    // ... (your additional actions here if needed)
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="m-2 space-y-2">
      <div className="flex items-center space-y-2 space-x-2">
        <Select
          onValueChange={(value) => {
            handleCountrySelect(+value);
          }}
        >
          <SelectTrigger className="max-w-xl mx-auto">
            <SelectValue placeholder="Select a Country" />
          </SelectTrigger>
          <SelectContent>
            {countryData?.map((category) => (
              <SelectItem
                key={category.country_id}
                value={category.country_name}
                onSelect={() => handleCountrySelect(category.country_id)} // Pass country_id here
              >
                {category.country_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-grow"></div>
        {/* This creates space between the input and button */}
        <Button size="default" onClick={handleResetList}>
          Reset List
        </Button>
      </div>
      <Separator className="bg-primary/10" />
      <div className="flex items-center space-y-2 space-x-2">
        <Input
          placeholder="Filter Template Name..."
          value={
            (table.getColumn("template_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("template_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex-grow"></div>
        {/* This creates space between the input and button */}
        <AddTemplate />
      </div>
      <div className="backdrop-blur-md bg-transparent/5 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/**pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground space-x-2 flex-row">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 flex-row">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft size={16} />
            <span className="mx-3">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="mx-3">Next</span>
            <ArrowRight size={16} />
          </Button>
        </div>
        <div>
          <Button size="default" type="submit" onClick={handleCreateProfile}>
            <Wand2 className="w-4 h-4 mx-2" />
            Create Country Profile
          </Button>{" "}
        </div>
      </div>
    </div>
  );
}
