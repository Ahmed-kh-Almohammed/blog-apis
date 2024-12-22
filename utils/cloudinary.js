const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//cloudinary upload image 

const cloudinaryUploadImage = async (fileUpload) => {

    try {
        const data = await cloudinary.uploader.upload(fileUpload, {
            resource_type: 'auto',
        });
        return data;
    } catch (error) {
        return error;
    }

}

const cloudinaryRemoveImage = async (ImagePublicId) => {
    try {
        const result = await cloudinary.uploader.distroy(ImagePublicId);
        return result;
    } catch (error) {
        return error;
    }
}

// cloudinary Remove multiple Image 

const cloudinaryRemoveMultipleImage = async (PublicIds) => {
    try {
        const result = await cloudinary.v2.api.delete_resources(PublicIds);
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = { cloudinaryRemoveImage, cloudinaryUploadImage,cloudinaryRemoveMultipleImage};