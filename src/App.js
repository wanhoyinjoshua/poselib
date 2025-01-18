import logo from './logo.svg';
import './App.css';
import jsonData from './emg.json';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


import { Bar } from 'react-chartjs-2';
import React from "react";
import { useState,useEffect, useRef } from 'react';
import {Matrix,Quaternion,PointerEventTypes,PositionGizmo,PlaneRotationGizmo,UtilityLayerRenderer,Space,Axis, FreeCamera,DirectionalLight,Color3,Animation,ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder,SceneLoader,AnimationPropertiesOverride,StandardMaterial } from "@babylonjs/core";
// uses above component in same directory
import '@babylonjs/loaders'
import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import "./App.css"; 
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' ,
    },
    title: {
      display: true,
      text: 'EMG activation % ',
    },
  },
};

const labels = ['Rectus Femoris', 'Bicep Femoris', 'Tibilais anterior', 'Medial Gastrocs', 'Soleus',"Gluteus Maximus"];





//citation is https://pubmed.ncbi.nlm.nih.gov/21123071/
//A multiple-task gait analysis approach: kinematic, kinetic and EMG reference data for healthy young and adult subjects

function App (){
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed,setSpeed]=useState(1)
  const [rotation,setRotation]=useState(0)
  const [percentage,setpercent]=useState(0)
  const animatableref = useRef(null);
  const base_material=useRef(null)
  const anteriorthigh_material=useRef(null)
  const glutmax_material=useRef(null)
  const hammies_material=useRef(null)
  const knee_material=useRef(null)
  const gastroc_material=useRef(null)
  const soleus_material=useRef(null)
  const [gaitphase,setGaitphase]=useState("")
  const[tibemg, settibemg]=useState(jsonData.filter(item => item['Muscle [% max]'] =="Tibialis anterior"))
  const[glutmaxemg, setglutemg]=useState(jsonData.filter(item => item['Muscle [% max]'] =="Gluteus maximus"))
  const[kneeemg, setkneeemg]=useState(jsonData.filter(item => item['Muscle [% max]'] =="Rectus femoris"))
  const[gastrocemg, setgastrocemg]=useState(jsonData.filter(item => item['Muscle [% max]'] =="Gastrocnemius medialis"))
  const[soleusemg, setsoleusemg]=useState(jsonData.filter(item => item['Muscle [% max]'] =="Soleus"))

  const[hammiesemg, sethammieemg]=useState(jsonData.filter(item => item['Muscle [% max]'] =="Biceps femoris"))
  const [tibemgcurrent,settibcurrent]=useState()
  const [glutmaxemgcurrent,setglutmaxcurrent]=useState()
  const [hammieemgcurrent,sethammiecurrent]=useState()
  const [kneeemgcurrent,setkneecurrent]=useState()
  const [gastrocemgcurrent,setgastroccurrent]=useState()
  const [soleusemgcurrent,setsoleuscurrent]=useState()
  const [scene, setScene] = useState(null);

  const [skeletons,setSkeletons]=useState()

  const [isDragging, setIsDragging] = useState(false);  // To track if the object is being dragged
  const [dragOffset, setDragOffset] = useState(new Vector3(0, 0, 0));  // To store the offset when dragging starts
  const [selectedObject, setSelectedObject] = useState(null);  // To track the selected object



  let box;
let skeleton
let animatable
const startframe=200
const endframe=231

const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  setScene(scene)
  //Animation.AllowMatricesInterpolation = true;
  const canvas = scene.getEngine().getRenderingCanvas();
  var camera = new ArcRotateCamera("camera1", 0,0, 0, new Vector3(0, 2, 0), scene);
    camera.attachControl(canvas, true);

  camera.lowerRadiusLimit = 1;
  camera.upperRadiusLimit = 100;
    camera.wheelDeltaPercentage = 0.01;
 

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);
  var helper = scene.createDefaultEnvironment({
    enableGroundShadow: false,
    createSkybox: false,

});

