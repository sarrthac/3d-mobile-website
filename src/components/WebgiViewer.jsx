import React, { 
    useCallback,
    useRef,
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle
 } from "react";
import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  GammaCorrectionPlugin,
  mobileAndTabletCheck,
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);   

export default function WebgiViewer() {
  const canvasRef = useRef(null);

  //useCallback is used for caching so that we dont have to call the function repeatedly helps us to save resourses
  const memoizedScrollAnimation = useCallback(
    (position,target,onUpdate) => {
      if(position && target && onUpdate) {
        scrollAnimation(position,target,onUpdate);
      }
    },[]
  )

  //caching this component function to avoid recreating it everytime
  const setupViewer = useCallback(async () => {
    // Initialize the viewer
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    });

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin);


    const camera = viewer.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;


    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)


    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline();

    await manager.addFromPath("scene-black.glb");

    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

    //AFTER RELOAD THE POSITION OF PAGE IS ON TOP
    window.scrollTo(0, 0);

    let needsUpdate = true;

    const onUpdate = () => {
      needsUpdate = true;
      viewer.setDirty();
    }

    viewer.addEventListener("preFrame", () => {
      if (needsUpdate) {
        camera.positionTargetUpdated(true);
        needsUpdate = false;
      }
    });

    memoizedScrollAnimation(position,target,onUpdate)

  }, []);

  //CALLING THE FUNCTION
  useEffect(() => {
    setupViewer();
  }, []);

  return (
    <div id="webgi-canvas-container">
      <canvas id="webgi-canvas" ref={canvasRef} />
    </div>
  );
}
