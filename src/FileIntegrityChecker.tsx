import React, { useState } from "react";
import "./FileIntegrityChecker.css";

const FileIntegrityChecker: React.FC = () => {
    const [knownHash, setKnownHash] = useState("");
    const [fileHash, setFileHash] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [integrityStatus, setIntegrityStatus] = useState<string | null>(null);
    const [calculatingHash, setCalculatingHash] = useState(false);

    const handleKnownHashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKnownHash(event.target.value);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            calculateFileHash(selectedFile);
        }
    };

    const calculateFileHash = async (file: File) => {
        setCalculatingHash(true);
        const hashBuffer = await file.arrayBuffer();
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
        setFileHash(hashHex);
        setCalculatingHash(false);
    };

    const handleCheckIntegrity = () => {
        // Compare the knownHash with fileHash here
        if (knownHash === fileHash) {
            setIntegrityStatus("File integrity check passed!");
        } else {
            setIntegrityStatus("File integrity check failed!");
        }
    };

    return (
        <div className="file-integrity-checker">
            <h1>File Integrity Checker</h1>
            <div className="input-box">
                <label htmlFor="knownHash">Known SHA256 Hash:</label>
                <input
                    type="text"
                    id="knownHash"
                    value={knownHash}
                    onChange={handleKnownHashChange}
                    placeholder="Enter the known hash"
                />
            </div>
            <div className="input-box">
                <label htmlFor="file">Select File:</label>
                <input type="file" id="file" onChange={handleFileChange} />
            </div>
            <div className="result-box">
                <button
                    onClick={handleCheckIntegrity}
                    disabled={!file || !knownHash || calculatingHash}
                >
                    Check Integrity
                </button>
                {integrityStatus && <p>{integrityStatus}</p>}
            </div>
        </div>
    );
};

export default FileIntegrityChecker;
