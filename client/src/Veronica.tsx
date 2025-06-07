import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
// We no longer need SkeletonUtils for this approach
// import { SkeletonUtils } from 'three-stdlib' 

// Using the explicit '?url' import that worked for you.
import modelUrl from '/src/assets/sprites/veronica.glb?url'

export function Veronica(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null!)
  
  // useGLTF provides the scene and its animations
  const { scene, animations } = useGLTF(modelUrl)
  
  // useAnimations will correctly target the animated skeleton within the scene
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const animationName = 'mixamo.com';
    const action = actions[animationName];

    if (action) {
        // Set the animation to loop and play
        action
          .reset()
          .setLoop(THREE.LoopRepeat)
          .fadeIn(0.5)
          .play();
    } else {
        console.warn(`Animation "${animationName}" not found!`);
    }
    
    return () => {
        if (action) {
          action.fadeOut(0.5);
        }
    }
  }, [actions])

  // We pass the group ref to useAnimations, and then place the scene
  // inside the group.
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(modelUrl)