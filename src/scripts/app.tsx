import React, { useState } from 'react';
import { createRoot } from "react-dom/client";
import { Box, Grid, Container } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DetailPane from '../components/DetailPane';
import ModelDisplay from "../components/ModelDisplay";
import { ModelProvider } from '../components/ModelContext';

const container = document.getElementById('root');
const root = createRoot(container);

const App = () => {
  const [isShowDetailPane, setIsShowDetailPane] = useState(false);  
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
  
  
  const [stlFiles, setStlFiles] = useState<{ fileName: string, fileObject: File, problem: string, class: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);  

  const handleModelLoad = (data: ArrayBuffer) => {
    setModelData(data);  
  };

  const loadSTLFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        setModelData(reader.result);  
      }
    };
  };

  const showDetailPane = (isShow: boolean): void => {
    setIsShowDetailPane(isShow);  
  };

  const handleFileSelect = (fileName: string) => {
    const selectedFileData = stlFiles.find(file => file.fileName === fileName);
    if (selectedFileData) {
      setSelectedFile(fileName);  
      loadSTLFile(selectedFileData.fileObject);  
    }
  };

  return (
    <ModelProvider>
      <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <Box sx={{ flexGrow: 0 }}>
        <Header 
            showDetailPane={setIsShowDetailPane} 
            isShowDetailPane={isShowDetailPane} 
            onModelLoad={handleModelLoad}
            stlFiles={stlFiles} 
            setStlFiles={setStlFiles} 
            selectedFile={selectedFile} 
            setSelectedFile={setSelectedFile}
          />
        </Box>
        
        <Grid container sx={{ flexGrow: 1 }}>
          
          <Grid item xs={2} sx={{ borderRight: '1px solid #ccc' }}>
            <Sidebar />
          </Grid>
          
          
          <Grid item xs={isShowDetailPane ? 8 : 10} sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {modelData && <ModelDisplay modelData={modelData} />}
          </Grid>
          
           
          {isShowDetailPane && (
            <Grid item xs={2} sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
              <DetailPane 
                files={stlFiles} 
                setFiles={setStlFiles} 
                onFileSelect={handleFileSelect}  
                selectedFile={selectedFile}  
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </ModelProvider>
  );
};

root.render(<App />);
