"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import Modal from "./modal";
import axios from "axios";

enum STEPS {
  COUNTRY_TEMPLATE_SELECTION = 0,
  TEMPLATE_DETAILS = 1,
}
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
  const [countrySelected, setCountrySelected] = useState(""); // Use useState hook to manage countrySelected state
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(STEPS.COUNTRY_TEMPLATE_SELECTION);
  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const handleCreateProfile = useCallback(() => {
    let crrentQuery = {};

    const selectedTemplates = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);

    if (countrySelected === "") {
      toast.error("Select country First");
    } else if (selectedTemplates.length === 0) {
      toast.error("Select at least 1 Template");
    } else {
    }
  }, []);

  const handleResetList = () => {};

  const handleCountrySelect = (selectedCountry: string) => {
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

  const handleSubmit = useCallback(() => {
    if (step !== STEPS.TEMPLATE_DETAILS) {
      return onNext();
    }

    // axios
    //   .post("/api/listings", data)
    //   .then(() => {
    //     toast.success("Listing created!");
    //     router.refresh();
    //     reset();
    //     setStep(STEPS.CATEGORY);
    //   })
    //   .catch(() => {
    //     toast.error("Something went wrong.");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  }, []);

  const actionLabel = useMemo(() => {
    if (step === STEPS.TEMPLATE_DETAILS) {
      return "Create File";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.COUNTRY_TEMPLATE_SELECTION) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="m-2 space-y-2">
      <div className="flex items-center space-y-2 space-x-2">
        <Select
          onValueChange={(value) => {
            handleCountrySelect(value);
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

  if (step === STEPS.TEMPLATE_DETAILS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div title="Where is your place located?" />
      </div>
    );
  }

  var templateDetails = <div className=""></div>;

  return (
    <Modal
      title="Airbnb your home!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={
        step === STEPS.COUNTRY_TEMPLATE_SELECTION ? undefined : onBack
      }
      body={bodyContent}
    />
  );
}

// "use client";

// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/navigation";
// import { useMemo, useState } from "react";
// import Modal from "./modal";

// enum STEPS {
//   CATEGORY = 0,
//   LOCATION = 1,
//   INFO = 2,
//   IMAGES = 3,
//   DESCRIPTION = 4,
//   PRICE = 5,
// }

// const RentModal = () => {
//   const router = useRouter();

//   const [isLoading, setIsLoading] = useState(false);
//   const [step, setStep] = useState(STEPS.CATEGORY);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm<FieldValues>({
//     defaultValues: {
//       category: "",
//       location: null,
//       guestCount: 1,
//       roomCount: 1,
//       bathroomCount: 1,
//       imageSrc: "",
//       price: 1,
//       title: "",
//       description: "",
//     },
//   });

//   const location = watch("location");
//   const category = watch("category");

//   const setCustomValue = (id: string, value: any) => {
//     setValue(id, value, {
//       shouldDirty: true,
//       shouldTouch: true,
//       shouldValidate: true,
//     });
//   };

//   const onBack = () => {
//     setStep((value) => value - 1);
//   };

//   const onNext = () => {
//     setStep((value) => value + 1);
//   };

//   const onSubmit: SubmitHandler<FieldValues> = (data) => {
//     if (step !== STEPS.PRICE) {
//       return onNext();
//     }

//     setIsLoading(true);

//     axios
//       .post("/api/listings", data)
//       .then(() => {
//         toast.success("Listing created!");
//         router.refresh();
//         reset();
//         setStep(STEPS.CATEGORY);
//       })
//       .catch(() => {
//         toast.error("Something went wrong.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const actionLabel = useMemo(() => {
//     if (step === STEPS.PRICE) {
//       return "Create";
//     }

//     return "Next";
//   }, [step]);

//   const secondaryActionLabel = useMemo(() => {
//     if (step === STEPS.CATEGORY) {
//       return undefined;
//     }

//     return "Back";
//   }, [step]);

//   let bodyContent = (
//     <div className="flex flex-col gap-8">
//       <div
//         className="
//           grid
//           grid-cols-1
//           md:grid-cols-2
//           gap-3
//           max-h-[50vh]
//           overflow-y-auto
//         "
//       >
//         Default category first screen select country and atble
//       </div>
//     </div>
//   );

//   if (step === STEPS.LOCATION) {
//     bodyContent = (
//       <div className="flex flex-col gap-8">
//         <div title="Where is your place located?" />
//       </div>
//     );
//   }

//   return (
//     <Modal
//       disabled={isLoading}
//       title="Airbnb your home!"
//       actionLabel={actionLabel}
//       onClose={() => {}}
//       onSubmit={handleSubmit(onSubmit)}
//       secondaryActionLabel={secondaryActionLabel}
//       secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
//       body={bodyContent}
//     />
//   );
// };

// export default RentModal;
