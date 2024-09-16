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
  const [isShowDetailPane, setIsShowDetailPane] = useState(false); // 控制右侧 Annotated Items 的显示
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
  
  // 用于管理 STL 文件的状态
  const [stlFiles, setStlFiles] = useState<{ fileName: string, fileObject: File, problem: string, class: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // 当前选中的文件

  const handleModelLoad = (data: ArrayBuffer) => {
    setModelData(data); // 更新 3D 模型数据
  };

  const loadSTLFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        setModelData(reader.result); // 更新模型数据
      }
    };
  };

  const showDetailPane = (isShow: boolean): void => {
    setIsShowDetailPane(isShow); // 控制 Annotated Items 的显示与隐藏
  };

  const handleFileSelect = (fileName: string) => {
    const selectedFileData = stlFiles.find(file => file.fileName === fileName);
    if (selectedFileData) {
      setSelectedFile(fileName); // 更新选中的文件
      loadSTLFile(selectedFileData.fileObject); // 加载选中的 STL 文件
    }
  };

  return (
    <ModelProvider>
      <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* 顶部 Header */}
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
        {/* 网格布局，左侧 Sidebar，中间 ModelDisplay，右侧 DetailPane */}
        <Grid container sx={{ flexGrow: 1 }}>
          {/* 左侧区域 (Sidebar) */}
          <Grid item xs={2} sx={{ borderRight: '1px solid #ccc' }}>
            <Sidebar />
          </Grid>
          
          {/* 中间区域 (ModelDisplay) */}
          <Grid item xs={isShowDetailPane ? 8 : 10} sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {modelData && <ModelDisplay modelData={modelData} />}
          </Grid>
          
          {/* 右侧区域 (DetailPane)，根据 isShowDetailPane 控制显示与否 */}
          {isShowDetailPane && (
            <Grid item xs={2} sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
              <DetailPane 
                files={stlFiles} 
                setFiles={setStlFiles} 
                onFileSelect={handleFileSelect} // 处理文件选择
                selectedFile={selectedFile} // 当前选中的文件
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </ModelProvider>
  );
};

root.render(<App />);
