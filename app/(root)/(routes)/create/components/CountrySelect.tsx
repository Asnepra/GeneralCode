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
  data: { country_id: number; country_name: string }[];
}

const formSchema = z.object({
  country_id: z
    .number()
    .min(0, {
      message: "Id is required.",
    })
    .default(0),
  country_name: z.string().min(1, {
    message: "Name is required.",
  }),
});

const CountrySelect = ({ countryId, data }: CountrySelectProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      data && data.length > 0 ? data[0] : { country_id: -1, country_name: "" }, // Set the default value based on the data
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    var postCountryData = {
      country_id: values.country_id,
      country_name: values.country_name,
    };

    console.log(postCountryData);
  };

  const handleResetList = () => {
    // Reset the selected country to null
    form.setValue("country_id", -1);
    // Exit edit mode
  };

  const handleCountrySelect = (selectedCountry: string) => {
    // This function will be called when a country is selected or changed
    console.log("Selected Country ID:", selectedCountry);
    itemSelected = selectedCountry;
    // Enter edit mode when a country is selected
    // ... (your additional actions here if needed)
  };
  return (
    <div className="h-full max-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select country..."
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.map((category) => (
                          <SelectItem
                            key={category.country_id}
                            value={category.country_name}
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
