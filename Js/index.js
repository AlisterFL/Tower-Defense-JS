const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1280         //Dimension game
canvas.height = 768

context.fillStyle = 'white'
context.fillRect(0, 0, canvas.width, canvas.height)

const placementTowerData2D = []

for (let i = 0; i < placementTowerData.length; i+= 20) {
    placementTowerData2D.push(placementTowerData.slice(i, i + 20))
}

const placementTower = []

placementTowerData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 153) {
            placementTower.push(new PlacementTower({
                position: {
                    x: x * 64,
                    y: y * 64
                }
            }))
        }
    })
})


const image = new Image()
image.onload =  () => {
    animate()
}
image.src = 'Img/backgroundNormal1.png'


const enemies = [] //Creation ennemies
for (let i = 1; i < 3; i++) {
    const xOffset = i * 150
    enemies.push(
        new EnemySkeleton({
            position: { x: waypoints[0].x, y: waypoints[0].y - xOffset }
        })
    )
}

const buildings = []
let activeTower = undefined

function animate() {
    requestAnimationFrame(animate)

    context.drawImage(image, 0, 0)

    for (let i = enemies.length -1; i >= 0; i--) {
        const enemy = enemies[i]
        enemy.update()
    }

    placementTower.forEach(tower => {
        tower.update(mouse)
    })

    buildings.forEach((building) => {
        building.update()
        building.target = null
        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.center.x
            const yDifference = enemy.center.y - building.center.y
            const distance = Math.hypot(xDifference, yDifference)
            return distance < enemy.radius + building.radius
        })
        building.target = validEnemies[0]

        for (let i = building.projectiles.length -1; i >= 0; i--) {
            const projectile = building.projectiles[i]
        
            projectile.update()

            const xDifference = projectile.enemy.center.x - projectile.position.x
            const yDifference = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(xDifference, yDifference)
            
            // Quand projectiles touche enemy
            if (distance < projectile.enemy.radius + projectile.radius) {
                projectile.enemy.health -= 20
                if(projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy
                    })

                    if(enemyIndex > -1) enemies.splice(enemyIndex, 1)
                }
                console.log(projectile.enemy.health)
                building.projectiles.splice(i, 1)
            }
        }
    })
}

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (event) => {
    if (activeTower && !activeTower.isOccupied) {
        buildings.push(
            new Building({
                position: {
                    x: activeTower.position.x,
                    y: activeTower.position.y - 64
                }
            })
        )
        activeTower.isOccupied = true
    }
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTower = null
    for (let i = 0; i < placementTower.length; i++) {
        const tower = placementTower[i]
        if (mouse.x > tower.position.x && 
            mouse.x < tower.position.x + tower.size &&
            mouse.y > tower.position.y && 
            mouse.y < tower.position.y + tower.size
        ) {
            activeTower = tower
            break
        }
    }

})
