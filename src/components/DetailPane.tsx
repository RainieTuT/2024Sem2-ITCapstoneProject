import React, { useCallback, useState } from 'react';
import { Toolbar, Typography, Accordion, AccordionDetails, AccordionSummary, List, ListItem, TextField } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

// 定义 DetailPaneProps 类型，包含 files 和 setFiles
export type DetailPaneProps = {
    files: { fileName: string, problem: string, class: string }[];
    setFiles: React.Dispatch<React.SetStateAction<{ fileName: string, problem: string, class: string }[]>>;
    onFileSelect: (fileName: string) => void;
    selectedFile: string | null;
};

export default function DetailPane({ files, setFiles, onFileSelect, selectedFile }: DetailPaneProps) {
    // 本地状态，用于追踪每个 Accordion 的展开状态
    const [expandedAccordions, setExpandedAccordions] = useState<{ [key: string]: boolean }>({});

    // 优化 handleInputChange 函数，更新问题和类别
    const handleInputChange = useCallback(
        (index: number, field: 'problem' | 'class', value: string) => {
            const updatedFiles = [...files];
            updatedFiles[index][field] = value; // 更新对应文件的 Problem 或 Class
            setFiles(updatedFiles); // 更新文件列表
        },
        [files, setFiles]
    );

    // 控制 Accordion 展开的状态，并切换 3D 模型
    const handleAccordionChange = (fileName: string) => {
        // 切换当前 Accordion 展开状态
        setExpandedAccordions((prev) => ({
            ...prev,
            [fileName]: !prev[fileName], // 切换当前 fileName 的展开状态
        }));

        // 同时更新选中的文件并触发 3D 模型切换
        onFileSelect(fileName); // 确保点击时切换 3D 模型
    };

    return (
        <div id="right-pane">
            <Toolbar id="detail-pane-header">
                <Typography>Annotated Items</Typography>
            </Toolbar>
            <List sx={{ width: '100%' }} id="detail-list">
                {files.map((file, index) => (
                    <ListItem key={index}>
                        <Accordion 
                            sx={{ width: '100%' }}
                            expanded={expandedAccordions[file.fileName] || false} // 根据当前文件名的本地状态控制展开
                            onChange={() => handleAccordionChange(file.fileName)} // 点击时切换展开状态和 3D 模型
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                            >
                                {file.fileName}
                            </AccordionSummary>
                            <AccordionDetails sx={{ paddingY: '0px', paddingRight: '0px' }}>
                                <List sx={{ paddingLeft: '8px' }}>
                                    <ListItem>
                                        <TextField
                                            label="Problem"
                                            fullWidth
                                            margin="dense"
                                            value={file.problem}
                                            onChange={(e) => handleInputChange(index, 'problem', e.target.value)}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <TextField
                                            label="Class"
                                            fullWidth
                                            margin="dense"
                                            value={file.class}
                                            onChange={(e) => handleInputChange(index, 'class', e.target.value)}
                                        />
                                    </ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
