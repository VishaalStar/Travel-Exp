"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import axios from "axios";

export default function JournalPage() {
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    state: "",
    city: "",
    description: "",
    images: [] as File[],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  // Handle input field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.size <= 5 * 1024 * 1024 && file.type.startsWith("image/")
      );

      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid File(s)",
          description: "Some files were too large or not images.",
          variant: "destructive",
        });
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));
    }
  };

  // Remove selected image
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Validate form fields based on current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title.trim() || !formData.country.trim()) {
          toast({
            title: "Required Fields",
            description: "Please fill in the title and country fields.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.description.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter a description.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Submit the form to Strapi API
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a journal entry.",
        variant: "destructive",
      });
      return;
    }

    if (!process.env.NEXT_PUBLIC_STRAPI_API_URL || !process.env.NEXT_PUBLIC_STRAPI_API_KEY) {
      console.error("Missing Strapi API configuration.");
      toast({
        title: "Configuration Error",
        description: "Strapi API URL or key is not defined.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { title, description, country, state, city, images } = formData;

      // Upload images to Strapi
      let uploadedImages = [];
      if (images.length > 0) {
        const imageUploadData = new FormData();
        images.forEach((file) => {
          imageUploadData.append("files", file);
        });

        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/upload`,
          imageUploadData,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
            },
          }
        );
        uploadedImages = uploadResponse.data.map((file: any) => file.id);
      }

      // Create the journal entry in Strapi
      await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/posts`,
        {
          data: {
            Title: title,
            Description: description,
            Country: country,
            State: state || "",
            City: city || "",
            Photos: uploadedImages,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
          },
        }
      );

      toast({
        title: "Journal Entry Submitted",
        description: "Your journal entry has been successfully saved.",
      });

      router.push("/gallery");
    } catch (error) {
      console.error("Error submitting journal entry:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go to the next step in the form
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Go to the previous step in the form
  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="max-w-2xl w-full px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Create New Journal Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter the title of your journal"
                  required
                />
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                  required
                />
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state or region"
                />
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            )}

            {currentStep === 2 && (
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write a short description"
                rows={6}
                required
              />
            )}

            {currentStep === 3 && (
              <div>
                <Input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Selected preview ${index}`}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={isSubmitting}
                className={isSubmitting ? "cursor-wait" : ""}
              >
                Previous
              </Button>
            )}
            <Button
              onClick={nextStep}
              disabled={isSubmitting}
              className={isSubmitting ? "cursor-wait" : ""}
            >
              {isSubmitting ? "Saving..." : currentStep < 3 ? "Next" : "Save Entry"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
