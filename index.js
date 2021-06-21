const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin
const config = require('./config.json');

const cybic = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: 'Cybic'
});

cybic.loadPlugin(pathfinder)
cybic.loadPlugin(pvp)

let guardPos = null

guardPos = pos

if (!bot.pvp.target) {
  moveToGuardPos()
}

function stopGuarding () {
    guardPos = null
    cybic.pvp.stop()
    cybic.pathfinder.setGoal(null)
}

function moveToGuardPos () {
    const mcData = require('minecraft-data')(cybic.version)
    cybic.pathfinder.setMovements(new Movements(bot, mcData))
    cybic.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}

cybic.on('stoppedAttacking', () => {
    if (guardPos) {
        moveToGuardPos()
    }
})

cybic.on('physicsTick', () => {
    if (!guardPos) return

    const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
    e.mobType !== 'Armor Stand' 
    
    const entity = bot.nearestEntity(filter)
    if (entity) {
      // Start attacking
      bot.pvp.attack(entity)
    }
})

cybic.on('chat', (username, message) => {
    if (message === '.guard') {
      const player = cybic.players[username]
  
      if (!player) {
        cybic.chat("I can't see you.")
        return
      }
  
      cybic.chat('I will guard that location.')
      guardArea(player.entity.position)
    }
  
    if (message === '.stop') {
      bot.chat('I will no longer guard this area.')
      stopGuarding()
    }
})