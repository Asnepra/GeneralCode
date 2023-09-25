"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import Link from "next/link";
import { cn } from "@lib/utils";
import { Separator } from "@components/ui/separator";
import ImageUpload from "@components/inputs/ImageUpload";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CountryFormProps {
  //if the country doesnt exist it returns null
  countryId?: string | null;
  initialdata?: {
    id: number;
    country_name: string;
    country_flag_location: string;
    country_map_location: string;
    country_added_by: number;
    country_updated_by: number;
  };
  data?: { id: number; country_name: string }[];
}

const MAX_FILE_SIZE = 500000; // 5 MB

const formSchema = z.object({
  country_id: z
    .string()
    .min(0, {
      message: "Id is optional.",
    })
    .optional(),
  country_name: z.string().min(1, {
    message: "Name is required.",
  }),
  country_flag_location: z
    .any()
    .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, {
      message: "Image is required.",
    }),
  country_map_location: z
    .any()
    .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, {
      message: "Image is required.",
    }),
});

const CountryForm = ({ countryId, data, initialdata }: CountryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialdata || {
      country_name: "",
      country_flag_location: "",
      country_map_location: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const [isEditMode, setIsEditMode] = useState(false); // Track whether we're in edit mode

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    var postCountryData = {
      country_name: values.country_name,
      country_flag_location: values.country_flag_location,
      country_map_location: values.country_map_location,
    };

    // Check if categoryId is selected
    if (values.country_id) {
      console.log("Selected Category ID:", values.country_id);
      console.log(postCountryData);
      // ... (your update logic here)
    } else {
      console.log("Category ID is not selected.");
      console.log("Post data -----\n", postCountryData);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      axios
        .post(`/api/country_category/add`, postCountryData, config)
        .then((response) => {
          console.log("Added to backend\n");
          // ... (your redirect logic here)
        })
        .catch((error) => {
          console.error("Error posting data:", error);
        });
    }
  };

  const handleResetList = () => {
    // Reset the selected country to null
    form.setValue("country_id", "");
    setIsEditMode(false); // Exit edit mode
  };

  const handleCountrySelect = (selectedId: string) => {
    // This function will be called when a country is selected or changed
    console.log("Selected Country ID:", selectedId);
    setIsEditMode(true); // Enter edit mode when a country is selected
    // ... (your additional actions here if needed)
    axios
      .get(`/api/country_category/${selectedId}`)
      .then((response) => {
        console.log("Added to backend\n");
        console.log(response);
        // ... (your redirect logic here)
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="h-full p-2 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="h-full space-y-2 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-2 w-full col-span-2">
                <div>
                  <h3 className="text-lg font-medium">Modify Country</h3>
                </div>
              </div>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-6 w-6" />
                  ) : (
                    <ChevronDown className="h-6 w-6" />
                  )}
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Select a country to modify the details
              </p>
              <Separator className="bg-primary/10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country List</FormLabel>
                      <div className="">
                        <Select
                          disabled={isLoading}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleCountrySelect(value);
                          }}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select country to modify country details..."
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.country_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full mt-8 flex justify-center">
                  <Button
                    size="default"
                    disabled={isLoading}
                    onClick={handleResetList}
                  >
                    Reset List
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">
                {isEditMode ? "Edit Country" : "Add Country"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEditMode ? "Edit Country" : "Add Country"} and country
                details
              </p>
            </div>
            <Separator className="bg-primary/10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="country_flag_location"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Country Flag</FormLabel>
                    <FormControl>
                      <ImageUpload
                        disabled={isLoading}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="country_map_location"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Map</FormLabel>
                    <FormControl>
                      <ImageUpload
                        disabled={isLoading}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="country_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Country Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter country name like 'India'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full mt-8 flex justify-center">
                <Button size="default" type="submit" disabled={isLoading}>
                  {isEditMode ? "Edit Country" : "Add Country"}

                  <Wand2 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CountryForm;
