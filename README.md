# Computer Graphics - Exercise 6 - WebGL Basketball Court

## Group Members
- [Liraz Gabbay]
- [Noa Erben]

## How to Run
- Clone the repository.
- Make sure you have Node.js installed.
- Run the server with: `node index.js`
- Access at http://localhost:8000 in your web browser


## Controls Overview

| Action                    | Key(s)                            |
|---------------------------|------------------------------------|
| Move Ball                 | Arrow Keys (`↑ ↓ ← →`)             |
| Increase Shot Power       | `W`                                |
| Decrease Shot Power       | `S`                                |
| Shoot Basketball          | `Spacebar`                         |
| Reset Ball                | `R`                                |
| Toggle Camera Orbit       | `O`                                |


## Description of physics system implementation
- This simulation applies real-world physics to simulate a realistic basketball shot. The mechanics combine projectile motion, collision response, and rotation using time-based updates (i.e., frame-by-frame animation with ∆t ≈ 1/60s).
- When a shot is triggered, the basketball follows a parabolic path, governed by kinematic equations:
    - Vertical (Y-axis) Motion — Free Fall with Gravity:
        - vy(t) = vy₀ + a * t
        - y(t)  = y₀ + vy₀ * t + ½ * a * t²
    - Horizontal (X/Z-axis) Motion — Constant Velocity:
        - vx(t) = constant
        - vz(t) = constant
        - x(t)  = x₀ + vx * t
        - z(t)  = z₀ + vz * t
        - No acceleration in X/Z direction (except during rim bounces or friction)
    - The ball's arc is created by combining the above into 3D vector motion.

- Initial Shot Velocity Vector
    - To shoot the ball, we calculate a 3D velocity vector based on direction and shot power     

-  Rotation (Spin) During Flight
    - While airborne, the ball rotates around the axis perpendicular to its velocity:
        - rotationAxis = velocity × (0, 1, 0)
    - Rotation speed is proportional to velocity magnitude

- Collision Mechanics
    - Hitting the Rim:
        - It slows down, because energy is lost in the bounce:
            - vx = vx * 0.5
            - vy = vy * 0.7
            - vz = vz * 0.5
    - Hitting the Court Boundaries:
        - It bounces off the wall in the opposite direction.
            - vx *= -0.5  
            - vz *= -0.5  
    - Hitting the Floor (Ground Bounce):
        - It bounces up, but with less height each time.
        - It also rolls forward and slowly stops because of friction:
            - vy = -vy * 0.35  
            - vx *= 0.7  
            - vz *= 0.7  
    - Friction & Rolling Decay    
        - Once the ball is rolling:
         - vx *= 0.92
         - vz *= 0.92
        - This simulates energy loss due to surface friction until the ball stops naturally.

## Features
- Fully Modeled Basketball Court
Complete with real-world dimensions, textured floor, center circle, free-throw areas, three-point arcs, and boundary lines.

- Procedural Chain Net on Each Hoop
Realistic 3D chain nets created from interlinked torus segments with vertical and diagonal strands.

- Bleachers
Stadium-style seating with 10 rows and 52 seats per row on both sides of the court.

- Dynamic Scoreboard
Canvas-based floating digital scoreboard showing live updates for HOME and GUEST scores.

- Visual Trail Effect for Shots
Fading trail line renders during flight, illustrating the ball’s motion and trajectory.

- Bonus System

    - Combo Bonus: +1 point for back-to-back successful shots

    - Swish Bonus: +1 point for clean shots (ball does not touch the rim)

- Sound Effects

    - hit sound when a shot is made

    - Miss sound when a shot fails

- Stats Panel - Real-time display of:

    - Total Score

    - Shot Attempts

    - Shots Made

    - Shooting Accuracy (%)

    - Swish Count

    - Combo Count

- User Interface Overlays

    - ? Help button displays full control guide

    - Styled popup messages 

    - Live power meter bar with percentage label

- Power-Based Shooting System
Adjust shot strength using W/S keys with a visual power meter. Affects ball speed and arc height.



## External Assets
- Textures: 
    - `court_texture.jpg`
    - `basketball_texture.jpg`
    - `backboard_brand.jpg`
- Audio:
    - `shot_hit.mp3`
    - `shot_miss.mp3`
- All located in the `src/` directory.


## All project-related videos are available in the following Google Drive folder:  

https://drive.google.com/drive/folders/1fHH6Ily7duPPEbevxlpvLkcNcS-XIr6e?usp=sharing