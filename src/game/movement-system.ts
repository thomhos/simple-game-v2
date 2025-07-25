// import { PlayerEntity, NPCEntity, ProjectileEntity, Vector2, InputState } from '../types';
// import { GameMapSystem } from './map-system';
// import { GameEntityManager } from './entity-manager';

// export class MovementSystem {
//     // Handle player movement based on input
//     static updatePlayerMovement(
//         player: PlayerEntity,
//         input: InputState,
//         mapSystem: GameMapSystem,
//         entityManager: GameEntityManager,
//         deltaTime: number
//     ): void {
//         const moveSpeed = player.speed * (deltaTime / 1000); // Convert to pixels per second
//         let direction: Vector2 = { x: 0, y: 0 };
//         let newFacingDirection = player.facingDirection;

//         // Handle input
//         if (input.keysHeld.includes('ArrowLeft') || input.keysHeld.includes('a')) {
//             direction.x = -1;
//             newFacingDirection = 'left';
//         }
//         if (input.keysHeld.includes('ArrowRight') || input.keysHeld.includes('d')) {
//             direction.x = 1;
//             newFacingDirection = 'right';
//         }
//         if (input.keysHeld.includes('ArrowUp') || input.keysHeld.includes('w')) {
//             direction.y = -1;
//             newFacingDirection = 'up';
//         }
//         if (input.keysHeld.includes('ArrowDown') || input.keysHeld.includes('s')) {
//             direction.y = 1;
//             newFacingDirection = 'down';
//         }

//         // Normalize diagonal movement
//         if (direction.x !== 0 && direction.y !== 0) {
//             const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
//             direction.x /= length;
//             direction.y /= length;
//         }

//         const isMoving = direction.x !== 0 || direction.y !== 0;

//         // Calculate new position
//         const newPosition: Vector2 = {
//             x: player.position.x + direction.x * moveSpeed,
//             y: player.position.y + direction.y * moveSpeed,
//         };

//         // Check collision with map
//         const validPosition = mapSystem.getValidMovePosition(
//             player.position,
//             newPosition,
//             player.size
//         );

//         // Check collision with other entities
//         const finalPosition = this.checkEntityCollisions(player, validPosition, entityManager);

//         // Update player
//         entityManager.updateEntity(player.id, {
//             position: finalPosition,
//             velocity: { x: direction.x * moveSpeed, y: direction.y * moveSpeed },
//             facingDirection: newFacingDirection,
//             isMoving,
//         });
//     }

//     // Handle NPC AI movement
//     static updateNPCMovement(
//         npc: NPCEntity,
//         entityManager: GameEntityManager,
//         mapSystem: GameMapSystem,
//         deltaTime: number
//     ): void {
//         const moveSpeed = npc.speed * (deltaTime / 1000);
//         let direction: Vector2 = { x: 0, y: 0 };

//         switch (npc.aiState) {
//             case 'idle':
//                 // No movement
//                 break;

//             case 'patrol':
//                 direction = this.getPatrolDirection(npc);
//                 break;

//             case 'chase':
//                 direction = this.getChaseDirection(npc, entityManager);
//                 break;

//             case 'flee':
//                 direction = this.getFleeDirection(npc, entityManager);
//                 break;
//         }

//         if (direction.x !== 0 || direction.y !== 0) {
//             // Normalize direction
//             const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
//             direction.x /= length;
//             direction.y /= length;

//             const newPosition: Vector2 = {
//                 x: npc.position.x + direction.x * moveSpeed,
//                 y: npc.position.y + direction.y * moveSpeed,
//             };

//             // Check collision with map
//             const validPosition = mapSystem.getValidMovePosition(
//                 npc.position,
//                 newPosition,
//                 npc.size
//             );

//             // Check collision with other entities
//             const finalPosition = this.checkEntityCollisions(npc, validPosition, entityManager);

//             entityManager.updateEntity(npc.id, {
//                 position: finalPosition,
//                 velocity: { x: direction.x * moveSpeed, y: direction.y * moveSpeed },
//             });
//         }
//     }

//     // Handle projectile movement
//     static updateProjectileMovement(
//         projectile: ProjectileEntity,
//         entityManager: GameEntityManager,
//         mapSystem: GameMapSystem,
//         deltaTime: number
//     ): void {
//         const moveSpeed = projectile.speed * (deltaTime / 1000);

//         const newPosition: Vector2 = {
//             x: projectile.position.x + projectile.direction.x * moveSpeed,
//             y: projectile.position.y + projectile.direction.y * moveSpeed,
//         };

