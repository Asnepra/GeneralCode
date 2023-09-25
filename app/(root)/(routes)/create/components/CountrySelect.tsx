"use client";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

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

import { Separator } from "@components/ui/separator";

import { Button } from "@components/ui/button";

interface CountrySelectProps {
  //if the country doesn't exist it returns null
  countryId?: string | null;
  data?: { country_id: number; country_name: string }[];
}

const formSchema = z.object({
  country_id: z
    .string()
    .min(0, {
      message: "Id is optional.",
    })
    .default(""),
  country_name: z.string().min(1, {
    message: "Name is required.",
  }),
});

const CountrySelect = ({ countryId, data }: CountrySelectProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      country_id: 1,
      country_name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const [isEditMode, setIsEditMode] = useState(false); // Track whether we're in edit mode
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null); // Store the selected country ID

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    var postCountryData = {
      country_name: values.country_name,
    };
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    // Check if categoryId is selected
    if (values.country_id) {
      var patchCountryData = {
        country_id: values.country_id,
        country_name: values.country_name,
      };
      console.log("Selected Category ID: calling patch", values.country_id);
      //console.log(postCountryData);
      axios
        .patch(`/api/country_category/add`, patchCountryData, config)
        .then((response) => {
          console.log("Added to backend\n");
          // ... (your redirect logic here)
        })
        .catch((error) => {
          console.error("Error posting data:", error);
        });
    } else {
      console.log("Category ID is not selected.");
      console.log("Post data -----\n", postCountryData);

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
    setSelectedCountry(parseInt(selectedId)); // Store the selected country ID as a number
    // ... (your additional actions here if needed)
  };

  // Fetch data when the component is mounted or selectedCountry changes
  useEffect(() => {
    if (selectedCountry !== null) {
      axios
        .get(`/api/country_category/${selectedCountry}`)
        .then((response) => {
          console.log(response);
          // Populate the form fields with the fetched data
          const countryData = response.data;
          form.setValue("country_id", countryData.Country_Id.toString());
          form.setValue("country_name", countryData.COUNTRY_NAME);
        })
        .catch((error) => {
          console.error("Error posting data:", error);
        });
    }
  }, [selectedCountry]);

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="h-full p-2 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="my-2 flex items-center justify-between space-x-4">
            <p className="text-sm text-muted-foreground">
              Select a country to modify the details
            </p>
          </div>
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
        </form>
      </Form>
    </div>
  );
};

export default CountrySelect;
