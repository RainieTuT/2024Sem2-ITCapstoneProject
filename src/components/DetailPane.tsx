import React, { useCallback, useState } from 'react';
import { Toolbar, Typography, Accordion, AccordionDetails, AccordionSummary, List, ListItem, TextField } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

export type DetailPaneProps = {
    files: { fileName: string, problem: string, class: string }[];
    setFiles: React.Dispatch<React.SetStateAction<{ fileName: string, problem: string, class: string }[]>>;
    onFileSelect: (fileName: string) => void;
    selectedFile: string | null;
};

export default function DetailPane({ files, setFiles, onFileSelect, selectedFile }: DetailPaneProps) {
    
    const [expandedAccordions, setExpandedAccordions] = useState<{ [key: string]: boolean }>({});

   
    const handleInputChange = useCallback(
        (index: number, field: 'problem' | 'class', value: string) => {
            const updatedFiles = [...files];
            updatedFiles[index][field] = value;  
            setFiles(updatedFiles); 
        },
        [files, setFiles]
    );

    
    const handleAccordionChange = (fileName: string) => {
        
        setExpandedAccordions((prev) => ({
            ...prev,
            [fileName]: !prev[fileName],  
        }));

        
        onFileSelect(fileName);  
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
                            expanded={expandedAccordions[file.fileName] || false}  
                            onChange={() => handleAccordionChange(file.fileName)}  
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
