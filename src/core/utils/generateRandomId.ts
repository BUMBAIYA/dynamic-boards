import { nanoid } from "nanoid";

export const generateRandomId = (size: number = 30) => nanoid(size);
