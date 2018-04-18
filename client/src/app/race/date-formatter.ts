export class DateFormatter {
    public static DateToMinSecMillisec(date: Date): string {
        const PADDING: number = 2;

        return date.getMinutes().toString().padStart(PADDING, "0") + ":" +
               date.getSeconds().toString().padStart(PADDING, "0") + ":"  +
               date.getMilliseconds().toString().padEnd(PADDING, "0").substr(0, PADDING);
    }
}
