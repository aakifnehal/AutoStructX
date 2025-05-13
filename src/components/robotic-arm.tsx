"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import * as THREE from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, Thermometer, Droplets, RotateCcw, Play, Download } from "lucide-react"

// Define types for the exposed functionality
export type BoxGirderSegment = {
  id: string;
  index: number;
  selected: boolean;
  aiSuggested: boolean;
}

type BoxGirderViewProps = {
  onSegmentSelectionChange?: (segments: BoxGirderSegment[]) => void;
  onApplyGlue?: (segments: BoxGirderSegment[], thickness: number) => void;
}

// Performance optimized component with better visual feedback
export const BoxGirderView = memo(function BoxGirderViewComponent({ 
  onSegmentSelectionChange 
}: BoxGirderViewProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedSegments, setSelectedSegments] = useState<number[]>([])
  const [segmentInfo, setSegmentInfo] = useState<BoxGirderSegment[]>([])
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  // Reference to store the scene objects
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    segments: THREE.Mesh[] | null
    controls: OrbitControls | null
    raycaster: THREE.Raycaster | null
    mouse: THREE.Vector2 | null
    highlightedMaterial: THREE.MeshStandardMaterial | null
    originalMaterials: Map<number, THREE.Material> | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    segments: null,
    controls: null,
    raycaster: null,
    mouse: null,
    highlightedMaterial: null,
    originalMaterials: null
  })

  // Initialize Three.js scene with optimizations
  useEffect(() => {
    if (!mountRef.current) return

    // Create scene with optimized settings
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x181c20)

    // Create camera with optimal positioning
    const camera = new THREE.PerspectiveCamera(
      65, // Wider FOV for better visibility
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 5, 12) // Improved initial camera position

    // Create renderer with optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance",
      alpha: false // No need for alpha in this case
    })
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1) // Limit to 2x for performance
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)

    // Add orbit controls with better settings
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    
    // Using any type to bypass TypeScript errors
    const anyControls = controls as any;
    anyControls.rotateSpeed = 0.8;
    anyControls.zoomSpeed = 1.2;
    anyControls.minDistance = 5;
    anyControls.maxDistance = 20;
    anyControls.minPolarAngle = Math.PI / 6; // Limit how high user can go
    anyControls.maxPolarAngle = Math.PI / 2; // Don't allow to go below horizon

    // Setup materials including highlight material
    const highlightedMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdd44,
      roughness: 0.4,
      metalness: 0.5,
      transparent: true,
      opacity: 0.9,
      emissive: new THREE.Color(0xffdd44),
      emissiveIntensity: 0.2
    })

    // Create box girder model
    const segments: THREE.Mesh[] = []
    const originalMaterials = new Map<number, THREE.Material>()

    // Create a box girder with multiple segments
    createBoxGirderModel(scene, segments, originalMaterials)

    // Setup raycaster for interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Add better lighting
    setupOptimizedLighting(scene)

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      segments,
      controls,
      raycaster,
      mouse,
      highlightedMaterial,
      originalMaterials
    }

    // Animation loop with performance optimization
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Add raycaster for segment selection
    setupRaycaster(renderer, camera, segments, raycaster, mouse)

    // Simulate AI suggestions
    simulateAISuggestions()

    // Handle window resize and optimize for mobile
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Initial animation to rotate model slightly
    initialCameraAnimation(camera, controls)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(frameId)
      controls.dispose()
      
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement)
        renderer.dispose()
      }
      
      // Dispose geometries and materials
      if (segments) {
        segments.forEach(segment => {
          segment.geometry.dispose()
          if (Array.isArray(segment.material)) {
            segment.material.forEach(m => m.dispose())
          } else {
            segment.material.dispose()
          }
        })
      }
    }
  }, [])

  // Create box girder model with enhanced visuals and labels
  const createBoxGirderModel = (
    scene: THREE.Scene, 
    segments: THREE.Mesh[],
    originalMaterials: Map<number, THREE.Material>
  ) => {
    // Main girder body with improved detail
    const mainGeometry = new THREE.BoxGeometry(8, 1.5, 2)
    const mainMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      roughness: 0.7,
      metalness: 0.2
    })
    const mainBody = new THREE.Mesh(mainGeometry, mainMaterial)
    mainBody.castShadow = true
    mainBody.receiveShadow = true
    scene.add(mainBody)

    // Add subtle details to main body
    const edgesGeometry = new THREE.EdgesGeometry(mainGeometry)
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x666666, 
      linewidth: 1
    })
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
    mainBody.add(edges)

    // Create segments that can be selected
    const segmentPositions = [
      { x: -3, y: 0, z: 1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 1" }, // Front right
      { x: -1, y: 0, z: 1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 2" }, // Front middle
      { x: 1, y: 0, z: 1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 3" }, // Front left
      { x: 3, y: 0, z: 1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 4" }, // Front far left
      { x: -3, y: 0, z: -1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 5" }, // Back right
      { x: -1, y: 0, z: -1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 6" }, // Back middle
      { x: 1, y: 0, z: -1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 7" }, // Back left
      { x: 3, y: 0, z: -1.06, width: 2, height: 1.5, depth: 0.12, id: "Segment 8" }, // Back far left
    ]

    // Initialize the segment info
    const initialSegmentInfo: BoxGirderSegment[] = segmentPositions.map((pos, index) => ({
      id: pos.id,
      index,
      selected: false,
      aiSuggested: false
    }))
    setSegmentInfo(initialSegmentInfo)

    segmentPositions.forEach((pos, index) => {
      // Create segment with beveled edges for more realistic appearance
      const geometry = new THREE.BoxGeometry(pos.width, pos.height, pos.depth, 1, 1, 1)
      const material = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        transparent: true,
        opacity: 0.85,
        roughness: 0.5,
        metalness: 0.3
      })

      const segment = new THREE.Mesh(geometry, material)
      segment.position.set(pos.x, pos.y, pos.z)
      segment.userData = { index, id: pos.id, selected: false, aiSuggested: false }
      segment.castShadow = true
      segment.receiveShadow = true
      
      // Store original material
      originalMaterials.set(index, material.clone())
      
      // Add subtle glow to edges to make segments more visible
      const edgesGeometry = new THREE.EdgesGeometry(geometry)
      const edgesMaterial = new THREE.LineBasicMaterial({ 
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.7
      })
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
      segment.add(edges)
      
      scene.add(segment)
      segments.push(segment)
    })
  }

  // Setup optimal lighting for better visuals
  const setupOptimizedLighting = (scene: THREE.Scene) => {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Main directional light with shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    
    // Optimize shadow map settings
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.bias = -0.001
    scene.add(directionalLight)

    // Additional fill light from opposite side
    const fillLight = new THREE.DirectionalLight(0xccffff, 0.5)
    fillLight.position.set(-5, 3, -5)
    scene.add(fillLight)

    // Subtle accent light from below for depth
    const accentLight = new THREE.DirectionalLight(0xffffcc, 0.2)
    accentLight.position.set(0, -3, 0)
    scene.add(accentLight)
  }

  // Animate camera to better initial position
  const initialCameraAnimation = (camera: THREE.PerspectiveCamera, controls: OrbitControls) => {
    const startPosition = new THREE.Vector3(0, 5, 12)
    const targetPosition = new THREE.Vector3(2, 4, 10)
    const duration = 1800 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // cubic ease-out

      // Interpolate position
      camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // Setup raycaster for segment selection with hover effects
  const setupRaycaster = (
    renderer: THREE.WebGLRenderer, 
    camera: THREE.PerspectiveCamera, 
    segments: THREE.Mesh[],
    raycaster: THREE.Raycaster,
    mouse: THREE.Vector2
  ) => {
    // Mouse move handler for hover effects
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera)

      // Check for intersections
      const intersects = raycaster.intersectObjects(segments)

      if (intersects.length > 0) {
        const hoveredObject = intersects[0].object as THREE.Mesh
        const segmentIndex = hoveredObject.userData.index
        
        if (hoveredSegment !== segmentIndex) {
          // Remove highlight from previous segment
          if (hoveredSegment !== null) {
            resetHoveredSegment()
          }
          
          // Highlight current segment if not already selected
          if (!selectedSegments.includes(segmentIndex)) {
            setHoveredSegment(segmentIndex)
            highlightSegment(segmentIndex)
            
            // Change cursor to pointer to indicate clickable
            renderer.domElement.style.cursor = 'pointer'
          } else {
            renderer.domElement.style.cursor = 'pointer'
          }
        }
      } else if (hoveredSegment !== null) {
        // Remove highlight when not hovering over any segment
        resetHoveredSegment()
        renderer.domElement.style.cursor = 'default'
      }
    }

    // Click handler for selection
    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera)

      // Check for intersections
      const intersects = raycaster.intersectObjects(segments)

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object as THREE.Mesh
        const segmentIndex = selectedObject.userData.index

        // Toggle selection
        toggleSegmentSelection(segmentIndex)
      }
    }

    // Highlight a segment with a subtle glow
    const highlightSegment = (index: number) => {
      if (!sceneRef.current.segments || !sceneRef.current.highlightedMaterial) return;
      
      // Check if segment exists at this index
      if (index >= sceneRef.current.segments.length) return;
      
      const segment = sceneRef.current.segments[index];
      if (!segment) return; // Skip if segment is undefined
      
      // Create temporary highlight material by cloning original but with altered properties
      const material = sceneRef.current.originalMaterials?.get(index)?.clone() as THREE.MeshStandardMaterial;
      if (material) {
        material.emissive = new THREE.Color(0xffdd44);
        material.emissiveIntensity = 0.3;
        material.opacity = 0.95;
        segment.material = material;
      }
    }

    // Reset hovered segment
    const resetHoveredSegment = () => {
      if (hoveredSegment === null || !sceneRef.current.segments) return;
      
      // Check if hovered segment exists at this index
      if (hoveredSegment >= sceneRef.current.segments.length) {
        setHoveredSegment(null);
        return;
      }
      
      const segment = sceneRef.current.segments[hoveredSegment];
      if (!segment) {
        setHoveredSegment(null);
        return;
      }
      
      const isSelected = selectedSegments.includes(hoveredSegment);
      
      if (isSelected && segment.material) {
        const material = segment.material as THREE.MeshStandardMaterial;
        material.emissive = new THREE.Color(0);
        material.color.set(0xffd600);
      } else if (segment.userData.aiSuggested) {
        resetToOriginalMaterial(hoveredSegment);
        if (segment.material) {
          const material = segment.material as THREE.MeshStandardMaterial;
          material.color.set(0x4caf50);
        }
      } else {
        resetToOriginalMaterial(hoveredSegment);
      }
      
      setHoveredSegment(null);
    }
    
    // Reset to original material
    const resetToOriginalMaterial = (index: number) => {
      if (!sceneRef.current.segments || !sceneRef.current.originalMaterials) return
      
      const segment = sceneRef.current.segments[index]
      const originalMaterial = sceneRef.current.originalMaterials.get(index)
      
      if (originalMaterial) {
        segment.material = originalMaterial.clone()
      }
    }

    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('click', handleClick)

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove)
      renderer.domElement.removeEventListener('click', handleClick)
    }
  }

  // Toggle segment selection with better visual feedback
  const toggleSegmentSelection = (segmentIndex: number) => {
    if (!sceneRef.current.segments) return;

    // Check if the segment exists at the given index
    const segment = sceneRef.current.segments[segmentIndex];
    if (!segment) return; // Skip if segment doesn't exist
    
    const isSelected = selectedSegments.includes(segmentIndex);

    // Update selection state
    if (isSelected) {
      setSelectedSegments((prev) => prev.filter((idx) => idx !== segmentIndex));
      
      // Check if segment exists and has a material before modifying
      if (segment.userData.aiSuggested && segment.material) {
        const material = segment.material as THREE.MeshStandardMaterial;
        material.color.set(0x4caf50);
      } else {
        resetToOriginalMaterial(segmentIndex);
      }
      
      segment.userData.selected = false;
      
      // Add subtle animation to indicate deselection
      animateSegmentScale(segment, 1.05, 1.0);
    } else {
      setSelectedSegments((prev) => [...prev, segmentIndex]);
      
      // Create selection material
      const selectedMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd600,
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0.9
      });
      
      // Safely set the material
      segment.material = selectedMaterial;
      segment.userData.selected = true;
      
      // Add subtle animation to indicate selection
      animateSegmentScale(segment, 1.0, 1.05);
    }

    // Create standalone update function to fix the circular dependency
    updateSceneSegmentInfo();
  }

  // Create a standalone function to update segment info that doesn't use React hooks
  const updateSceneSegmentInfo = () => {
    if (!sceneRef.current.segments) return;
    
    const updatedSegments = [];
    
    for (let i = 0; i < sceneRef.current.segments.length; i++) {
      const segment = sceneRef.current.segments[i];
      updatedSegments.push({
        id: segment.userData.id,
        index: i,
        selected: selectedSegments.includes(i),
        aiSuggested: segment.userData.aiSuggested
      });
    }
    
    setSegmentInfo(updatedSegments);
    
    if (onSegmentSelectionChange) {
      onSegmentSelectionChange(updatedSegments);
    }
  };

  // Reset to original material with safety checks
  const resetToOriginalMaterial = (index: number) => {
    if (!sceneRef.current.segments || !sceneRef.current.originalMaterials) return;
    
    // Check if segment exists at the given index
    const segment = sceneRef.current.segments[index];
    if (!segment) return; // Skip if segment doesn't exist
    
    const originalMaterial = sceneRef.current.originalMaterials.get(index);
    
    if (originalMaterial) {
      segment.material = originalMaterial.clone();
    }
  }

  // Animate segment scale for better feedback
  const animateSegmentScale = (segment: THREE.Mesh, startScale: number, endScale: number) => {
    const duration = 300 // ms
    const startTime = Date.now()
    segment.scale.set(startScale, startScale, startScale)
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 2) // quadratic ease-out
      
      const scale = THREE.MathUtils.lerp(startScale, endScale, easeProgress)
      segment.scale.set(scale, scale, scale)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }

  // Simulate AI suggestions with visual indication
  const simulateAISuggestions = () => {
    if (!sceneRef.current.segments) return;
    
    // Randomly select 2-3 segments
    const numSegments = Math.floor(Math.random() * 2) + 2 // 2-3 segments
    const suggestions: number[] = []
    const availableSegments = sceneRef.current.segments.length;
    
    // Make sure we don't try to select more segments than exist
    const segmentsToSelect = Math.min(numSegments, availableSegments);

    while (suggestions.length < segmentsToSelect) {
      const randomIndex = Math.floor(Math.random() * availableSegments) // segments total
      if (!suggestions.includes(randomIndex)) {
        suggestions.push(randomIndex)
      }
    }

    // Apply suggestions with enhanced visuals
    suggestions.forEach((index) => {
      if (sceneRef.current.segments && index < sceneRef.current.segments.length) {
        const segment = sceneRef.current.segments[index];
        if (!segment) return; // Skip if segment is undefined
        
        segment.userData.aiSuggested = true;
        
        const aiSuggestedMaterial = new THREE.MeshStandardMaterial({
          color: 0x4caf50,
          roughness: 0.4,
          metalness: 0.4,
          transparent: true,
          opacity: 0.9,
          emissive: new THREE.Color(0x4caf50),
          emissiveIntensity: 0.1
        });
        
        // Safely set material
        segment.material = aiSuggestedMaterial;
        
        // Animate the AI suggestion with a subtle pulse
        pulseSegment(segment);
      }
    });

    setSelectedSegments(suggestions);
  }

  // Create a subtle pulse animation for AI suggested segments
  const pulseSegment = (segment: THREE.Mesh) => {
    if (!segment || !segment.material) return; // Safety check
    
    const duration = 1500 // ms
    const startTime = Date.now()
    const startOpacity = 0.7
    const peakOpacity = 0.9
    
    const animate = () => {
      if (!segment || !segment.material) return; // Double check segment still exists
      
      const elapsed = (Date.now() - startTime) % duration
      const progress = elapsed / duration
      const opacity = startOpacity + (peakOpacity - startOpacity) * Math.sin(progress * Math.PI)
      
      if (segment.material instanceof THREE.MeshStandardMaterial) {
        segment.material.opacity = opacity
      }
      
      // Only run for a few seconds
      if (Date.now() - startTime < 3000) {
        requestAnimationFrame(animate)
      } else if (segment.material instanceof THREE.MeshStandardMaterial) {
        segment.material.opacity = 0.9 // Set final opacity
      }
    }
    
    animate()
  }

  // Function to clear all selections - exposed for parent component
  const clearAllSelections = useCallback(() => {
    if (!sceneRef.current.segments) return;
    
    sceneRef.current.segments.forEach((segment, index) => {
      if (!segment) return; // Skip if segment doesn't exist
      
      if (segment.userData.aiSuggested) {
        const aiSuggestedMaterial = new THREE.MeshStandardMaterial({
          color: 0x4caf50,
          roughness: 0.4,
          metalness: 0.4,
          transparent: true,
          opacity: 0.9
        });
        
        segment.material = aiSuggestedMaterial;
      } else {
        resetToOriginalMaterial(index);
      }
      segment.userData.selected = false;
      segment.scale.set(1, 1, 1); // Reset scale
    });

    setSelectedSegments([]);
  }, []);

  // Function to apply glue to segments with enhanced visual feedback
  const applyGlue = useCallback((thickness: number) => {
    if (!sceneRef.current.segments) return;
    
    // Change color of selected segments with animation
    selectedSegments.forEach(index => {
      // Check if segment exists at this index
      if (index >= sceneRef.current.segments!.length) return;
      
      const segment = sceneRef.current.segments![index];
      if (!segment) return; // Skip if segment doesn't exist
      
      // Create glue applied material
      const glueAppliedMaterial = new THREE.MeshStandardMaterial({
        color: 0x2196f3,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9,
        emissive: new THREE.Color(0x2196f3),
        emissiveIntensity: 0.2
      });
      
      // Safely set material
      segment.material = glueAppliedMaterial;
      
      // Animate thickness growing effect
      animateGlueApplication(segment, thickness);
    });
  }, [selectedSegments]);

  // Animate glue application with thickness effect
  const animateGlueApplication = (segment: THREE.Mesh, thickness: number) => {
    if (!segment) return; // Safety check
    
    const originalPosition = segment.position.z;
    const direction = originalPosition > 0 ? 1 : -1;
    const targetOffset = 0.05 * thickness * direction;
    const duration = 800; // ms
    const startTime = Date.now();
    
    const animate = () => {
      if (!segment) return; // Double check segment still exists
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      
      // Move segment outward slightly to simulate glue thickness
      segment.position.z = originalPosition + (targetOffset * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  // Expose methods to parent component
  useEffect(() => {
    // Expose methods for the parent component to use
    if (typeof window !== 'undefined') {
      (window as any).boxGirderViewActions = {
        clearAllSelections,
        applyGlue,
        getSelectedSegments: () => segmentInfo.filter(s => s.selected)
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).boxGirderViewActions;
      }
    };
  }, [clearAllSelections, applyGlue, segmentInfo]);

  // Add an effect to update segment info when selectedSegments changes
  useEffect(() => {
    // Only sync the segmentInfo state with selectedSegments, no callbacks
    if (!sceneRef.current.segments) return;
    
    const updatedSegments = sceneRef.current.segments.map((segment, i) => ({
      id: segment.userData.id,
      index: i,
      selected: selectedSegments.includes(i),
      aiSuggested: segment.userData.aiSuggested
    }));
    
    // Update segment info state without triggering callbacks
    setSegmentInfo(updatedSegments);
    
  }, [selectedSegments]); // Only depend on selectedSegments

  // Make sure orbit controls are properly configured for rotation
  useEffect(() => {
    // This effect ensures orbit controls work correctly after component mounts
    if (sceneRef.current.controls) {
      const controls = sceneRef.current.controls;
      const anyControls = controls as any;
      
      // Enable rotation
      anyControls.autoRotate = false; // Disable auto-rotation
      anyControls.enableRotate = true; // Ensure rotation is enabled
      
      // Set rotation speed
      anyControls.rotateSpeed = 1.0;
      
      // Prevent zoom getting stuck
      anyControls.enableZoom = true;
      anyControls.zoomSpeed = 1.2;
      
      // Update controls to apply changes
      controls.update();
    }
  }, []);

  return (
    <div className="w-full h-full relative" ref={mountRef}>
      {/* Three.js will render here */}
      <div className="absolute top-2 left-2 text-xs text-white/70 bg-black/30 px-2 py-1 rounded pointer-events-none">
        Click on segments to select
      </div>
    </div>
  )
});

// Export the main component that will be used
export const RoboticArm = BoxGirderView;

