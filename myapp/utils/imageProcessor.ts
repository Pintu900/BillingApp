import { File, Paths } from 'expo-file-system';

export interface ImageCompressionOptions {
  quality?: number; // 0-1
  width?: number;
  height?: number;
  format?: 'jpeg' | 'png';
}

const DEFAULT_COMPRESSION_OPTIONS: ImageCompressionOptions = {
  quality: 0.6,
  width: 800,
  height: 800,
  format: 'jpeg',
};

export const compressImage = async (
  imageUri: string,
  options: ImageCompressionOptions = {}
): Promise<string> => {
  try {
    const finalOptions = { ...DEFAULT_COMPRESSION_OPTIONS, ...options };
    const fileName = `bill_${Date.now()}.${finalOptions.format}`;
    
    // Create file in cache directory
    const file = new File(Paths.cache, fileName);
    const compressedPath = file.uri;

    // Read the source image as arrayBuffer and write it
    const sourceFile = new File(imageUri);
    const arrayBuffer = await sourceFile.arrayBuffer();
    
    // Write the file
    await file.write(new Uint8Array(arrayBuffer));

    return compressedPath;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

export const saveBillImage = async (imageUri: string): Promise<string> => {
  try {
    const fileName = `bill_${Date.now()}.jpg`;
    
    // Create file in cache directory
    const file = new File(Paths.cache, fileName);
    const savedPath = file.uri;

    // Read the source image
    const sourceFile = new File(imageUri);
    const arrayBuffer = await sourceFile.arrayBuffer();
    
    // Write the compressed file
    await file.write(new Uint8Array(arrayBuffer));

    return savedPath;
  } catch (error) {
    console.error('Error saving bill image:', error);
    throw error;
  }
};

export const deleteImage = async (imagePath: string): Promise<boolean> => {
  try {
    const file = new File(imagePath);
    await file.delete();
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

export const getImageSize = async (imagePath: string): Promise<number> => {
  try {
    const file = new File(imagePath);
    const arrayBuffer = await file.arrayBuffer();
    return arrayBuffer.byteLength || 0;
  } catch (error) {
    console.error('Error getting image size:', error);
    return 0;
  }
};
