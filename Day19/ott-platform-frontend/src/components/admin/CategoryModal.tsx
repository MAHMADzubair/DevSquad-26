import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save, AlertCircle, Image as ImageIcon } from "lucide-react";
import api from "../../lib/axios";
import { useToast } from "../../context/ToastContext";
import { uploadToCloudinary } from "../../lib/cloudinary";

interface CategoryFormValues {
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  thumbnail: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (category: any) => void;
  category?: any;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>();

  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = React.useState<string>("");

  const name = watch("name");

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
        slug: category.slug,
        isActive: category.isActive,
      });
      setThumbnailPreview(category.thumbnail || null);
      setThumbnailFile(null);
    } else {
      reset({
        name: "",
        description: "",
        slug: "",
        isActive: true,
      });
      setThumbnailPreview(null);
      setThumbnailFile(null);
    }
  }, [category, reset, isOpen]);

  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [name, setValue]);

  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      let finalData = { ...values };
      
      if (thumbnailFile) {
        setUploadStatus("Uploading image...");
        const imageData = await uploadToCloudinary(thumbnailFile, "image", () => {});
        finalData.thumbnail = imageData.secure_url;
      } else if (thumbnailPreview) {
        finalData.thumbnail = thumbnailPreview;
      }

      setUploadStatus("");

      if (category) {
        return api.patch(`/admin/categories/${category.id}`, finalData);
      }
      return api.post("/admin/categories", finalData);
    },
    onSuccess: (response) => {
      showToast(
        `Category ${category ? "updated" : "created"} successfully`,
        "success",
      );
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      if (onSuccess) onSuccess(response.data);
      onClose();
    },
    onError: (error: any) => {
      showToast(
        error?.response?.data?.message || "Failed to save category",
        "error",
      );
    },
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
           e.stopPropagation();
           onClose();
        }}
      />

      <div className="relative bg-bg-custom border border-border-darker rounded-[16px] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
           onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border-darker">
          <h2 className="text-text-p text-[20px] font-bold">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            type="button"
            onClick={(e) => {
               e.stopPropagation();
               onClose();
            }}
            className="p-2 text-text-s hover:text-text-p hover:bg-surface rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-text-p text-[13px] font-medium">
              Category Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Action"
              className={`bg-surface border rounded-[8px] px-4 py-3 text-text-p text-[14px] outline-none focus:border-primary transition-all ${errors.name ? "border-primary shadow-[0_0_8px_rgba(230,0,0,0.1)]" : "border-border-darker"}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit((data) => mutation.mutate(data))();
                }
              }}
            />
            {errors.name && (
              <p className="text-primary text-[12px] mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-p text-[13px] font-medium">Category Image</label>
            <div className={`border-2 border-dashed rounded-[12px] h-[160px] relative overflow-hidden flex flex-col items-center justify-center p-4 transition-all ${thumbnailFile || thumbnailPreview ? "border-primary/50 bg-bg-custom" : "border-border-darker hover:border-primary/50"}`}>
              {thumbnailFile || thumbnailPreview ? (
                <>
                  <img src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : thumbnailPreview!} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]" alt="preview blur" />
                  <div className="relative z-10 flex flex-col items-center bg-bg-custom/80 backdrop-blur-md p-2 rounded-[8px] border border-white/10 shadow-xl">
                    <img src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : thumbnailPreview!} className="w-[100px] h-[80px] object-cover rounded-[4px] mb-2 shadow-lg border border-white/20" alt="preview" />
                    <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }} className="flex items-center gap-1 text-primary text-[12px] font-bold bg-primary/10 px-3 py-1 rounded-full"><X size={12}/> Remove</button>
                  </div>
                </>
              ) : (
                <>
                   <div className="w-8 h-8 bg-surface border border-border-darker rounded-full flex items-center justify-center mb-2 text-text-s"><ImageIcon size={16}/></div>
                   <p className="text-text-s text-[12px] text-center mb-2 font-medium">Select a category picture</p>
                   <input type="file" accept="image/*" className="hidden" id="category-image" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                   <label htmlFor="category-image" className="bg-primary text-text-p text-[12px] font-bold px-4 py-1.5 rounded-[8px] cursor-pointer hover:bg-red-700 transition-all shadow-lg active:scale-95">Browse</label>
                </>
              )}
            </div>
            {uploadStatus && <p className="text-primary text-[12px] mt-1">{uploadStatus}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-p text-[13px] font-medium">
              Slug (Auto-generated)
            </label>
            <input
              {...register("slug", { required: "Slug is required" })}
              placeholder="e.g. action"
              className="bg-bg-darker/50 border border-border-darker rounded-[8px] px-4 py-3 text-text-s text-[14px] outline-none"
              readOnly
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-p text-[13px] font-medium">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Brief description of this category..."
              className="bg-surface border border-border-darker rounded-[8px] px-4 py-3 text-text-p text-[14px] outline-none focus:border-primary resize-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-surface/50 border border-border-darker rounded-[8px]">
            <input
              type="checkbox"
              {...register("isActive")}
              id="isActive"
              className="w-4 h-4 rounded border-border-darker text-primary focus:ring-primary bg-bg-custom"
            />
            <label
              htmlFor="isActive"
              className="text-text-p text-[14px] font-medium cursor-pointer"
            >
              Active (Visible on platform)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="px-6 py-2.5 text-text-s font-semibold hover:text-text-p transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit((data) => mutation.mutate(data))();
              }}
              className="bg-primary text-text-p font-bold px-8 py-2.5 rounded-[8px] flex items-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {mutation.isPending ? (
                <div className="w-5 h-5 border-2 border-text-p border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {category ? "Update Category" : "Create Category"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
