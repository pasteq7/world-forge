import * as THREE from 'three';
import { NetworkNode } from '@/types/network';

export function createTextCanvas(text: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = 256;
  canvas.height = 128;
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '24px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  return canvas;
}

// Cache textures to prevent memory leaks
const textureCache = new Map<string, THREE.Texture>();

// Add custom type for Group with dispose method
interface CustomGroup extends THREE.Group {
  dispose?: () => void;
}

export function createNode3DObject(node: NetworkNode): CustomGroup {
  const group = new THREE.Group() as CustomGroup;

  // Create a larger, more visible sphere
  const geometry = new THREE.SphereGeometry(node.val * 1.5);
  const material = new THREE.MeshPhongMaterial({
    color: node.color,
    transparent: true,
    opacity: 0.9,
    shininess: 100
  });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);

  // Improved text sprite with proper scaling
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  
  // Increased canvas size for better text quality
  canvas.width = 512;
  canvas.height = 128;

  // Clear and set background
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background with rounded corners
  context.fillStyle = 'rgba(0, 0, 0, 0.75)';
  const radius = 20;
  roundRect(context, 0, 0, canvas.width, canvas.height, radius);
  
  // Improved text rendering
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Load and ensure Inter font is used
  context.font = `bold 48px "Inter", -apple-system, sans-serif`;
  
  // Add text stroke for better visibility
  context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  context.lineWidth = 4;
  context.strokeText(node.name, canvas.width / 2, canvas.height / 2);
  context.fillText(node.name, canvas.width / 2, canvas.height / 2);

  // Use cached texture or create new one
  let texture = textureCache.get(node.name);
  if (!texture) {
    texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    textureCache.set(node.name, texture);
  }

  // Add dispose method
  const dispose = () => {
    texture?.dispose();
    textureCache.delete(node.name);
    material.dispose();
    geometry.dispose();
  };

  group.dispose = dispose;

  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    sizeAttenuation: true // Enable proper size attenuation
  });
  
  const sprite = new THREE.Sprite(spriteMaterial);
  
  // Adjust scale based on node value
  const baseScale = 15;
  sprite.scale.set(baseScale, baseScale * canvas.height / canvas.width, 1);
  sprite.position.y = node.val * 2;
  
  group.add(sprite);
  return group;
}

// Helper function for rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
} 