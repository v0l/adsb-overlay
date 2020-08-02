import LatLon from "geodesy/latlon-nvector-ellipsoidal";

export const AVR_WS = "ws://127.0.0.1:9999"; //websocket connection for AVR messages
export const CAM_W = 3840; //Camera resolution in pixels
export const CAM_H = 2160;
export const CAM_POS = new LatLon(0.0, 0.0, 0.0); //GPS Position of camera and altitude in meters
export const CAM_BEARING = 0.00; //Direction camera is facing
export const CAM_HFOV = 110.0; //110 deg horizontal
export const CAM_VHOV = (CAM_HFOV / CAM_W) * CAM_H; //Vertical FOV matches aspect ratio