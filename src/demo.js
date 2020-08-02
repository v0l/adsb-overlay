import Camera from "./Camera";
import HUD from "./Hud";
import DebugElement from "./Debug";
import DeviceCameraElement from "./DeviceCamera";
import Compass from "./Compass";

const H = new HUD(document.getElementsByTagName("canvas")[0]);

let cam = Camera.ForDevice();

H.AddElement(new DeviceCameraElement(H));
H.AddElement(new Compass(H));

H.AddElement(new DebugElement(H));

H.Start(cam);