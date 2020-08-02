# adsb-overlay
ADS-B Camera overlay for tracking and displaying aircraft information

![demo.webp](https://v0l.io/adsb_overlay_2.webp)
# Setup

## Configuring

Copy the file `src/config.example.js` to `src/config.js` and set your camera parameters

```js
import LatLon from "geodesy/latlon-nvector-ellipsoidal";

export const AVR_WS = "ws://127.0.0.1:9999"; //websocket connection for AVR messages
export const CAM_W = 3840; //Camera resolution in pixels
export const CAM_H = 2160;
export const CAM_POS = new LatLon(0.0, 0.0, 0.0); //GPS Position of camera and altitude in meters
export const CAM_BEARING = 0.00; //Direction camera is facing in degrees
export const CAM_HFOV = 110.0; //110 deg horizontal
export const CAM_VHOV = (CAM_HFOV / CAM_W) * CAM_H; //Vertical FOV matches aspect ratio
```
Notes: 
* Camera incline is currently not supported, your camera MUST be centered on the horizon

## Building
`node.js` is requred to build.

```
git clone https://github.com/v0l/adsb-overlay
cd adsb-overlay
npx yarn install
npx webpack
```

## Websocat
Download from [here](https://github.com/vi/websocat/releases)

Run the command `nc my-adsb-feeder-ip 30002 | websocat -s 9999`.

This will pipe the AVR output from your feeder to any clients that connect to `ws://localhost:9999`

## OBS

1. Add your camera as a video source
2. Add a browser source
   - Set the browser source to `Local File`
   - Select the file `/path/to/adsb-overlay/index.html`
   - You should now see the horizon marker with the heading markers
   - Set the resolution so it matches your camera resolution
3. The browser source and the video source should be the same size in OBS

# Why is this so awkward?

This is more of a POC than anything else, the last time I worked on it I was making a much better
version but I had already moved onto some other projects.

Feel free to contribute (complete) the newer organised version, and if you feel like it please consdier supporting this project.

# Known issues

For me the vertical angle is wrong when planes are higher on the camera view so the marker box is way off, 
I dont know if this is because of something funky with my camera or not.

I have yet to devise a way to calibrate the FOV..

# TODO
1. Finish cleaner new version
2. Stop using `netcat` and `websocat`, could easily use a simple `node.js` script to replace this part.
3. Convert the project to use something like `OpenCV` so the overlay could be used in a more portable way, i dont like that its using a browser source or that you have to use OBS, ideally this could just run standalone..
