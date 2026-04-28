// BannerForm.tsx
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

export default function BannerForm() {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardContent className="p-6 space-y-6">

        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold">Add / Edit Banner</h2>
          <p className="text-sm text-gray-500">
            Upload and manage homepage banners
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Banner Image</label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition">
            <Input type="file" className="hidden" id="bannerUpload" />
            <label htmlFor="bannerUpload" className="cursor-pointer">
              <span className="text-sm text-gray-600">
                Click to upload
              </span>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 2MB
              </p>
            </label>
          </div>
        </div>

        {/* Banner Heading */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Banner Heading</label>
          <Input placeholder="Enter banner heading" />
        </div>

        {/* Banner Text */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Banner Text</label>
          <Input placeholder="Enter banner description" />
        </div>

        {/* Banner Link */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Redirect Link</label>
          <Input placeholder="https://example.com" />
        </div>

        {/* Submit Button */}
        <Button className="w-full mt-2 bg-black hover:bg-gray-800 transition">
          Save Banner
        </Button>

      </CardContent>
    </Card>
  );
}