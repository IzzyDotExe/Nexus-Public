// Generate random color for CAPTCHA
export const generateRandomColor = () => {
    const colors = [
        '#ef4444', // red
        '#f97316', // orange
        '#eab308', // yellow
        '#22c55e', // green
        '#3b82f6', // blue
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#6b7280', // gray
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}

// Generate random transform for CAPTCHA movement
export const generateRandomTransform = () => {
    const x = (Math.random() - 0.5) * 20 // -10px to 10px
    const y = (Math.random() - 0.5) * 20 // -10px to 10px
    const rotation = (Math.random() - 0.5) * 10 // -5deg to 5deg
    return `translate(${x}px, ${y}px) rotate(${rotation}deg)`
}
