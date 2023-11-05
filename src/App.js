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
import { FreeCamera,DirectionalLight,Color3,Animation,ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder,SceneLoader,AnimationPropertiesOverride,StandardMaterial } from "@babylonjs/core";
// uses above component in same directory
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


  let box;
let skeleton
let animatable
const startframe=200
const endframe=231
const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  Animation.AllowMatricesInterpolation = true;
  const canvas = scene.getEngine().getRenderingCanvas();
  var camera = new ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 3, new Vector3(0, 100, 10), scene);
    camera.attachControl(canvas, true);

    camera.lowerRadiusLimit = 200;
    camera.upperRadiusLimit = 1000;
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

    var light2 = new DirectionalLight("dir01", new Vector3(0, 15000, -1.0), scene);
    light2.position = new Vector3(0, 150, 5);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 1;

  // Our built-in 'box' shape.
 
  // Our built-in 'ground' shape.

  
  var ground =MeshBuilder.CreateGround("ground", { width: 600, height: 600 }, scene);
 
  SceneLoader.ImportMesh("", "http://localhost:3000/", "texture_multiple_v2.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    const basebody = new StandardMaterial('base_body', scene);
basebody.diffuseColor = newMeshes[0].material.subMaterials[0]
    skeleton = skeletons[0];
    console.log(skeleton)
    console.log(newMeshes[0].material.subMaterials[1])
    base_material.current=newMeshes[0].material.subMaterials[0]
    anteriorthigh_material.current= newMeshes[0].material.subMaterials[2]
    glutmax_material.current=newMeshes[0].material.subMaterials[5]
    hammies_material.current=newMeshes[0].material.subMaterials[3]
    knee_material.current=newMeshes[0].material.subMaterials[1]
    gastroc_material.current=newMeshes[0].material.subMaterials[4]
    
    soleus_material.current=newMeshes[0].material.subMaterials[6]
    
    
    skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
        skeleton.animationPropertiesOverride.enableBlending = true;
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton.animationPropertiesOverride.loopMode = 1;
        var walkRange = skeleton.getAnimationRange("walking");
        const totalFrames = walkRange.to - walkRange.from + 1;
        
       
        animatable= scene.beginAnimation(skeleton, startframe, endframe, true, 1.0)
        //216 has to be the middle
        //253 is end

        //perhaps 20 is start 29 contralateral footoff, 39 contralateral foot strike 
        //44 isipalaterla foot off 
        //end of cycle 50 perhaps


        
        animatableref.current=scene.beginAnimation(skeleton, startframe, endframe, true, 1.0)
        
        

        
  
  })
};


/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
function map(input,output_end,output_start,input_end,input_start){
  var slope = (output_end - output_start) / (input_end - input_start)
return  output_start + slope * (getframe(input) - input_start)

}

function map2(input,output_end,output_start,input_end,input_start){
  var slope = (output_end - output_start) / (input_end - input_start)
return  output_start + slope * (input - input_start)

}
useEffect(()=>{



  settibcurrent(tibemg.filter(item=>item['% Gait Cycle']==`${Math.round(percentage)}%`))
  setglutmaxcurrent(glutmaxemg.filter(item=>item['% Gait Cycle']==`${Math.round(percentage)}%`))
  sethammiecurrent(hammiesemg.filter(item=>item['% Gait Cycle']==`${Math.round(percentage)}%`))
  setkneecurrent(kneeemg.filter(item=>item['% Gait Cycle']==`${Math.round(percentage)}%`))
  setgastroccurrent(gastrocemg.filter(item=>item['% Gait Cycle']==`${Math.round(percentage)}%`))
  setsoleuscurrent(soleusemg.filter(item=>item['% Gait Cycle']==`${Math.round(percentage)}%`))
  
  if(anteriorthigh_material.current&&base_material.current&&tibemgcurrent){
  anteriorthigh_material.current.emissiveColor=new Color3(map2(tibemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
  anteriorthigh_material.current.diffuseColor=new Color3(map2(tibemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
  
  }
  if(glutmax_material.current&&base_material.current&&glutmaxemgcurrent){
    glutmax_material.current.emissiveColor=new Color3(map2(glutmaxemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
    glutmax_material.current.diffuseColor=new Color3(map2(glutmaxemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
    
    }

  if(hammies_material.current&&base_material.current&&hammieemgcurrent){
    hammies_material.current.emissiveColor=new Color3(map2(hammieemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
    hammies_material.current.diffuseColor=new Color3(map2(hammieemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
    
    }

    if(gastroc_material.current&&base_material.current&&gastrocemgcurrent){
      gastroc_material.current.emissiveColor=new Color3(map2(gastrocemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
      gastroc_material.current.diffuseColor=new Color3(map2(gastrocemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
      
      }

      if(knee_material.current&&base_material.current&&kneeemgcurrent){
        knee_material.current.emissiveColor=new Color3(map2(kneeemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
        knee_material.current.diffuseColor=new Color3(map2(kneeemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
        
        }
        if(soleus_material.current&&base_material.current&&soleusemgcurrent){
          soleus_material.current.emissiveColor=new Color3(map2(soleusemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
          soleus_material.current.diffuseColor=new Color3(map2(soleusemgcurrent[0]['adult_mean'],1,0,0.18,0), 0,0)
          
          }
  if(getframe(currentFrame)>=0 && getframe(currentFrame)<=9){

    setGaitphase("contralateral foot off")
    setpercent(map(currentFrame,11,0,9,0))
  


  }

  else if(getframe(currentFrame)>9 && getframe(currentFrame)<=18){

    setGaitphase("cobtralateral footstriek")
    setpercent(map(currentFrame,50,11,18,9))
    


  }
  else if(getframe(currentFrame)>18 && getframe(currentFrame)<=24){

    setGaitphase("ispilateral footoff")
    setpercent(map(currentFrame,61,50,24,18))



  }

  else if(getframe(currentFrame)>24 && getframe(currentFrame)<=31){

    setGaitphase("end")
    setpercent(map(currentFrame,100,61,31,24))
   


  }


  


},[currentFrame])
const onRender = () => {
  if(animatableref.current){
  
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

const data = {
  labels,
  datasets: [
    {
      label: '%of max EMG ',
      data: tibemgcurrent ?[(kneeemgcurrent[0]['adult_mean']/1)*100,(hammieemgcurrent[0]['adult_mean']/1)*100,(tibemgcurrent[0]['adult_mean']/1)*100,(gastrocemgcurrent[0]['adult_mean']/1)*100,(soleusemgcurrent[0]['adult_mean']/1)*100,(glutmaxemgcurrent[0]['adult_mean']/1)*100]: [null, 5, 5, 5, 5,5],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};
  return <div>
    <h1 className="text-3xl font-bold underline">
      Gait Visualiser
      </h1>
      
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
        percent: {Math.round(percentage)}
        </div>
        
        <div>
        
        </div>
       
    <br></br>
    <Bar options={options} data={data} />
    </section>
    

    </div>
   
  
</div>

}
 


export default App;
