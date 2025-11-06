export class OS {
    public static OS: string | null = process.env.platformName || null;

    public static isAndroid(): boolean {
        if (this.OS === null) {
            throw new Error("Plateforme non spécifiée ! Veuillez exécuter avec platformName=android ou platformName=ios");
        }
        return this.OS.toLowerCase() === "android";
    }

    public static isIOS(): boolean {
        if (this.OS === null) {
            throw new Error("Plateforme non spécifiée ! Veuillez exécuter avec platformName=android ou platformName=ios");
        }
        return this.OS.toLowerCase() === "ios";
    }

    public static isMobile(): boolean {
        return this.isAndroid() || this.isIOS();
    }
}

