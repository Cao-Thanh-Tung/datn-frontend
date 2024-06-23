export function getTimeString(n: number): String {
    let h = Math.floor(n / 3600);
    let m = Math.floor((n % 3600) / 60);
    if (m < 10) {
        return `${h}:0${m}`;
    } else {
        return `${h}:${m}`;
    }
}
