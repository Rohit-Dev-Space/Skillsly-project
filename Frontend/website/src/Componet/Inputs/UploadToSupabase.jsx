import { supabase } from "../../Utilities/supabaseClient";

export async function uploadProfilePic(file, email) {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const fileName = `profile_${email}_${Date.now()}.${ext}`;

    const { data, error } = await supabase
        .storage
        .from("Profile-Image")
        .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase
        .storage
        .from("Profile-Image")
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}

export async function uploadWorkImages(files, email) {
    const urls = [];

    console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)

    for (const img of files) {
        if (!img || !img.file) continue;

        const ext = img.file.name.split(".").pop();
        const fileName = `work_${email}_${Date.now()}.${ext}`;

        const { data, error } = await supabase.storage
            .from("work_images")
            .upload(fileName, img.file, {
                cacheControl: "3600",
                upsert: false,
                contentType: img.file.type,
            });

        if (error) {
            console.error("Upload error:", error);
            continue;
        }

        const { data: publicUrlData } = supabase
            .storage
            .from("work_images")
            .getPublicUrl(fileName);

        urls.push(publicUrlData.publicUrl);
    }

    return urls;
}

export const uploadSkillImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `skill_${Date.now()}.${fileExt}`;
    const filePath = `skill-images/${fileName}`;

    const { error } = await supabase.storage
        .from("skillsAndBadges")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw error;

    const { data } = supabase.storage
        .from("skillsAndBadges")
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const uploadBadgeImages = async (levels) => {
    const uploadedLevels = {};

    for (const key in levels) {
        const file = levels[key]?.[0]?.file;
        if (!file) {
            uploadedLevels[key] = null;
            continue;
        }

        const ext = file.name.split(".").pop();
        const fileName = `badge_${key}_${Date.now()}.${ext}`;
        const filePath = `skill-badge-levels/${fileName}`;

        const { error } = await supabase.storage
            .from("skillsAndBadges")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from("skillsAndBadges")
            .getPublicUrl(filePath);

        uploadedLevels[key] = data.publicUrl;
    }

    return uploadedLevels;
};

