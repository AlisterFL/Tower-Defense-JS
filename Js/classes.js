class PlacementTower {
    constructor ({position = {x:0, y:0}}) {
        this.position = position
        this.size = 64
        this.color = 'rgba(255, 255, 255, 0.1)'
        this.occupied = false
    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, 64, 64)
    }

    update(mouse) {
        this.draw()

        if (mouse.x > this.position.x && 
            mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y && 
            mouse.y < this.position.y + this.size
        ) {
            this.color = 'white'
        } else this.color = 'rgba(255, 255, 255, 0.1)'
    }
}


class EnemySkeleton {  //création squelette
    constructor({position = {x: 0, y: 0 } }) {
        this.position = position
        this.width = 100
        this.height = 100
        this.waypointIndex = 0
        this.center = {
            x: this.position.x + this.width/2,
            y: this.position.y + this.height/2
        }
        this.radius = 50
    }

    draw() {
        context.fillStyle = 'red'
        //context.fillRect(this.position.x, this.position.y, this.width, this.height)
        context.beginPath()
        context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }

    update() {
        this.draw()

        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angle = Math.atan2(yDistance, xDistance)
        this.position.x += Math.cos(angle)
        this.position.y += Math.sin(angle)
        this.center = {
            x: this.position.x + this.width/2,
            y: this.position.y + this.height/2
        }

        if (
            Math.round(this.center.x) === Math.round(waypoint.x) && 
            Math.round(this.center.y) === Math.round(waypoint.y) &&
            this.waypointIndex < waypoints.length - 1
        ) {
            this.waypointIndex++
        }  
    }
}

class Projectile {
    constructor({ position = { x: 0, y: 0 }, enemy}) {
      this.position = position
      this.velocity = {
        x: 0,
        y: 0
      }
      this.enemy = enemy
      this.radius = 10
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'orange'
        context.fill()
    }

    update() {
        this.draw()

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x
        )

        const power = 5
        this.velocity.x = Math.cos(angle) * power
        this.velocity.y = Math.sin(angle) * power

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Building{
    constructor({ position = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 64
        this.height = 64 * 2
        this.center = {         //position projectile
            x: this.position.x + this.width / 2,        
            y: this.position.y + this.height / 4
        }
        this.projectiles = []
        this.radius = 250
        this.target
        this.frames = 0
    }

    draw() {
        context.fillStyle = 'blue'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        context.beginPath()
        context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'rgba(0, 0, 255, 0.2'
        context.fill()
    }

    update() {
        this.draw()
        if (this.frames % 100 === 0 && this.target) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target
                })
            )
        }

        this.frames++
    }
}