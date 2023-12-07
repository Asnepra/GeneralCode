"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { PlusSquare } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const formSchema = z.object({
  templatename: z
    .string()
    .min(2, {
      message: "Template Name is mandatory",
    })
    .max(50),
});

// const AddTemplate = (props: Props) => {
//   const router = useRouter();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       username: "",
//     },
//   });
//   function onSubmit(values: z.infer<typeof formSchema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values)
//   }
// }
// //   const addTemplate = async () => {
// //     // Get the template name from the input field
// //     const templateName = document.getElementById("name")?.value;

// //     if (!templateName) {
// //       // Handle the case where the input is empty
// //       console.error("Template name cannot be empty");
// //       return;
// //     }

// //     try {
// //       // Send a POST request to the server
// //       const response = await axios.post(
// //         "http://localhost:3000/api/template_master",
// //         {
// //           templateName: templateName,
// //           // Include any other data you want to send in the request body
// //         }
// //       );

// //       // Handle the response here (e.g., show a success message)
// //       console.log("Template added successfully", response.data);

// //       // Optionally, you can clear the input field or perform other actions after success
// //       router.push("/create");

// //       // You can also update the table data if needed (refresh the table)
// //       // You might need to fetch updated data from the server and update the 'data' prop.
// //     } catch (error) {
// //       // Handle any errors that occur during the POST request
// //       console.error("Error adding template", error);
// //     }
// //   };

//   return (
//     <div>
//         <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="shadcn" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//       {/* <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="default">
//             {" "}
//             <PlusSquare size={16} />
//             <span className="mx-3">Add Template</span>
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-xl">
//           <DialogHeader>
//             <DialogTitle>Add Template</DialogTitle>
//             <DialogDescription>
//               Make changes to your profile here. Click save when you're done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Template Name
//               </Label>
//               <Input
//                 id="name"
//                 placeholder="Template 4"
//                 className="col-span-3"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={addTemplate} type="submit">
//               Save changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog> */}
//     </div>
//   );
// };

// export default AddTemplate;

const AddTemplate = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templatename: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("on submit called\n");
    var postTemplateData = {
      templatename: values.templatename,
    };
    console.log(postTemplateData);

    axios
      .post(`/api/template_master`, postTemplateData)
      .then((response) => {
        console.log("Added to backend\n");
        toast.success("Added to backend template");
        // ... (your redirect logic here)
        router.push("/create");
        router.refresh();
        window.location.reload(); // Reload the page
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="templatename"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default">
                        {" "}
                        <PlusSquare size={16} />
                        <span className="mx-3">Add Template</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Add Template</DialogTitle>
                        <DialogDescription>
                          Create a new Template. Click save when you are done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Template Name
                          </Label>
                          <Input
                            {...field}
                            id="templatename"
                            placeholder="Template 4"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={form.handleSubmit(onSubmit)}
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default AddTemplate;
