const { ImageKit } = require("@imagekit/nodejs");

// v7+ SDK — sirf privateKey chahiye server-side ke liye
const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * Uploads a file buffer to ImageKit using v7+ SDK.
 * Uses imagekit.files.upload() with ImageKit.toFile() static helper.
 * @param {Express.Multer.File} file - multer memoryStorage file object
 * @returns {Promise<Object>} ImageKit upload result with url, fileId etc.
 */
async function uploadFile(file) {
    // ImageKit.toFile static method se Buffer ko Uploadable me convert karo
    const uploadable = await ImageKit.toFile(file.buffer, file.originalname);

    const result = await imagekit.files.upload({
        file: uploadable,
        fileName: file.originalname,
        folder: "/songs",
    });

    return result;
}

module.exports = uploadFile;