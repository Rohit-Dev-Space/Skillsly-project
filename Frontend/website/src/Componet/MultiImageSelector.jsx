import { Trash, Upload, Image as ImageIcon } from "lucide-react";
import React, { useRef, useState } from "react";

const MultiImageSelector = ({ images, setImages, max }) => {
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (!files.length) return;

        const remainingSlots = max - images.length;
        const selectedFiles = files.slice(0, remainingSlots);

        const newImages = selectedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages(prev => [...prev, ...newImages]);
        e.target.value = null;

        console.log("Selected files:", selectedFiles);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const openFilePicker = () => {
        inputRef.current.click();
    };

    return (
        <div className="flex flex-col gap-4">

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
            />

            <div className="flex gap-4 flex-wrap">
                {/* Uploaded Images */}
                {images?.map((img, index) => (
                    <div
                        key={index}
                        className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-500"
                    >
                        <img
                            src={img.preview}
                            alt="work preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full"
                        >
                            <Trash size={14} />
                        </button>
                    </div>
                ))}

                {/* Add Button */}
                {images?.length < max && (
                    <button
                        type="button"
                        onClick={openFilePicker}
                        className="w-24 h-24 cursor-pointer flex flex-col gap-1 justify-center items-center border border-dashed border-gray-400 rounded-xl hover:border-green-400 text-gray-300"
                    >
                        <ImageIcon />
                        <span className="text-xs">Add</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MultiImageSelector;
