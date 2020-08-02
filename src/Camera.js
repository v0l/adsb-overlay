import LatLon from "geodesy/latlon-nvector-ellipsoidal";
import { ToRad } from "./Const";

class Camera {
    constructor() {
        this.position = new LatLon(0, 0, 0);
        this._heading = 0;
        this.yawOffset = 0;

        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;

        this.fov = 90; //horizontal fov
        this.aspectRatio = 1.777777778; //16:9
    }

    get heading() {
        return this._heading - (this.yaw - this.yawOffset);
    }

    /**
     * Set the camera position
     * @param {number} lat Latitude
     * @param {number} lon Longitude
     * @param {number} height Altitude in meters
     */
    SetPosition(lat, lon, height = 0) {
        this.position.lat = lat;
        this.position.lon = lon;
        this.position.height = height;
    }

    /**
     * Sets the heading from North (in degrees clockwise)
     * @param {number} heading 
     */
    SetHeading(heading) {
        if (typeof heading === "number") {
            this._heading = heading;
        } else {
            this._heading = 0.0;
        }
    }

    /**
     * Sets the roatation of the Camera
     * @param {number} pitch 
     * @param {number} yaw 
     * @param {number} roll 
     */
    SetRotation(pitch, yaw, roll) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.roll = roll;
    }

    /**
     * Creates a camera object which gets its position and rotation data from device orientation
     */
    static ForDevice() {
        let newCamera = new Camera();

        //add position handler
        if (window.navigator.geolocation) {
            window.navigator.geolocation.watchPosition(function (pos) {
                this.SetPosition(pos.coords.latitude, pos.coords.longitude, pos.coords.altitude);
                this.SetHeading(pos.coords.heading);
                this.yawOffset = this.yaw;
            }.bind(newCamera));
        }

        //add orientation handler
        window.addEventListener('deviceorientation', function (evt) {
            // roll is gamma
            // pitch is beta
            // yaw is alpha 
            // beta points down to 0deg, so upright horizonal +90
            this.SetRotation(evt.gamma - 90, evt.alpha, evt.beta);
        }.bind(newCamera));

        return newCamera;
    }
}

export default Camera;