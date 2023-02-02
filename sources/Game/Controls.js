import GAME from '@/Game.js' 
import World from '@/World.js'
import EventEmitter from '@/Utils/EventEmitter.js'

class Controls extends EventEmitter
{
    constructor()
    {
        super()

        this.world = new World()
        this.viewport = this.world.viewport
        this.debug = this.world.debug
        this.scene = this.world.scene
        this.camera = this.world.camera

        this.setKeys()
        this.setPointer()

        this.on('pointerLockDown', () =>
        {
            this.viewport.pointerLock.toggle()
        })

        this.on('fullscreenDown', () =>
        {
            this.viewport.fullscreen.toggle()
        })

        this.on('debugDown', () =>
        {
            if(location.hash === '#debug')
                location.hash = ''
            else
                location.hash = 'debug'

            location.reload()
        })
    }

    setKeys()
    {
        this.keys = {}
        
        // Map
        this.keys.map = [
            {
                codes: [ 'ArrowUp', 'KeyW' ],
                name: 'forward'
            },
            {
                codes: [ 'ArrowRight', 'KeyD' ],
                name: 'strafeRight'
            },
            {
                codes: [ 'ArrowDown', 'KeyS' ],
                name: 'backward'
            },
            {
                codes: [ 'ArrowLeft', 'KeyA' ],
                name: 'strafeLeft'
            },
            {
                codes: [ 'ShiftLeft', 'ShiftRight' ],
                name: 'boost'
            },
            {
                codes: [ 'KeyP' ],
                name: 'pointerLock'
            },
            {
                codes: [ 'KeyV' ],
                name: 'viewMode'
            },
            {
                codes: [ 'KeyB' ],
                name: 'debug'
            },
            {
                codes: [ 'KeyF' ],
                name: 'fullscreen'
            },
            {
                codes: [ 'Space' ],
                name: 'jump'
            },
            {
                codes: [ 'ControlLeft', 'KeyC' ],
                name: 'crouch'
            },
        ]

        // Down keys
        this.keys.down = {}

        for(const mapItem of this.keys.map)
        {
            this.keys.down[mapItem.name] = false
        }

        // Find in map per code
        this.keys.findPerCode = (key) =>
        {
            return this.keys.map.find((mapItem) => mapItem.codes.includes(key))
        }

        // Event
        window.addEventListener('keydown', (event) =>
        {
            const mapItem = this.keys.findPerCode(event.code)
            
            if(mapItem)
            {
                this.trigger('keyDown', [ mapItem.name ])
                this.trigger(`${mapItem.name}Down`)
                this.keys.down[mapItem.name] = true
            }
        })

        window.addEventListener('keyup', (event) =>
        {
            const mapItem = this.keys.findPerCode(event.code)
            
            if(mapItem)
            {
                this.trigger('keyUp', [ mapItem.name ])
                this.trigger(`${mapItem.name}Up`)
                this.keys.down[mapItem.name] = false
            }
        })
    }

    setPointer()
    {
        this.pointer = {}
        this.pointer.down = false
        this.pointer.deltaTemp = { x: 0, y: 0 }
        this.pointer.delta = { x: 0, y: 0 }

        this.pointer.normalise = (x, y) =>
        {
            return {
                x: x / this.viewport.width,
                y: y / this.viewport.height,
            }
        }

        window.addEventListener('pointerdown', (event) =>
        {
            this.pointer.down = true
        })

        window.addEventListener('pointermove', (event) =>
        {
            const normalised = this.pointer.normalise(
                event.movementX,
                event.movementY
            )

            this.pointer.deltaTemp.x += normalised.x
            this.pointer.deltaTemp.y += normalised.y
        })

        window.addEventListener('pointerup', () =>
        {
            this.pointer.down = false
        })
    }

    update()
    {
        this.pointer.delta.x = this.pointer.deltaTemp.x
        this.pointer.delta.y = this.pointer.deltaTemp.y

        this.pointer.deltaTemp.x = 0
        this.pointer.deltaTemp.y = 0
    }
}

GAME.register('', 'Controls', Controls)
export default Controls