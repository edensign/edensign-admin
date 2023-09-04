/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { BlobServiceClient } from "@azure/storage-blob";

const ENV = import.meta.env;

const blobServiceClientDoc = new BlobServiceClient(
    `${ENV.VITE_SAS_DOCUMENT_URL}?${ENV.VITE_SAS_DOCUMENT_TOKEN}`
);

const blobServiceClientImg = new BlobServiceClient(
    `${ENV.VITE_SAS_URL}?${ENV.VITE_SAS_TOKEN}`
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
    } finally {
        const options = {
            deleteSnapshots: 'include' // or 'only'
        };
        const containerClient = blobServiceClientImg.getContainerClient(`${folderName}/banner`);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete(options);
    }
};
