"use client";
import React from "react";
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
import Link from "next/link";
import { cn } from "@lib/utils";
import { Separator } from "@components/ui/separator";
import ImageUpload from "@components/inputs/ImageUpload";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Wand2 } from "lucide-react";

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

const formSchema = z.object({
  country_name: z.string().min(1, {
    message: "Name is required.",
  }),
  country_flag_location: z.string().min(1, {
    message: "Image is required.",
  }),
  country_map_location: z.string().min(1, {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="h-full p-2 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">To modify Country</h3>
              <p className="text-sm text-muted-foreground">
                Select a country to modify the details
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country List</FormLabel>
                <div className="">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a country to modify existing country details..."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
            <Button size="default" disabled={isLoading}>
              Reset List
            </Button>
          </div>
        </div>

        <div className="space-y-2 w-full col-span-2">
          <div>
            <h3 className="text-lg font-medium">Add Country</h3>
            <p className="text-sm text-muted-foreground">
              Add Country and country details
            </p>
          </div>
          <Separator className="bg-primary/10" />
        </div>

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
            <Button size="default" disabled={isLoading}>
              {initialdata ? "Edit Country" : "Add Country"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CountryForm;
