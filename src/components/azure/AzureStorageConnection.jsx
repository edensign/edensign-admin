/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClientDoc = new BlobServiceClient(
    "https://edensign.blob.core.windows.net/document-storage?sp=racwdl&st=2023-06-30T07:28:29Z&se=2023-07-31T15:28:29Z&spr=https&sv=2022-11-02&sr=c&sig=vuHHr9WM2zTs85athx4lWWLl%2FgLefLjSI%2BJvyi%2BpqDQ%3D"
);

const blobServiceClientImg = new BlobServiceClient(
    "https://edensign.blob.core.windows.net/image-storage?sp=racwdl&st=2023-06-16T13:12:46Z&se=2023-07-16T21:12:46Z&spr=https&sv=2022-11-02&sr=c&sig=0a1%2BeoNqOGMszIBJa1MWF6LYY0gTd5E0JJLEcxdeN0U%3D"
);

export const uploadDocumentToAzure = async (folderName, fileName, blob) => {
    /** Uploads the document pdf file in the specified azure container 
     */
    const containerClient = blobServiceClientDoc.getContainerClient(folderName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const response = await blockBlobClient.uploadData(atob(blob), {
        blobHTTPHeaders: {
            blobContentType: "application/pdf",
        },
    });
    if (response._response.status !== 201) {
        throw new Error(
            `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
        );
    }
};


export const deleteFileFromAzure = async (folderName, blobName) => {
    /** Deletes the given blob from the specified azure container 
     */
    try {
        // include: Delete the base blob and all of its snapshots.
        // only: Delete only the blob's snapshots and not the blob itself.
        const options = {
            deleteSnapshots: 'include' // or 'only'
        };
        const containerClient = blobServiceClientImg.getContainerClient(folderName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete(options);
    } catch (err) {
        throw err;
    };
};
