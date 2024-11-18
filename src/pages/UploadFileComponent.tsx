import React, {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import '../css/PageComponent.css';
import {useDispatch} from "react-redux";
import {useAppSelector} from "../hooks.ts";
import Typography from "@mui/material/Typography";
import {Box, CircularProgress, Input, TextareaAutosize} from "@mui/material";
import {t} from "i18next";
import Button from "@mui/material/Button";
import {log} from "../service/Common.ts";
import {showError} from "../redux/showErrorSlice.ts";
import {UserLevel} from "../model/user/UserLevel.ts";

export default function UploadFileComponent(): ReactNode | null {

    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState<string>('')
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [canUpload, setCanUpload] = useState(false);

    const changeContentEvent = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setDescription(event.target.value);
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (canUpload) {
            const droppedFile = event.dataTransfer?.files?.[0] || null;
            setFile(droppedFile);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('upload', file);
            formData.append('description', description);
            try {
                setIsUploading(true);
                const response = await fetch(import.meta.env.VITE_API + '/file/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + loggedUser.token,
                    },
                    body: formData,
                });
                const result = await response.json();
                console.log('Upload result:', result);
                if (!result.status) {
                    navigate('/upload/' + file.name);
                } else {
                    dispatch(showError());
                }
            } catch (error) {
                log("Error uploading file: " + error);
                dispatch(showError());
            } finally {
                setIsUploading(false);
            }
        }
    };

    const setBlocks = (): void => {
        const blockLevel = UserLevel[config.value['UPLOAD_LEVEL'] as keyof typeof UserLevel]?.valueOf();
        setCanUpload(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);
    }

    useEffect(() => {
        setBlocks();
    }, [config, loggedUser]);


    return (
        <>
            <Typography variant="h2">{t("Upload a file")}</Typography>
            <Box onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}
                 component="form"
                 sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 2,
                      border: isDragging ? '2px dashed #3f51b5' : '2px dashed #ccc',
                      borderRadius: 2,
                      maxWidth: 400,
                      margin: 'auto',
                      marginTop: 5,
                      backgroundColor: isDragging ? '#f0f8ff' : '#f9f9f9',
                      transition: 'background-color 0.2s, border-color 0.2s',
                  }}
            >
                <Input
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{ accept: 'image/*' }}
                    sx={{ mb: 2 }}
                    disabled={!canUpload}
                />
                    {previewUrl && (
                        <Box
                            component="img"
                            src={previewUrl}
                            alt={t("Preview")}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: 200,
                                borderRadius: 1,
                                mb: 2,
                            }}
                        />
                    )}
                <TextareaAutosize defaultValue={description} minRows={5} onChange={changeContentEvent} disabled={isUploading || !canUpload}></TextareaAutosize>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!file || isUploading || !canUpload}
                    startIcon={isUploading && <CircularProgress size={24}/>}
                >
                    {t("Upload now")}
                </Button>
            </Box>
            {isUploading && t("Uploading...")}
        </>
    )
}


