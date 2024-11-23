import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const customerSchema = z.object({
  company: z.string().optional(),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  is_over_25: z.boolean().refine((val) => val === true, {
    message: "You must be 25 years or older to rent",
  })
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  onSubmit: (data: CustomerFormValues) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      company: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      is_over_25: false
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-black/40 backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-semibold mb-6 text-white">Who will drive?</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60">Company (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter company name" 
                      className="bg-white/5 border-white/10 text-white"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">First name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter first name" 
                        className="bg-white/5 border-white/10 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60">Last name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter last name" 
                        className="bg-white/5 border-white/10 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      className="bg-white/5 border-white/10 text-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-white/60">Phone number</FormLabel>
                    <div className="flex gap-2">
                      <div className="w-20">
                        <Input 
                          disabled
                          value="+1" 
                          className="bg-white/5 border-white/10 text-white text-center"
                        />
                      </div>
                      <Input 
                        placeholder="(555) 000-0000" 
                        className="bg-white/5 border-white/10 text-white flex-1"
                        {...field} 
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_over_25"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">
                      I am 25 years of age or older
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white"
              >
                Continue to booking
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </motion.div>
  )
}