helper.setMainColor(Color3.Gray());

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)

  var light = new HemisphericLight("light1", new Vector3(0, 15000, 0), scene);
	light.intensity = 1;
	light.specular = Color3.Black();

    var light2 = new DirectionalLight("dir01", new Vector3(0, 0, -1.0), scene);
    light2.position = new Vector3(0, 0, 5);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 1;

  // Our built-in 'box' shape.
 
  // Our built-in 'ground' shape.

  
  var ground =MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
 
  SceneLoader.ImportMesh("", "http://localhost:3000/", "walkingboyyglb.glb", scene, function (meshes,skeletons) {
   console.log(skeletons)
   console.log(meshes)
   var anim = scene.getMeshByName("__root__");
   console.log(anim)
   console.log("Skeletons:", scene.skeletons);
   //all bones 
   console.log(scene)
   scene.animationsEnabled=false
   const animationGroups = scene.animationGroups;
    animationGroups.forEach((animationGroup) => {
        animationGroup.stop(); // Stop each animation group
    });
   setSkeletons(scene.skeletons[0].bones)

   scene.skeletons[0].bones[4].rotation=new Vector3(0,3,0)
   
   const quatRotY = new Quaternion();
   Matrix.RotationY(0.10).decompose(undefined, quatRotY);

   //skeletons[0].bones[0].setPosition(new BABYLON.Vector3(3, 1, 0), BABYLON.Space.BONE, meshes[0]);
   /*
   scene.registerBeforeRender(() => {            
       scene.skeletons[0].bones[4].getTransformNode().rotationQuaternion.multiplyInPlace(quatRotY);
});
*/
  

    
    // Optionally adjust the camera's radius to fit the object
    
    //end camera 
    
    //skeleton.bones[4].rotate(Axis.Y,20,Space.LOCAL)
    

    


    
    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () {
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }
/*
    var pointerDown = function (mesh) {
            currentMesh = mesh;
            startingPoint = getGroundPosition();
            if (startingPoint) { // we need to disconnect camera from canvas
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }
    }

    var pointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    }

    var pointerMove = function () {
        if (!startingPoint) {
            return;
        }
        var current = getGroundPosition();
        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

    scene.onPointerObservable.add((pointerInfo) => {      		
        switch (pointerInfo.type) {
			case PointerEventTypes.POINTERDOWN:
				if(pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != ground) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh)
                }
				break;
			case PointerEventTypes.POINTERUP:
                    pointerUp();
				break;
			case PointerEventTypes.POINTERMOVE:          
                    pointerMove();
				break;
        }
    });



    
   
    */
    
   
        
       
       
        //216 has to be the middle
        //253 is end

        //perhaps 20 is start 29 contralateral footoff, 39 contralateral foot strike 
        //44 isipalaterla foot off 
        //end of cycle 50 perhaps


        
        
        

        
  
  })
};


/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */



  

  


  



const onRender = () => {

  

  if(animatableref.current){
    skeleton.bones[4].rotate(Axis.Y,20,Space.LOCAL)
  
    setCurrentFrame(animatableref.current.masterFrame)

   
   


  }
  

 



 
};



function frame(animatable,e){

  
  if(animatable){
    setCurrentFrame(parseFloat(e.target.value))
    animatable.goToFrame(parseFloat(e.target.value))
    
   // console.log(animatable._goToFrame)

  }
  
}

function pause(isPlaying,animatableref){
  setIsPlaying(!isPlaying)
  
  if(animatableref._paused){
    animatableref._paused=false

  }else{
    animatableref._paused=true
  }
  
  

}

function getframe(frame){
  return frame-startframe
}

const dict={
   //216 has to be the middle
        //253 is end

        //perhaps 20 is start 29 contralateral footoff, 39 contralateral foot strike 
        //44 isipalaterla foot off 
        //end of cycle 50 perhaps
  "210":"start",
  "219":"contralateral footoff",
  "230":"contralateral footstrike",
  "234":"isilateral footpoff",
  "240":"end"
}

