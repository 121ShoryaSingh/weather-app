import { SavedLocation } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    savedloaction?: Array<SavedLocation> 
}