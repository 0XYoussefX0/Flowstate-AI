const world: string = "hello world"


const switchElement = document.getElementById("switch")

if(switchElement) {
    const toggleSwitch = () => {
        const switchState = switchElement.getAttribute('aria-checked') === "true"
        switchElement.setAttribute('aria-checked', String(!switchState))
    }
    switchElement.addEventListener('click', () => {
        toggleSwitch()
    })
    switchElement.addEventListener('keydown', (e) => {
          if(e.key === "Enter" || e.key === " ") {
            toggleSwitch()
          }
    })
}