function togglespeed(e){
  setSpeed(e.target.value)
  animatableref.current._speedRatio=speed

}
  async function add(){
  console.log(scene)
  if(scene!=null
  ){
    //var ground =MeshBuilder.CreateBox("box", { size: 100 }, scene)
    
    SceneLoader.ImportMesh("", "http://localhost:3000/","skull.babylon", scene, (meshes) => {
      // The 'meshes' array will contain all the meshes loaded from the GLB file
     
      const ground = meshes[0];  // Assuming the first mesh is the one you want
      

      // Create the utility layer and gizmos
      const utilLayer = new UtilityLayerRenderer(scene);

      // Create the gizmos for rotation and position
      const gizmo = new PlaneRotationGizmo(new Vector3(0, 1, 0), Color3.FromHexString("#00b894"), utilLayer);
      const gizmopos = new PositionGizmo(utilLayer);

      // Attach the gizmos to the imported mesh
      gizmo.attachedMesh = ground;
      gizmopos.attachedMesh = ground;

      // Updating using local rotation and position
      gizmo.updateGizmoRotationToMatchAttachedMesh = true;
      gizmo.updateGizmoPositionToMatchAttachedMesh = true;
      gizmo.scale = 10;

      // Optional: Set the position of the mesh if necessary
      ground.position = new Vector3(0, 1, 0); // Set position to just above the ground
    });  
    //var ground = ground.meshes[1];
    //var utilLayer = new UtilityLayerRenderer(scene);

    // Create the gizmo and attach to the box
    //var gizmo = new PlaneRotationGizmo(new Vector3(0,1,0), Color3.FromHexString("#00b894"), utilLayer);
    //var gizmopos = new PositionGizmo(utilLayer);
    //gizmo.attachedMesh = ground
    //gizmopos.attachedMesh=ground

    // Updating using local rotation
    //gizmo.updateGizmoRotationToMatchAttachedMesh = true;
    //gizmo.updateGizmoPositionToMatchAttachedMesh = true;
    //gizmo.scale = 10;
 
  //sphere.position = new Vector3(5, 1, 0); // Set position

  }
  
}

function rotate(angle){
  console.log(skeletons[4].rotation)
var an=angle.target.value
setRotation(an)
console.log(an)
var rad=(an * Math.PI) / 180
console.log(rad)
  //skeletons[4].rotate(Axis.Y,rad,Space.LOCAL)
  var cc= new Vector3(0,rad,0)
  //skeletons[4].getTransformNode().rotationQuaternion.multiplyInPlace(new Quaternion())

  // Apply the new rotation to the bone
  var bone = skeletons[4]// Access the specific bone

  // Create a new rotation quaternion for Y-axis rotation
  var quatRotation = Quaternion.RotationAxis(Axis.Y, rad);
  
  // Apply the rotation to the bone's transform node
  bone.getTransformNode().rotationQuaternion = quatRotation;

}

  return <div>
    <h1 className="text-3xl font-bold underline">
      Gait Visualiser
    
      </h1>
      <h2>
        Data source:
        https://pubmed.ncbi.nlm.nih.gov/21123071/
<br></br>A multiple-task gait analysis approach: kinematic, kinetic and EMG reference data for healthy young and adult subjects

      </h2>
      
    {Math.round(currentFrame-startframe)}
    <br></br>
    <div>
        Slide to control gait cycle
      </div>
    <div className='w-screen flex flex-col lg:flex-row'>
    <section className='lg:w-1/2 mt-4 lg:mt-0'> 
      <input
        type="range"
        className='w-full'
        min={startframe}
        max={endframe} // Set total frames here
        value={currentFrame}
        step="0.05"
        onChange={(e) => frame(animatableref.current,e)}
      />
      <div>
        Slide to Adjust Speed
      </div>

      <input
        type="range"
        className='w-full'
        min={0}
        step="0.01"
        max={1} // Set total frames here
        value={speed}
        
        onChange={(e) => {togglespeed(e)}}
      />
      

      
      <div
        class={`w-16 h-16 flex flex-row items-center gap-2 justify-center ${isPlaying?"bg-red-500":"bg-green-500"} rounded-full shadow-lg hover:cursor-pointer hover:drop-shadow-xl  hover:scale-105`}>
        <button onClick={() => {
          
          pause(isPlaying,animatableref.current)
           }}>
           {isPlaying ? "Pause" : "Play"}
         </button>
    </div>
       
     <br></br>
  <SceneComponent className='w-full' antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />

    </section>
    <section className='lg:w-1/2 mt-4 lg:mt-0'>
      Output panel
      
     
      <div>
        <button onClick={()=>{add()}}>Add</button>
      <input
        type="range"
        className='w-full'
        min={-90}
        step="0.000001"
        max={90} // Set total frames here
        value={rotation}
        
        onChange={(e) => {
          //setRotation(e.target.value);
          rotate(e)
        }}
      />
        </div>
        
        <div>
        
        </div>
       
    <br></br>
    
    </section>
    

    </div>
   
  
</div>

}
 


export default App;
