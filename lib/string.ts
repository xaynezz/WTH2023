export function removeNewlines(inputStr: string) {
    return inputStr.replace(/[\r\n]+/g, ' ');
}