//         // Check if projectile hits a wall
//         if (
//             mapSystem.isRectangleBlocked({
//                 x: newPosition.x,
//                 y: newPosition.y,
//                 width: projectile.size.x,
//                 height: projectile.size.y,
//             })
//         ) {
//             // Remove projectile on wall hit
//             entityManager.removeEntity(projectile.id);
//             return;
//         }

//         // Check collision with entities
//         entityManager.updateEntity(projectile.id, { position: newPosition });

//         const collisions = entityManager.getCollisions(projectile);
//         if (collisions.length > 0) {
//             // Handle projectile collision (damage, etc.)
//             this.handleProjectileCollision(projectile, collisions[0], entityManager);
//         }
//     }

//     // AI behavior helpers
//     private static getPatrolDirection(npc: NPCEntity): Vector2 {
//         if (!npc.patrolPoints || npc.patrolPoints.length === 0) {
//             return { x: 0, y: 0 };
//         }

//         const currentIndex = npc.currentPatrolIndex || 0;
//         const targetPoint = npc.patrolPoints[currentIndex];

//         const dx = targetPoint.x - npc.position.x;
//         const dy = targetPoint.y - npc.position.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         // If close to target, move to next patrol point
//         if (distance < 10) {
//             const nextIndex = (currentIndex + 1) % npc.patrolPoints.length;
//             // Update patrol index (you'd need to modify the entity)
//             return { x: 0, y: 0 };
//         }

//         return { x: dx / distance, y: dy / distance };
//     }

//     private static getChaseDirection(npc: NPCEntity, entityManager: GameEntityManager): Vector2 {
//         if (!npc.targetEntity) return { x: 0, y: 0 };

//         const target = entityManager.getEntity(npc.targetEntity);
//         if (!target) return { x: 0, y: 0 };

//         const dx = target.position.x - npc.position.x;
//         const dy = target.position.y - npc.position.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance === 0) return { x: 0, y: 0 };

//         return { x: dx / distance, y: dy / distance };
//     }

//     private static getFleeDirection(npc: NPCEntity, entityManager: GameEntityManager): Vector2 {
//         if (!npc.targetEntity) return { x: 0, y: 0 };

//         const target = entityManager.getEntity(npc.targetEntity);
//         if (!target) return { x: 0, y: 0 };

//         const dx = npc.position.x - target.position.x; // Opposite of chase
//         const dy = npc.position.y - target.position.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance === 0) return { x: 0, y: 0 };

//         return { x: dx / distance, y: dy / distance };
//     }

//     // Collision handling
//     private static checkEntityCollisions(
//         entity: PlayerEntity | NPCEntity,
//         newPosition: Vector2,
//         entityManager: GameEntityManager
//     ): Vector2 {
//         // Create a temporary entity state for collision checking
//         const tempEntity = { ...entity, position: newPosition };

//         // Update collision box for the temp position
//         if ('collisionBox' in tempEntity) {
//             tempEntity.collisionBox = {
//                 ...tempEntity.collisionBox,
//                 x: newPosition.x,
//                 y: newPosition.y,
//             };
//         }

//         const collisions = entityManager.getCollisions(tempEntity);

//         // If no collisions, the position is valid
//         if (collisions.length === 0) {
//             return newPosition;
//         }

//         // Handle different types of collisions
//         for (const collision of collisions) {
//             if (collision.type === 'obstacle') {
//                 // Block movement
//                 return entity.position;
//             } else if (collision.type === 'pickup' && entity.type === 'player') {
//                 // Allow movement, but trigger pickup
//                 this.handlePickupCollision(entity as PlayerEntity, collision, entityManager);
//             }
//         }

//         return newPosition;
//     }

//     private static handlePickupCollision(
//         player: PlayerEntity,
//         pickup: any,
//         entityManager: GameEntityManager
//     ): void {
//         // Mark pickup as collected
//         entityManager.updateEntity(pickup.id, { collected: true });

//         // You can add pickup effects here (score, health, etc.)
//     }

//     private static handleProjectileCollision(
//         projectile: ProjectileEntity,
//         target: any,
//         entityManager: GameEntityManager
//     ): void {
//         // Remove projectile
//         entityManager.removeEntity(projectile.id);

//         // Apply damage if target has health
//         if ('health' in target && typeof target.health === 'number') {
//             const newHealth = Math.max(0, target.health - projectile.damage);
//             entityManager.updateEntity(target.id, { health: newHealth });

//             // Remove entity if health reaches 0
//             if (newHealth <= 0) {
//                 entityManager.removeEntity(target.id);
//             }
//         }
//     }
// }
