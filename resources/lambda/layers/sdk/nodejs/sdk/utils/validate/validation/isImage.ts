import Jimp from 'jimp';

export async function isImage(path: string): Promise<boolean>;
export async function isImage(data: Buffer): Promise<boolean>;

export async function isImage(data: any): Promise<boolean> {
  try {
    await Jimp.read(data);
    return true;
  } catch (e) {
    return false;
  }
}
