/**
 * Delays execution for a specified number of milliseconds.
 * @param {number} ms - Milliseconds to sleep.
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates deterministic random hours for the current day.
 * Uses a linear congruential generator (LCG) seeded by the date.
 * @param {number} startHour - Earliest hour (inclusive).
 * @param {number} choices - Number of hours to select.
 * @returns {number[]} - Sorted array of winning hours.
 */
function getWinningHoursForToday(startHour = 9, choices = 4) {
    const dateSeed = new Date().toISOString().split('T')[0];
    const seed = dateSeed.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);

    // Simple seeded random (LCG)
    const hours = [];
    let currentSeed = seed;

    while (hours.length < choices) {
        currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
        const hour = startHour + (currentSeed % 11); // Range: startHour to startHour + 10
        if (!hours.includes(hour)) {
            hours.push(hour);
        }
    }
    return hours.sort((a, b) => a - b);
}

module.exports = {
    sleep,
    getWinningHoursForToday
};
