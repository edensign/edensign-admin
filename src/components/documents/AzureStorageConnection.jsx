/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClient = new BlobServiceClient(
    "https://edensign.blob.core.windows.net/document-storage?sp=racwdl&st=2023-06-30T07:28:29Z&se=2023-07-31T15:28:29Z&spr=https&sv=2022-11-02&sr=c&sig=vuHHr9WM2zTs85athx4lWWLl%2FgLefLjSI%2BJvyi%2BpqDQ%3D"
);

export const uploadDocumentToAzure = async (folderName, fileName) => {
    /** Uploads the document pdf file in the specified azure container 
     */
    const containerClient = blobServiceClient.getContainerClient(folderName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const data = Buffer.from("BASE-64-ENCODED-PDF", "base64");
    const response = await blockBlobClient.uploadData(data, {
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

