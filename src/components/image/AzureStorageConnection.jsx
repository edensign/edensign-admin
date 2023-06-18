/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { BlobServiceClient } from "@azure/storage-blob";

import { Utility } from "../utility";

const blobServiceClient = new BlobServiceClient(
    "https://edensign.blob.core.windows.net/image-storage?sp=racwdl&st=2023-06-16T13:12:46Z&se=2023-07-16T21:12:46Z&spr=https&sv=2022-11-02&sr=c&sig=0a1%2BeoNqOGMszIBJa1MWF6LYY0gTd5E0JJLEcxdeN0U%3D"
);

export const uploadImageToAzure = async (containerName, file) => {
    /** Uploads the given image in the specified azure container 
     */
    try {
        const { formatImageName } = Utility();
        let formattedName = formatImageName(file.name);

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(formattedName);
        const blockBlobClient = blobClient.getBlockBlobClient();
        const result = await blockBlobClient.uploadData(file, {
            blockSize: 4 * 1024 * 1024,
            concurrency: 20,
            onProgress: ev => console.log("Azure Storage Result=>", ev)
        })
        return formattedName;
    } catch (err) {
        throw err;
    };
};


export const downloadImageFromAzure = async (containerName, file) => {
    /** Downloads blob of the given image from the specified azure container 
     */
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(file.image_src);
        const blockBlobClient = blobClient.getBlockBlobClient();
        const downloadBlockBlobResponse = await blockBlobClient.download();
        const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody);
        console.log("Downloaded blob content", downloaded);

        // [Browsers only] A helper method used to convert a browser Blob into string
        async function blobToString(blob) {
            const fileReader = new FileReader();
            return new Promise((resolve, reject) => {
                fileReader.onloadend = (ev) => {
                    resolve(ev.target.result);
                };
                fileReader.onerror = reject;
                fileReader.readAsText(blob);
            });
        }
    } catch (err) {
        throw err;
    };
};
