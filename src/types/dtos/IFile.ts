export interface IFile extends File {
    originalname: string;
    name: string;
    buffer: Buffer;
    url: string;
}